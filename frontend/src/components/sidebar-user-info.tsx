import { UserSchema } from "@/api/generated";

const SidebarUserInfo = ({
  userData,
}: {
  userData: UserSchema | undefined;
}) => (
  <div className="flex flex-col gap-2">
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
        {/* <span className="text-dark line-clamp-1 text-xs font-normal opacity-80">
          {userData?.email}
        </span> */}
        {userData?.type && (
          <span className="text-xs text-gray-500 italic">
            {getUserRoleLabel(userData.type)}
          </span>
        )}
      </div>
    </div>
    <span className="text-dark line-clamp-1 text-xs font-normal opacity-80">
      {userData?.email}
    </span>
  </div>
);

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

export default SidebarUserInfo;
