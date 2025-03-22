"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const name = "Yusuf Ardian Sandi"
  const email = "13522015@std.stei.itb.ac.id"

  // Use useEffect to handle ESC key press to close sidebar
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscKey)
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Overlay - with fade animation */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-xs lg:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ top: "70px" }} // Position below navbar on mobile
          onClick={onClose}
        />
      )}

      {/* Sidebar - with slide animation */}
      <div
        className={`fixed top-0 -left-4 z-40 mt-[82px] mb-3 flex h-[calc(100vh-24px-70px)] lg:h-[calc(100vh-24px-96px)] max-w-[255px] flex-col justify-between rounded-r-[12px] bg-white px-5 py-6 shadow-[0_0_4px_rgba(0,0,0,0.4)] lg:mt-27 lg:ml-3 lg:rounded-l-[12px] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-4" : "-translate-x-full"
        }`}
        data-sidebar="true"
      >
        <button className="text-dark absolute top-4 right-4" onClick={onClose} aria-label="Close sidebar">
          <X size={24} />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-5">
          <h4 className="text-dark text-sm font-medium">UTAMA</h4>
          <div className="flex flex-col gap-3">
            {/* Dashbor */}
            <div className="flex cursor-pointer gap-3 hover:opacity-80">
              <img src="/icon/Type=dashboard.svg" alt="icon dashboard" className="h-4 w-4" />
              <span className="text-dark text-sm font-medium">Dasbor</span>
            </div>
            {/* Daftar Mahasiswa */}
            <div className="flex cursor-pointer gap-3 hover:opacity-80">
              <img src="/icon/Type=student-list.svg" alt="icon dashboard" className="h-4 w-4" />
              <span className="text-dark text-sm font-medium">Daftar Mahasiswa</span>
            </div>
            {/* Mahasiswa Asuh Saya */}
            <div className="flex cursor-pointer gap-3 hover:opacity-80">
              <img src="/icon/Type=student.svg" alt="icon dashboard" className="h-4 w-4" />
              <span className="text-dark text-sm font-medium">Mahasiswa Asuh Saya</span>
            </div>
            {/* Terminasi */}
            <div className="flex cursor-pointer gap-3 hover:opacity-80">
              <img src="/icon/Type=remove-student.svg" alt="icon dashboard" className="h-4 w-4" />
              <span className="text-destructive text-sm font-medium">Terminasi</span>
            </div>
          </div>
          {/* Line Separator */}
          <div className="h-[1.5px] w-full rounded-full bg-gray-300"></div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-5">
          <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="user avatar" className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <span className="text-dark text-sm font-bold">{name}</span>
            <span className="text-dark text-xs font-normal opacity-80">{email}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar

