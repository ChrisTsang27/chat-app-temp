"use client";

import { useMutation } from "convex/react";
import { useAnnouncements } from "@/features/announcements/hooks/useAnnouncements";
import CreateAnnouncementForm from "@/features/announcements/CreateAnnouncementForm";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { isEditor } from "@/lib/role-utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AnnouncementPage() {
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrentUser();
  const { data: member } = useCurrentMember({ workspaceId: workspaceId as Id<"workspaces"> });
  const { data: announcements, status } = useAnnouncements(workspaceId as Id<"workspaces">);
  const deleteAnnouncement = useMutation(api.announcements.deleteAnnouncement);
  const updateAnnouncement = useMutation(api.announcements.updateAnnouncement);

  const canManage = member && isEditor(member.role);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const handleDelete = async (id: Id<"announcements">) => {
    const confirmed = confirm("Are you sure you want to delete this announcement?");
    if (confirmed) {
      await deleteAnnouncement({ id });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📢 Announcements</h1>

      {canManage && user && (
        <CreateAnnouncementForm workspaceId={workspaceId as Id<"workspaces">} userId={user._id} />
      )}

      {status === "loading" && <p>Loading announcements...</p>}
      {status === "error" && <p>Failed to load announcements.</p>}

      {announcements?.length === 0 && (
        <p className="text-muted-foreground">No announcements yet.</p>
      )}

      <div className="w-full flex flex-col items-center gap-4">
        {announcements
          ?.sort((a, b) => b.createdAt - a.createdAt)
          .map((a) => (
            <Card
              key={a._id}
              className="w-full max-w-4xl p-18 rounded-lg border border-[#e5e5e5] bg-white shadow-sm hover:shadow-md transition-all space-y-3"
            >
              {editId === a._id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateAnnouncement({
                      id: a._id as Id<"announcements">,
                      title: editTitle,
                      body: editBody,
                    });
                    setEditId(null);
                  }}
                  className="space-y-2"
                >
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                  <Input value={editBody} onChange={(e) => setEditBody(e.target.value)} required />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">Save</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditId(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{a.title}</h3>
                      <p className="text-base text-gray-800 mt-1">{a.body}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1">
                      {formatDistanceToNow(new Date(a.createdAt))} ago
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={undefined} alt="author avatar" />
                      <AvatarFallback>
                        {(a.createdBy as string)?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[100px]">{a.createdBy}</span>
                    {canManage && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Editor
                      </span>
                    )}
                  </div>

                  {canManage && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditId(a._id);
                          setEditTitle(a.title);
                          setEditBody(a.body);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(a._id as Id<"announcements">)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          ))}
      </div>
    </div>
  );
}