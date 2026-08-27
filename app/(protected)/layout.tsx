"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer";
import { RouteGuard } from "@/components/guards/RouteGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block md:w-60 border-r bg-card overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content (takes remaining width) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 flex flex-col gap-4 p-4 md:gap-6 md:p-6 overflow-auto">
            <RouteGuard>
              {children}
            </RouteGuard>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
