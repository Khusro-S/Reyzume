import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createReyzume = mutation({
  args: {
    title: v.string(),
    folderId: v.optional(v.id("folders")),
    content: v.optional(v.string()),
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
      content: args.content || "",
      isArchived: false,
      isPublished: false,
      fontFamily: "Times New Roman, Times, serif",
      fontSize: "11pt",
      marginVertical: "10",
      marginHorizontal: "10",
      lineHeight: "1.4",
    });

    return resumeId;
  },
});

export const createFolder = mutation({
  args: {
    title: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isArchived: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized or not logged in");
    }

    const userId = identity.subject;

    const folderId = await ctx.db.insert("folders", {
      title: args.title,
      userId,
      icon: args.icon,
      color: args.color,
      isArchived: args.isArchived,
    });

    return folderId;
  },
});

export const getByFolder = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // throw new Error("Unauthorized or not logged in");
      return [];
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
      // .filter((q) => q.eq(q.field("isArchived"), false))
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

// Get a single reyzume by ID
export const getReyzumeById = query({
  // args: { id: v.id("reyzumes") },
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      //  throw new Error("Not authenticated");
      return null;
    }

    // const reyzume = await ctx.db.get(args.id);
    // if (!reyzume) {
    //   // throw new Error("Reyzume not found");
    //   return null;
    // }

    // if (reyzume.userId !== identity.subject) {
    //   // throw new Error("Unauthorized");
    //   return null;
    // }

    // return reyzume;
    // Safely validate and normalize the ID - returns null if invalid
    const normalizedId = ctx.db.normalizeId("reyzumes", args.id);
    if (!normalizedId) {
      return null;
    }

    const reyzume = await ctx.db.get(normalizedId);

    if (!reyzume) {
      return null;
    }

    if (reyzume.userId !== identity.subject) {
      return null;
    }

    return reyzume;
  },
});

// Update reyzume content (sections)
export const updateContent = mutation({
  args: {
    id: v.id("reyzumes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingReyzume = await ctx.db.get(args.id);

    if (!existingReyzume) {
      throw new Error("Resume not found");
    }

    if (existingReyzume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      content: args.content,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete a reyzume permanently
export const deleteReyzume = mutation({
  args: { id: v.id("reyzumes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingReyzume = await ctx.db.get(args.id);

    if (!existingReyzume) {
      throw new Error("Reyzume not found");
    }

    if (existingReyzume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Delete multiple reyzumes permanently
export const deleteMultipleReyzumes = mutation({
  args: { ids: v.array(v.id("reyzumes")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const results = await Promise.all(
      args.ids.map(async (id) => {
        const existingReyzume = await ctx.db.get(id);

        if (!existingReyzume) {
          return { id, success: false, error: "Not found" };
        }

        if (existingReyzume.userId !== identity.subject) {
          return { id, success: false, error: "Unauthorized" };
        }

        await ctx.db.delete(id);
        return { id, success: true };
      })
    );

    return results;
  },
});
// Archive multiple resumes
export const archiveMultipleReyzumes = mutation({
  args: {
    ids: v.array(v.id("reyzumes")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    for (const id of args.ids) {
      const reyzume = await ctx.db.get(id);

      if (!reyzume) {
        continue; // Skip if not found
      }

      if (reyzume.userId !== userId) {
        throw new Error("Unauthorized");
      }

      await ctx.db.patch(id, { isArchived: true });
    }

    return { success: true, count: args.ids.length };
  },
});
// Soft delete (archive) a reyzume
export const archiveReyzume = mutation({
  args: { id: v.id("reyzumes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingReyzume = await ctx.db.get(args.id);

    if (!existingReyzume) {
      throw new Error("Reyzume not found");
    }

    if (existingReyzume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      isArchived: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Restore an archived reyzume
export const restoreReyzume = mutation({
  args: { id: v.id("reyzumes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingReyzume = await ctx.db.get(args.id);

    if (!existingReyzume) {
      throw new Error("Reyzume not found");
    }

    if (existingReyzume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      isArchived: false,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});


// Restore Multiple Resumes
export const restoreMultipleReyzumes = mutation({
  args: {
    ids: v.array(v.id("reyzumes")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    for (const id of args.ids) {
      const reyzume = await ctx.db.get(id);

      if (!reyzume) {
        continue; // Skip if not found
      }

      if (reyzume.userId !== userId) {
        throw new Error("Unauthorized");
      }

      await ctx.db.patch(id, { isArchived: false });
    }

    return { success: true, count: args.ids.length };
  },
});

// Get archived reyzumes
export const getArchivedReyzumes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    const archivedReyzumes = await ctx.db
      .query("reyzumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return archivedReyzumes;
  },
});

export const updateFontFamily = mutation({
  args: {
    id: v.id("reyzumes"),
    fontFamily: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authorized");
    }

    const existingReyzume = await ctx.db.get(args.id);
    if (!existingReyzume) {
      throw new Error("Reyzume not found");
    }
    await ctx.db.patch(args.id, {
      fontFamily: args.fontFamily,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const updateFontSize = mutation({
  args: {
    id: v.id("reyzumes"),
    fontSize: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authorized");
    }

    const existingReyzume = await ctx.db.get(args.id);
    if (!existingReyzume) {
      throw new Error("Reyzume not found");
    }

    if (existingReyzume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      fontSize: args.fontSize,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const updateMargins = mutation({
  args: {
    id: v.id("reyzumes"),
    marginVertical: v.string(),
    marginHorizontal: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const reyzume = await ctx.db.get(args.id);
    if (!reyzume) {
      throw new Error("Reyzume not found");
    }

    const updates: {
      marginVertical?: string;
      marginHorizontal?: string;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.marginVertical !== undefined) {
      updates.marginVertical = args.marginVertical;
    }
    if (args.marginHorizontal !== undefined) {
      updates.marginHorizontal = args.marginHorizontal;
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const updateLineHeight = mutation({
  args: {
    id: v.id("reyzumes"),
    lineHeight: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const reyzume = await ctx.db.get(args.id);
    if (!reyzume) {
      throw new Error("Reyzume not found");
    }

    if (reyzume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      lineHeight: args.lineHeight,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
