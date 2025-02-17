import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { z } from "zod";

import { MealPlanRecipe } from "./mealPlanRecipe";
import { RecipeIngredient } from "./recipeIngredient";
import { SharedRecipe } from "./sharedRecipe";
import { User } from "./user";

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
  name: z.string().max(50, "Name cannot be more than 50 characters").nonempty(),
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
