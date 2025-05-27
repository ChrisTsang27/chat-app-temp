"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Id } from "convex/_generated/dataModel";

interface Props {
  workspaceId: string;
  userId: string;
}

export default function CreateAnnouncementForm({ workspaceId, userId }: Props) {
  const create = useMutation(api.announcements.createAnnouncement);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({
      title,
      body,
      workspaceId: workspaceId as Id<"workspaces">,
      createdBy: userId as Id<"users">,
      createdAt: Date.now(),
    });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" required />
      <Button type="submit">Post Announcement</Button>
    </form>
  );
}