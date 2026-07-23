import { useEffect, useState } from "react";
import { useTheme } from "@/app/(protected)/layout";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { useTenant } from "@/components/providers/TenantProvider";

// icons
import { UserCircle } from "lucide-react";

// store
import { appStore } from "@/store";

const Navbar = () => {
  const pathname = usePathname();

  const { userData } = appStore();
  const tenant = useTenant();

  const { theme, changeTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const themeColors: { [key: string]: string } = {
    light: "#ffffff", // White background for the light theme footer
    dark: "#0a0a0a",
    purple: "#e424e4", // Hex code for purple-700
    blue: "#3b82f6", // Hex code for blue-700
    red: "#ef4444", // Hex code for red-700
    green: "#10b981", // Hex code for green-700
  };

  // Default to a color in case theme is not a valid key
  const isDefault = tenant.id === "default";
  
  const headerBgClass = isDefault 
    ? "bg-white text-gray-900 border-gray-200" 
    : "bg-gradient-to-r from-primary to-accent text-white border-b border-primary/20";
  
  const textColor = isDefault ? "text-gray-900" : "text-white";

  return (
    <>
      <div className="text-black w-full bg-primary/80 py-2 px-3 text-center text-sm font-medium">
        {format(currentTime, "dd MMM yyyy, hh:mm:ss a")}
      </div>

      <header
        className={`p-4 transition-colors duration-300 shadow-sm ${headerBgClass} border-b`}
      >
        <div className="flex justify-between items-center">
          {/* Logo section */}
          <div className="flex items-center space-x-4">
            {tenant.logo ? (
              <img
                src={tenant.logo}
                // alt={tenant.name}
                className="h-12 object-contain rounded-[100%]"
              />
            ) : (
              <></>
            )}
            <h1 className={`${textColor} font-bold text-lg`}>{tenant.name}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <p className={`${textColor} font-medium flex items-center gap-2`}>
              <UserCircle className="h-5 w-5" />
              {userData?.userRec?.pUserName}
            </p>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
