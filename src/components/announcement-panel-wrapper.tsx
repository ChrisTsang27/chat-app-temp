"use client";

import { AnnouncementPanel } from "@/features/announcements/components/announcement-panel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../convex/_generated/dataModel";

export function AnnouncementPanelWrapper() {
  const workspaceId = useWorkspaceId();

  if (!workspaceId) return null;

  return <AnnouncementPanel workspaceId={workspaceId as Id<"workspaces">} />;
}