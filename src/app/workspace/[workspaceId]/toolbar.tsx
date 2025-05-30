import { useState } from "react";
import { Info, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [open, setOpen] = useState(false);

  const onChannelSearch = (channelId: string) => {
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    setOpen(false);
  };

  const onMemberSearch = (memberId: string) => {
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
    setOpen(false);
  };

  return (
    // #452b57
    //original #481349
    <nav className="bg-[#452b57] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2 cursor-pointer"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-sm">Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelSearch(channel._id)}
                  className="cursor-pointer"
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberSearch(member._id)}
                  className="cursor-pointer"
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
