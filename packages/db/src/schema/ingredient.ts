import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { RecipeIngredient } from "./recipeIngredient";
import { User } from "./user";

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
