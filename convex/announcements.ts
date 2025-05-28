import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation: Create a new announcement
export const createAnnouncement = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    workspaceId: v.id("workspaces"),
    createdBy: v.id("users"),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("announcements", {
      title: args.title,
      body: args.body,
      workspaceId: args.workspaceId,
      createdBy: args.createdBy,
      createdAt: args.createdAt,
    });
  },
});

// Query: List all announcements for a workspace
export const listAnnouncementsByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();
  },
});

// Mutation: Delete announcement
export const deleteAnnouncement = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation: Update announcement
export const updateAnnouncement = mutation({
  args: {
    id: v.id("announcements"),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      body: args.body,
    });
  },
});