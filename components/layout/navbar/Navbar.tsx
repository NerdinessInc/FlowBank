import { useEffect, useState } from "react";
import { useColorTheme } from "@/components/providers/ColorThemeProvider";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { useTenant } from "@/components/providers/TenantProvider";

// icons
import { UserCircle, Palette } from "lucide-react";

// store
import { appStore } from "@/store";

// ui components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarMobile } from "@/components/layout/sidebar/SidebarMobile";

const Navbar = () => {
  const pathname = usePathname();

  const { userData } = appStore();
  const tenant = useTenant();

  const { themeId, changeTheme, availableThemes } = useColorTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const isDefault = tenant.id === "default";
  
  const headerBgClass = isDefault 
    ? "bg-white text-gray-900 border-gray-200" 
    : "bg-gradient-to-r from-primary to-accent text-white border-b border-primary/20";
  
  const textColor = isDefault ? "text-gray-900" : "text-white";

  return (
    <>
      <div className="text-white w-full bg-primary py-2 px-3 text-center text-sm font-medium">
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
            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`${textColor} hover:bg-black/10 rounded-full`}>
                  <Palette className="h-5 w-5" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {availableThemes.map((t) => (
                  <DropdownMenuItem 
                    key={t.id} 
                    onClick={() => changeTheme(t.id)}
                    className="flex items-center gap-3 cursor-pointer py-2"
                  >
                    <div 
                      className="w-5 h-5 rounded-full border border-border shadow-sm" 
                      style={{ backgroundColor: t.color }} 
                    />
                    <span className="font-medium">{t.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex items-center gap-2">
              <p className={`${textColor} font-medium flex items-center gap-2`}>
                <UserCircle className="h-5 w-5" />
                {userData?.userRec?.pUserName}
              </p>
            </div>

            <div className="md:hidden">
              <SidebarMobile />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
