import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { Recipe } from "./recipe";
import { User } from "./user";

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
  sharedBy: one(User, {
    fields: [SharedRecipe.sharedById],
    references: [User.id],
  }),
  sharedWith: one(User, {
    fields: [SharedRecipe.sharedWithId],
    references: [User.id],
  }),
}));
