import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
  highlight,
  onClick,
}: SidebarButtonProps) => {
  const showHighlight = isActive || highlight;

  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20", 
          showHighlight && "bg-accent/20" 
        )}
        onClick={onClick}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all  cursor-pointer" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-accent">
        {label}
      </span>
    </div>
  );
};
