import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  iconColorClass?: string;
  textColorClass?: string;
  bgColorClass?: string;
}

const SidebarMenuItem = ({
  item,
  isActive,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "flex cursor-pointer gap-3 transition-all duration-200 ease-linear focus:rounded-md focus:p-2",
      isActive && (item.bgColorClass || "bg-dark/10") + " rounded-md p-2",
    )}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={`Navigate to ${item.label}`}
  >
    <img
      src={item.icon}
      alt={`icon ${item.label}`}
      className={cn("h-5 w-5", item.iconColorClass)}
    />
    <span
      className={cn("text-sm font-medium", item.textColorClass || "text-dark")}
    >
      {item.label}
    </span>
  </div>
);

export default SidebarMenuItem;
