import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createReyzume = mutation({
  args: {
    title: v.string(),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized or not logged in");
    }

    const userId = identity.subject;

    const resumeId = await ctx.db.insert("reyzumes", {
      title: args.title,
      userId,
      folderId: args.folderId,
      content: "",
      isArchived: false,
      isPublished: false,
    });

    return resumeId;
  },
});

export const createFolder = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized or not logged in");
    }

    const userId = identity.subject;

    const folderId = await ctx.db.insert("folders", {
      name: args.name,
      userId,
      icon: args.icon,
      color: args.color,
    });

    return folderId;
  },
});

export const getByFolder = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized or not logged in");
    }

    const userId = identity.subject;

    const folderReyzumes = await ctx.db
      .query("reyzumes")
      .withIndex("by_user_folder", (q) =>
        q.eq("userId", userId).eq("folderId", args.folderId)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
    return folderReyzumes;
  },
});

export const getReyzumes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // throw new Error("Unauthorized or not logged in");
      return [];
    }

    const userId = identity.subject;

    const reyzumes = await ctx.db
      .query("reyzumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return reyzumes;
  },
});

export const updateReyzume = mutation({
  args: {
    id: v.id("reyzumes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    isArchived: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized or not logged in");
    }

    const userId = identity.subject;
    const { id, ...updates } = args;

    const existingReyzume = await ctx.db.get(id);
    if (!existingReyzume) {
      throw new Error("Reyzume not found");
    }

    if (existingReyzume.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const reyzume = await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return reyzume;
  },
});

export const getReyzumeById = query({
  args: { id: v.id("reyzumes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized or not logged in");
    }

    const userId = identity.subject;
    const reyzume = await ctx.db.get(args.id);

    if (!reyzume) {
      return null;
    }

    if (reyzume.userId !== userId) {
      return null;
    }

    return reyzume;
  },
});
