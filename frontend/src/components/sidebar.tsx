import { api } from "@/api/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Only fetch authentication status when component mounts
  // Enable refetching on window focus and set a stale time
  const {
    data,
    // isLoading
  } = useQuery({
    queryKey: ["verify"],
    queryFn: () => api.auth.verif().catch(() => null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });

  // const isLoggedIn = !!data;

  // TODO: Belom selesai
  const name = "Yusuf Ardian Sandi";
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const navigate = useNavigate();

  // Use useEffect to handle ESC key press to close sidebar
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

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    switch (itemId) {
      case "dashboard":
        // TO-DO: dashboard page
        // navigate({
        //   to: "/dashboard",
        // });
        break;
      case "student-list":
        navigate({
          to: "/daftar/mahasiswa",
        });
        break;
      case "my-students":
        navigate({
          to: "/mahasiswa-asuh-saya"
        });
        break;
      case "termination":
        // TO-DO: termination page
        // navigate({
        //   to: "/termination"
        // });
        break;
      default:
        break;
    }

    onClose();
  };
  

  return (
    <>
      {/* Overlay - with fade animation */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/20 backdrop-blur-xs transition-all duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ top: "70px" }} // Position below navbar on mobile
        onClick={onClose}
      />

      {/* Sidebar - with slide animation */}
      <div
        className={cn(
          "fixed top-0 -left-4 z-40 mt-[82px] mb-3 flex h-[calc(100vh-24px-70px)] flex-col justify-between rounded-r-[12px] bg-white px-5 py-6 shadow-[0_0_4px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-in-out lg:mt-27 lg:ml-3 lg:h-[calc(100vh-24px-96px)] lg:rounded-l-[12px]",
          isOpen ? "translate-x-4" : "-translate-x-full",
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

        {/* Content */}
        <div className="flex flex-col gap-5">
          <h4 className="text-dark text-sm font-medium">UTAMA</h4>
          <div className="flex flex-col gap-3">
            {/* Dashbor */}
            <div
              className={cn(
                "flex cursor-pointer gap-3 transition-all duration-200 ease-linear focus:rounded-md focus:p-2",
                activeItem === "dashboard" && "bg-dark/10 rounded-md p-2",
              )}
              onClick={() => handleItemClick("dashboard")}
              tabIndex={0}
            >
              <img
                src="/icon/Type=dashboard.svg"
                alt="icon dashboard"
                className="h-4 w-4"
              />
              <span className="text-dark text-sm font-medium">Dasbor</span>
            </div>
            {/* Daftar Mahasiswa */}
            <div
              className={cn(
                "flex cursor-pointer gap-3 transition-all duration-200 ease-linear focus:rounded-md focus:p-2",
                activeItem === "student-list" && "bg-dark/10 rounded-md p-2",
              )}
              onClick={() => handleItemClick("student-list")}
              tabIndex={0}
            >
              <img
                src="/icon/Type=student-list.svg"
                alt="icon dashboard"
                className="h-4 w-4"
              />
              <span className="text-dark text-sm font-medium">
                Daftar Mahasiswa
              </span>
            </div>
            {/* Mahasiswa Asuh Saya */}
            <div
              className={cn(
                "flex cursor-pointer gap-3 transition-all duration-200 ease-linear focus:rounded-md focus:p-2",
                activeItem === "my-students" && "bg-dark/10 rounded-md p-2",
              )}
              onClick={() => handleItemClick("my-students")}
              tabIndex={0}
            >
              <img
                src="/icon/Type=student.svg"
                alt="icon dashboard"
                className="h-4 w-4"
              />
              <span className="text-dark text-sm font-medium">
                Mahasiswa Asuh Saya
              </span>
            </div>
            {/* Terminasi */}
            <div
              className={cn(
                "flex cursor-pointer gap-3 transition-all duration-200 ease-linear focus:rounded-md focus:p-2",
                activeItem === "termination" &&
                  "bg-destructive/10 rounded-md p-2",
              )}
              onClick={() => handleItemClick("termination")}
              tabIndex={0}
            >
              <img
                src="/icon/Type=remove-student.svg"
                alt="icon dashboard"
                className="h-4 w-4"
              />
              <span className="text-destructive text-sm font-medium">
                Terminasi
              </span>
            </div>
          </div>
          {/* Line Separator */}
          <div className="h-[1.5px] w-full rounded-full bg-gray-300"></div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-5 transition-all hover:scale-105">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="user avatar"
            className="h-8 w-8 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <span className="text-dark text-sm font-bold">{name}</span>
            <span className="text-dark line-clamp-1 text-xs font-normal opacity-80">
              {data?.body.email}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
