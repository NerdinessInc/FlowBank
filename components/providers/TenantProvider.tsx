"use client";

import React, { createContext, useContext } from "react";
import { TenantConfig } from "@/lib/tenants";

const TenantContext = createContext<TenantConfig | null>(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

export const TenantProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: TenantConfig;
}) => {
  return (
    <TenantContext.Provider value={config}>
      {children}
    </TenantContext.Provider>
  );
};
