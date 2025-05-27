import { usePathname } from "next/navigation";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

import { UserButton } from "@/features/auth/components/user-button";

import { SidebarButton } from "./sidebar-button";
import { WorkspaceSwitcher } from "./workspace-switcher";

import { Megaphone } from "lucide-react";
import { useSetAtom, useAtomValue } from "jotai";
import { announcementPanelAtom } from "@/features/announcements/store";

export const Sidebar = () => {
  const pathname = usePathname();
  const open = useAtomValue(announcementPanelAtom)
  const setOpen = useSetAtom(announcementPanelAtom)

  return (
    // #452b57
    // original #481349
    <aside className="w-[100px] h-full bg-[#452b57] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        onClick={() => pathname.includes("/workspace")}
        highlight={!open}
      />
      <SidebarButton icon={MessagesSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={Megaphone} label="Announcements" onClick={() => setOpen(true)} />
      <SidebarButton icon={MoreHorizontal} label="More" />
      

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto p-2">
        <UserButton />
      </div>
    </aside>
  );
};
