import { api } from "@/api/client";
import { UserSchema } from "@/api/generated";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  textColorClass?: string;
  bgColorClass?: string;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>("dashboard");

  const { data } = useQuery({
    queryKey: ["verify"],
    queryFn: () => api.auth.verif().catch(() => null),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 60 * 1000,
  });

  const userRole = data?.body.type || "ota";

  const menuItems = getMenuItems(userRole);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    if (matchingItem) {
      setActiveItem(matchingItem.id);
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    navigate({ to: item.path });

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClose={onClose} />
      <SidebarContent
        isOpen={isOpen}
        onClose={onClose}
        menuItems={menuItems}
        activeItem={activeItem}
        handleItemClick={handleItemClick}
        userData={data?.body}
      />
    </>
  );
};

const Overlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <div
    className={cn(
      "fixed inset-0 z-30 bg-black/20 backdrop-blur-xs transition-all duration-300 lg:hidden",
      isOpen ? "opacity-100" : "pointer-events-none opacity-0"
    )}
    style={{ top: "70px" }}
    onClick={onClose}
  />
);

const SidebarContent = ({
  isOpen,
  onClose,
  menuItems,
  activeItem,
  handleItemClick,
  userData,
}: {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  activeItem: string;
  handleItemClick: (item: MenuItem) => void;
  userData: UserSchema | undefined;
}) => (
  <div
    className={cn(
      "fixed top-0 -left-4 z-40 mt-[82px] mb-3 flex h-[calc(100vh-24px-70px)] flex-col justify-between rounded-r-[12px] bg-white px-5 py-6 shadow-[0_0_4px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-in-out lg:mt-27 lg:ml-3 lg:h-[calc(100vh-24px-96px)] lg:rounded-l-[12px]",
      isOpen ? "translate-x-4" : "-translate-x-full"
    )}
    data-sidebar="true"
  >
    <button
      className="text-dark absolute top-4 right-4 cursor-pointer"
      onClick={onClose}
      aria-label="Close sidebar"
    >
      <X size={24} className="transition-all hover:scale-125" />
    </button>

    <div className="flex flex-col gap-5">
      <h4 className="text-dark text-sm font-medium">UTAMA</h4>
      <div className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      <div className="h-[1.5px] w-full rounded-full bg-gray-300"></div>
    </div>

    <UserInfo userData={userData} />
  </div>
);

const MenuItemComponent = ({
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
      isActive && (item.bgColorClass || "bg-dark/10") + " rounded-md p-2"
    )}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={`Navigate to ${item.label}`}
  >
    <img src={item.icon} alt={`icon ${item.label}`} className="h-5 w-5" />
    <span
      className={cn(
        "text-sm font-medium",
        item.textColorClass || "text-dark"
      )}
    >
      {item.label}
    </span>
  </div>
);

const UserInfo = ({ userData }: { userData: UserSchema | undefined }) => (
  <div className="flex items-center gap-5 transition-all hover:scale-105">
    <img
      src="/icon/Type=profile-icon.svg"
      alt="user avatar"
      className="h-8 w-8 rounded-full"
    />
    <div className="flex flex-col gap-1">
      <span className="text-dark text-sm font-bold">
        {userData?.email.split("@")[0]}
      </span>
      <span className="text-dark line-clamp-1 text-xs font-normal opacity-80">
        {userData?.email}
      </span>
      {userData?.type && (
        <span className="text-xs text-gray-500 italic">
          {getUserRoleLabel(userData.type)}
        </span>
      )}
    </div>
  </div>
);

const getMenuItems = (role: string): MenuItem[] => {
  switch (role) {
    case "mahasiswa":
      return [
        { id: "dashboard", label: "Dasbor", icon: "/icon/Type=dashboard.svg", path: "/dashboard" },
        { id: "my-sponsors", label: "Orang Tua Asuh Saya", icon: "/icon/Type=student-list.svg", path: "/my-sponsors" },
        { id: "termination", label: "Terminasi", icon: "/icon/Type=remove-student.svg", path: "/termination", textColorClass: "text-destructive", bgColorClass: "bg-destructive/10" },
      ];
    case "admin":
      return [
        { id: "dashboard", label: "Dasbor", icon: "/icon/Type=dashboard.svg", path: "/dashboard" },
        { id: "verification", label: "Verifikasi", icon: "/icon/Type=shield.svg", path: "/verifikasi-akun" },
      ];
    case "ota":
    default:
      return [
        { id: "dashboard", label: "Dasbor", icon: "/icon/Type=dashboard.svg", path: "/dasbor" },
        { id: "student-list", label: "Cari Mahasiswa", icon: "/icon/Type=search.svg", path: "/daftar/mahasiswa" },
        { id: "my-students", label: "Mahasiswa Asuh Saya", icon: "/icon/Type=people.svg", path: "/mahasiswa-asuh-saya" },
        { id: "termination", label: "Terminasi", icon: "/icon/Type=remove-student.svg", path: "/termination", textColorClass: "text-destructive", bgColorClass: "bg-destructive/10" },
      ];
  }
};

const getUserRoleLabel = (role: string): string => {
  switch (role) {
    case "mahasiswa":
      return "Mahasiswa";
    case "ota":
      return "Orang Tua Asuh";
    case "admin":
      return "Admin";
    default:
      return "";
  }
};

export default Sidebar;
