import { relations } from "drizzle-orm";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { Ingredient } from "./ingredient";
import { Recipe } from "./recipe";

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
