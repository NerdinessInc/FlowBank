import { useEffect, useState } from 'react';
import { useTheme } from '@/app/(protected)/layout';

const Navbar = () => {
  const { theme, changeTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);


  return (
    <header
      className={`p-4`}
      style={{ backgroundColor: theme === 'blue' ? '#3b82f6' : theme === 'red' ? '#ef4444' : theme === 'green' ? '#10b981' : theme === 'purple' ? '#e424e4' : '#f1f5f9' }}
    >
      <div className="flex justify-between items-center">
        {/* Logo section */}
        <div className="flex items-center space-x-4">
          <img src="/path-to-logo/logo.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-white font-bold text-xl">Internet Banking</h1>
        </div>

        {/* Menu section 
        <nav className="space-x-6">
          <a href="/" className="text-white hover:underline">Home</a>
          <a href="/about" className="text-white hover:underline">About</a>
          <a href="/contact" className="text-white hover:underline">Contact</a>
        </nav>
*/}
        {/* Time and Theme Dropdown */}
        <div className="flex items-center space-x-4">
          {/* Current Time */}
          <div className="text-white">
            {currentTime.toLocaleTimeString()}
          </div>

          {/* Dropdown to change theme color */}
          <select
            onChange={(e) => changeTheme(e.target.value)}
            className="p-2 bg-white border rounded-md"
            value={theme}
          >
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Navbar;