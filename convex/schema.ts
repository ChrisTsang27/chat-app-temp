import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("editor")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
    // New fields for private channels
    isPrivate: v.optional(v.boolean()), // Default to false for existing channels
    createdBy: v.optional(v.id("members")), // Admin who created the channel
  }).index("by_workspace_id", ["workspaceId"]),
  // New table for private channel memberships
  channelMembers: defineTable({
    channelId: v.id("channels"),
    memberId: v.id("members"),
    addedBy: v.id("members"), // Admin who added this member
    addedAt: v.number(), // Timestamp when member was added
  })
    .index("by_channel_id", ["channelId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id_member_id", ["channelId", "memberId"]),
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("by_workspace_id", ["workspaceId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),
  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    workspaceId: v.id("workspaces"),
    createdBy: v.id("users"),
    createdAt: v.number()
  }).index("by_workspace_id", ["workspaceId"]),
});

export default schema;
