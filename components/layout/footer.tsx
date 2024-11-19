
import { useTheme } from '@/app/(protected)/layout';


const Footer = () => {
  const { theme } = useTheme(); // Access the current theme from context

const themeColors: { [key: string]: string } = {
    purple: '#e424e4', // Hex code for purple-700
    blue: '#3b82f6',   // Hex code for blue-700
    red: '#ef4444',    // Hex code for red-700
    green: '#10b981',  // Hex code for green-700
  };

  // Default to a color in case theme is not a valid key
  const backgroundColor = themeColors[theme] || themeColors.purple;

  return (
    <footer style={{ backgroundColor }} className="p-4 text-white">
      <div className="container mx-auto text-center">
        <p>&copy; Nerdiness Software {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
