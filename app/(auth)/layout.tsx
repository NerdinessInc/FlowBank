"use client";

import type React from "react";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Phone, Clock } from "lucide-react";
import logo from "../../assets/images/logo.png";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const bgImage =
    "https://images.unsplash.com/photo-1719937050445-098888c0625e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex flex-col h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute " />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Header with Time */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
          <div className="px-16 py-3">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <p className="text-sm font-medium tracking-wide">
                {format(currentTime, "EEEE, MMMM d, yyyy • h:mm:ss a")}
              </p>
            </div>
          </div>
        </header>

        {/* Main Header */}
        <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 shadow-xl border-b border-white/10">
          <div className="px-16 py-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <Image src={logo} alt="logo" width={80} height={40} />
                <h1 className="text-xl sm:text-xl font-bold text-white tracking-tight">
                  NOMASE MFB
                </h1>
              </div>

              {/* Right side info */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center text-white">
                <div className="text-center sm:text-right">
                  <p className="text-[16px] sm:text-[15px] font-semibold tracking-wide">
                    Internet Banking
                  </p>
                  <p className="text-[12px] opacity-90 mt-1">
                    Secure • Fast • Reliable
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Phone className="w-4 h-4" />
                  <p className="text-sm font-medium">+234 293 4255</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Footer */}
        <footer className="bg-[#6b46c1] from-slate-800 to-slate-900 border-t border-white/10">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-white/80">
              <p className="text-sm font-medium">
                © {new Date().getFullYear()} Nerdiness Software. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
