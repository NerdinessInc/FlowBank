export type TenantConfig = {
  id: string;
  name: string;
  logo: string;
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
  };
};

export const tenants: Record<string, TenantConfig> = {
  "bank-a": {
    id: "bank-a",
    name: "Alpha Bank",
    logo: "https://png.pngtree.com/png-vector/20190215/ourmid/pngtree-vector-bank-icon-png-image_532993.jpg", // Assuming we have these in public/ later
    colors: {
      primary: "#0052cc", // A distinct blue
      primaryForeground: "#ffffff",
      accent: "#06b6d4", // Cyan accent
    },
  },
  "bank-b": {
    id: "bank-b",
    name: "Beta Finance",
    logo: "https://static.vecteezy.com/system/resources/previews/021/944/628/non_2x/bank-logo-or-icon-design-on-white-background-illustration-vector.jpg",
    colors: {
      primary: "#16a34a", // A distinct green
      primaryForeground: "#ffffff",
      accent: "#84cc16", // Lime accent
    },
  },
  default: {
    id: "default",
    name: "FlowBank",
    logo: "https://static.vecteezy.com/system/resources/thumbnails/013/948/616/small/bank-icon-logo-design-vector.jpg", // Fallback logo
    colors: {
      primary: "#171717", // Default dark
      primaryForeground: "#ffffff", // Default light text
      accent: "#171717", // Default black accent to match primary (no blue)
    },
  },
};

export async function getTenantConfig(institutionId: string): Promise<TenantConfig> {
  // In a real application, this would fetch from a database.
  // We simulate a network delay.
  await new Promise((resolve) => setTimeout(resolve, 50));
  return tenants[institutionId] || tenants['default'];
}
