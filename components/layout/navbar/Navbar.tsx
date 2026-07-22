import { useEffect, useState } from "react";
import { useTheme } from "@/app/(protected)/layout";
import { usePathname } from "next/navigation";
import { format } from "date-fns";

// icons
import { UserCircle } from "lucide-react";

// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

// store
import { appStore } from "@/store";

const Navbar = () => {
  const pathname = usePathname();

  const { userData } = appStore();

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
  const backgroundColor = themeColors[theme] || themeColors.light;
  
  const isLight = theme === "light";
  const textColor = isLight ? "text-gray-900" : "text-white";
  const selectTriggerClass = isLight 
    ? "bg-black/5 text-gray-900 border-black/10 hover:bg-black/10 transition-colors" 
    : "bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors";

  return (
    <>
      <div className="text-white w-full bg-primary/80 py-2 px-3 text-center text-sm font-medium">
        {format(currentTime, "dd MMM yyyy, hh:mm:ss a")}
      </div>

      <header
        className={`p-4 transition-colors duration-300 shadow-sm`}
        style={{ backgroundColor }} 
      >
        <div className="flex justify-between items-center">
          {/* Logo section */}
          <div className="flex items-center space-x-4">
            <h1 className={`${textColor} font-bold text-xm`}>
              FlowBank -{" "}
              <span className="capitalize font-medium">
                {pathname.split("/")[1]?.replace("-", " ")}
                {pathname.split("/")?.length > 2 ? " / " : " "}
                {pathname.split("/")[2]?.replace("-", " ")}
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={theme} onValueChange={(value) => changeTheme(value)}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Theme" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="light">Light (White)</SelectItem>
                  <SelectItem value="dark">Dark (Black)</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
