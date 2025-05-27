"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api"
import { Id } from "convex/_generated/dataModel";

interface Props {
  workspaceId: string;
}

export default function AnnouncementList({ workspaceId }: Props) {
  const announcements = useQuery(api.announcements.listAnnouncementsByWorkspace, { 
    workspaceId: workspaceId as Id<"workspaces">
  });

  if (!announcements) return <div>Loading announcements...</div>;

  return (
    <div className="space-y-4 p-4">
      {announcements.map((a) => (
        <Card key={a._id} className="p-4 shadow">
          <h3 className="font-semibold text-lg">{a.title}</h3>
          <p className="text-sm text-gray-600">{a.body}</p>
        </Card>
      ))}
    </div>
  );
}