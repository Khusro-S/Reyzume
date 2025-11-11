import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reyzumes: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    folderId: v.optional(v.id("folders")),
    content: v.optional(v.string()),
    isPublished: v.boolean(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_folder", ["userId", "folderId"]),
  // .searchIndex("search_title", {
  //   searchField: "title",
  //   filterFields: ["userId", "isArchived"],
  // })
  folders: defineTable({
    name: v.string(),
    userId: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  }).index("by_user", ["userId"]),
});
