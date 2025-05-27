"use client";
import { useAtom } from "jotai";
import { announcementPanelAtom } from "../store";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import CreateAnnouncementForm from "../CreateAnnouncementForm";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

interface Props {
  workspaceId: Id<"workspaces">;
}

export const AnnouncementPanel = ({ workspaceId }: Props) => {
  const [open, setOpen] = useAtom(announcementPanelAtom);
  const { data, status } = useAnnouncements(workspaceId);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: user, isLoading } = useCurrentUser();

  if (!open) return null;

  return (
    
    <div className="fixed right-0 top-0 h-full w-[400px] bg-white border-l z-50 shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      {user && (
        <CreateAnnouncementForm workspaceId={workspaceId} userId={user._id} />
      )}
      <ScrollArea className="flex-1 p-4">
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && <p>Error loading announcements.</p>}
        {data?.map((a) => (
          <Card key={a._id} className="p-4 mb-4">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-sm text-muted-foreground">{a.body}</p>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};