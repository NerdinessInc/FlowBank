"use client";

import React from 'react';
import { useTenant } from '@/components/providers/TenantProvider';

interface FeatureGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * FeatureGuard component
 * 
 * Conditionally renders its children based on whether a specific feature flag
 * is enabled in the current tenant's configuration (tenant-config.json).
 * 
 * @param featureKey - The string key matching the feature in the config (e.g. "loans")
 * @param children - Components to render if the feature is enabled
 * @param fallback - Optional components to render if the feature is disabled (defaults to null)
 */
export function FeatureGuard({ featureKey, children, fallback = null }: FeatureGuardProps) {
  const tenant = useTenant();
  
  // If the features object is defined, check the specific key.
  // We default to false (disabled) if the feature isn't explicitly defined.
  const isEnabled = tenant?.features?.[featureKey] ?? false;

  if (isEnabled) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
