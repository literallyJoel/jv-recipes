import { relations, sql } from "drizzle-orm";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { z } from "zod";

import { MealPlanRecipe } from "./mealPlanRecipe";
import { User } from "./user";

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
