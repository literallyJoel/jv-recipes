import { relations } from "drizzle-orm";
import { foreignKey, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { MealPlan } from "./mealPlan";
import { Recipe } from "./recipe";

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
  mealPlanStartDate: z.coerce.date(),
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
