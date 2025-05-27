import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Announcement = {
  _id: string;
  title: string;
  body: string;
  workspaceId: Id<"workspaces">;
  createdBy: Id<"users">;
  createdAt: number;
};

type UseAnnouncementsReturn = {
  data: Announcement[] | null;
  status: "loading" | "success" | "error";
  error: Error | null;
};

export const useAnnouncements = (
  workspaceId: Id<"workspaces">
): UseAnnouncementsReturn => {
  const announcements = useQuery(api.announcements.listAnnouncementsByWorkspace, {
    workspaceId,
  });

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (announcements === undefined) {
      setStatus("loading");
    } else if (announcements === null) {
      setStatus("error");
      setError(new Error("Failed to load announcements."));
    } else {
      setStatus("success");
      setError(null);
    }
  }, [announcements]);

  return {
    data: announcements ?? null,
    status,
    error,
  };
};