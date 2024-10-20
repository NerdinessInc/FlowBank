'use client';

import React, { createContext, useContext, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { SidebarMobile } from '@/components/layout/sidebar/SidebarMobile';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer';

// Create a context to manage theme
const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('purple'); // Default theme is 'purple'

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        <div className="flex flex-1">
          {/* Sidebar (Desktop) */}
          <div className="hidden md:block md:w-60 border-r bg-muted/40">
            <Sidebar />
          </div>

          {/* Main Content (takes remaining width) */}
          <div className="flex-1 flex flex-col">
            {/* Sidebar (Mobile) */}
            <div className="p-3 md:hidden">
              <SidebarMobile />
            </div>

            {/* Page Content */}
            <main className="flex-1 flex flex-col gap-4 mb-6 p-4 md:gap-6 md:p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

