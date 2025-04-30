import { api } from "@/api/client";
import SidebarContent from "@/components/sidebar-content";
import SidebarOverlay from "@/components/sidebar-overlay";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  textColorClass?: string;
  bgColorClass?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["verify"],
    queryFn: () => api.auth.verif().catch(() => null),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 60 * 1000,
  });

  const applicationStatus = data?.body.applicationStatus;

  // TODO: handle case if data is empty string
  const userRole = data?.body.type || "";

  const menuItems = getMenuItems(userRole, applicationStatus);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = menuItems.find((item) =>
      currentPath.startsWith(item.path),
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
      <SidebarOverlay isOpen={isOpen} onClose={onClose} />
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


const getMenuItems = (role: string, applicationStatus?: string): MenuItem[] => {
  if (applicationStatus === "unregistered" || applicationStatus === "pending" || applicationStatus === "rejected") {
    return [
      {
        id: "pendaftaran",
        label: "Pendaftaran",
        icon: "/icon/Type=form.svg",
        path: "/pendaftaran",
      },
    ];
  }

  switch (role) {
    case "mahasiswa":
      return [
        {
          id: "ota-saya",
          label: "Orang Tua Asuh Saya",
          icon: "/icon/Type=student-list.svg",
          path: "/orang-tua-asuh-saya",
        },
        {
          id: "termination",
          label: "Terminasi",
          icon: "/icon/Type=remove-student.svg",
          path: "/termination",
          textColorClass: "text-destructive",
          bgColorClass: "bg-destructive/10",
        },
      ];
    case "admin":
      return [
        {
          id: "verification",
          label: "Verifikasi",
          icon: "/icon/Type=shield.svg",
          path: "/verifikasi-akun",
        },
      ];
    case "ota":
      return [
        {
          id: "student-list",
          label: "Cari Mahasiswa",
          icon: "/icon/Type=search.svg",
          path: "/cari-mahasiswa",
        },
        {
          id: "my-students",
          label: "Mahasiswa Asuh Saya",
          icon: "/icon/Type=people.svg",
          path: "/mahasiswa-asuh-saya",
        },
        {
          id: "termination",
          label: "Terminasi",
          icon: "/icon/Type=remove-student.svg",
          path: "/termination",
          textColorClass: "text-destructive",
          bgColorClass: "bg-destructive/10",
        },
      ];
    default:
      console.log("User role is empty or unrecognized.");
      return [];
  }
};

export default Sidebar;
