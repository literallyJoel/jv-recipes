import { relations, sql } from "drizzle-orm";
import { foreignKey, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

//=======================================//
//==============Ingredients==============//
//=======================================//
export const Ingredient = pgTable("ingredient", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id),
  name: t.varchar({ length: 50 }).notNull(),
  price: t.doublePrecision(),
  unit: t.varchar({ length: 6 }),
  amount: t.doublePrecision(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t
    .timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}));

export const CreateIngredientSchema = createInsertSchema(Ingredient, {
  name: z.string().max(50, "Name cannot be more than 50 characters").nonempty(),
  price: z.number().refine(
    (n) => {
      const decimal = n.toString().split(".")[1];
      return !decimal || decimal.length <= 2;
    },
    { message: "Invalid price provided" },
  ),
  unit: z.enum(["weight", "volume"]),
  amount: z.number().refine(
    (n) => {
      const decimal = n.toString().split(".")[1];
      return !decimal || decimal.length <= 4;
    },
    { message: "Invalid amount provided. (Max precision 4 decmials)" },
  ),
}).omit({
  userId: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateIngredientSchema = createUpdateSchema(Ingredient, {
  name: z
    .string()
    .max(50, "Name cannot be more than 50 characters")
    .nonempty()
    .optional(),
  price: z
    .number()
    .refine(
      (n) => {
        const decimal = n.toString().split(".")[1];
        return !decimal || decimal.length <= 2;
      },
      { message: "Invalid price provided" },
    )
    .optional(),
  unit: z.enum(["weight", "volume"]).optional(),
  amount: z
    .number()
    .refine(
      (n) => {
        const decimal = n.toString().split(".")[1];
        return !decimal || decimal.length <= 4;
      },
      { message: "Invalid amount provided. (Max precision 4 decmials)" },
    )
    .optional(),
  id: z.string().uuid(),
}).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const IngredientRelations = relations(Ingredient, ({ many, one }) => ({
  recipeingredient: many(RecipeIngredient),
  user: one(User, { fields: [Ingredient.userId], references: [User.id] }),
}));

//=======================================//
//=================Recipes===============//
//=======================================//
export const Recipe = pgTable("recipe", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id),
  name: t.varchar({ length: 50 }).notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}));

export const CreateRecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(
    z.object({
      id: z.string().uuid(),
      amount: z.number().refine(
        (n) => {
          const decimal = n.toString().split(".")[1];
          return !decimal || decimal.length <= 4;
        },
        { message: "Invalid amount provided (Max precision 4 decimals)" },
      ),
      unit: z.enum(["weight", "volume"]),
      imperial: z.boolean(),
    }),
  ),
});

export const UpdateRecipeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        id: z.string().uuid(),
        amount: z.number().refine(
          (n) => {
            const decimal = n.toString().split(".")[1];
            return !decimal || decimal.length <= 4;
          },
          { message: "Invalid amount provided (Max precision 4 decimals)" },
        ),
        unit: z.enum(["weight", "volume"]),
        imperial: z.boolean(),
      }),
    )
    .optional(),
});

export const RecipeRelations = relations(Recipe, ({ one, many }) => ({
  recipeIngredients: many(RecipeIngredient),
  user: one(User, { fields: [Recipe.userId], references: [User.id] }),
  sharedRecipes: many(SharedRecipe),
  mealPlanRecipes: many(MealPlanRecipe),
}));

//=======================================//
//============RecipeIngredient===========//
//=======================================//
export const RecipeIngredient = pgTable(
  "recipeingredient",
  (t) => ({
    recipeId: t
      .uuid()
      .notNull()
      .references(() => Recipe.id),
    ingredientId: t
      .uuid()
      .notNull()
      .references(() => Ingredient.id),
    unit: t.varchar({ length: 6 }),
    amount: t.doublePrecision(),
  }),
  (table) => [
    primaryKey({
      columns: [table.recipeId, table.ingredientId],
    }),
  ],
);

export const CreateRecipeIngredientSchema = createInsertSchema(
  RecipeIngredient,
  {
    recipeId: z.string().uuid(),
    ingredientId: z.string().uuid(),
    unit: z.enum(["weight", "volume"]),
    amount: z.number().refine(
      (n) => {
        const decimal = n.toString().split(".")[1];
        return !decimal || decimal.length <= 4;
      },
      { message: "Invalid amount provided (Max precision 4 decimals)" },
    ),
  },
).omit({});

export const RecipeIngredientRelations = relations(
  RecipeIngredient,
  ({ one }) => ({
    recipe: one(Recipe, {
      fields: [RecipeIngredient.recipeId],
      references: [Recipe.id],
    }),
    ingredient: one(Ingredient, {
      fields: [RecipeIngredient.ingredientId],
      references: [Ingredient.id],
    }),
  }),
);

//=======================================//
//==============SharedRecipe=============//
//=======================================//
export const SharedRecipe = pgTable("sharedrecipe", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  recipeId: t
    .uuid()
    .notNull()
    .references(() => Recipe.id),
  sharedById: t
    .uuid()
    .notNull()
    .references(() => User.id),
  sharedWithId: t
    .uuid()
    .notNull()
    .references(() => User.id),
}));

export const CreateSharedRecipeSchema = createInsertSchema(SharedRecipe, {
  recipeId: z.string().uuid(),
  sharedById: z.string().uuid(),
  sharedWithId: z.string().uuid(),
}).omit({});

export const SharedRecipeRelations = relations(SharedRecipe, ({ one }) => ({
  recipe: one(Recipe, {
    fields: [SharedRecipe.recipeId],
    references: [Recipe.id],
  }),
  user: one(User, {
    fields: [SharedRecipe.sharedById, SharedRecipe.sharedWithId],
    references: [User.id, User.id],
  }),
}));

//=======================================//
//================MealPlan===============//
//=======================================//
export const MealPlan = pgTable(
  "mealplan",
  (t) => ({
    startDate: t
      .date()
      .notNull()
      .$defaultFn(
        () => sql`CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::int+6)%7`,
      ),
    userId: t
      .uuid()
      .notNull()
      .references(() => User.id),
  }),
  (table) => [primaryKey({ columns: [table.startDate, table.userId] })],
);

export const CreateMealPlanSchema = z.object({
  startDate: z.date().optional(),
  recipes: z.array(
    z.object({
      id: z.string(),
      day: z.number().min(1).max(7),
      meal: z.enum(["breakfast", "lunch", "dinner"]),
    }),
  ),
});

export const UpdateMealPlanSchema = z.object({
  startDate: z.date(),
  recipes: z.array(
    z.object({
      id: z.string(),
      day: z.number().min(1).max(7),
      meal: z.enum(["breakfast", "lunch", "dinner"]),
    }),
  ),
});

export const MealPlanRelations = relations(MealPlan, ({ one, many }) => ({
  user: one(User, { fields: [MealPlan.userId], references: [User.id] }),
  mealPlanRecipes: many(MealPlanRecipe),
}));

//=======================================//
//============MealPlanRecipe=============//
//=======================================//
export const MealPlanRecipe = pgTable(
  "mealplanrecipe",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    mealPlanStartDate: t.date().notNull(),
    userId: t.uuid().notNull(),
    recipeId: t
      .uuid()
      .notNull()
      .references(() => Recipe.id),
    day: t.smallint().notNull(),
    meal: t.varchar({ length: 9 }).notNull(),
  }),
  (table) => [
    foreignKey({
      columns: [table.mealPlanStartDate, table.userId],
      foreignColumns: [MealPlan.startDate, MealPlan.userId],
    }),
  ],
);

export const CreateMealPlanRecipeSchema = createInsertSchema(MealPlanRecipe, {
  mealPlanStartDate: z.string().uuid(),
  userId: z.string().uuid(),
  recipeId: z.string().uuid(),
  day: z
    .number()
    .min(1, "Day must be between 1 and 7")
    .max(7, "Day must be between 1 and 7"),
}).omit({
  id: true,
});

export const MealPlanRecipeRelations = relations(MealPlanRecipe, ({ one }) => ({
  mealPlan: one(MealPlan, {
    fields: [MealPlanRecipe.mealPlanStartDate, MealPlanRecipe.userId],
    references: [MealPlan.startDate, MealPlan.userId],
  }),
  recipe: one(Recipe, {
    fields: [MealPlanRecipe.recipeId],
    references: [Recipe.id],
  }),
}));

//=======================================//
//=================Users=================//
//=======================================//
export const User = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }),
  email: t.varchar({ length: 255 }).notNull(),
  emailVerified: t.timestamp({ mode: "date", withTimezone: true }),
  image: t.varchar({ length: 255 }),
}));

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = pgTable(
  "account",
  (t) => ({
    userId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: t
      .varchar({ length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: t.varchar({ length: 255 }).notNull(),
    providerAccountId: t.varchar({ length: 255 }).notNull(),
    refresh_token: t.varchar({ length: 255 }),
    access_token: t.text(),
    expires_at: t.integer(),
    token_type: t.varchar({ length: 255 }),
    scope: t.varchar({ length: 255 }),
    id_token: t.text(),
    session_state: t.varchar({ length: 255 }),
  }),
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", (t) => ({
  sessionToken: t.varchar({ length: 255 }).notNull().primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
}));

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
