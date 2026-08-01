export type TenantConfig = {
  id: string;
  name: string;
  logo: string;
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
  };
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  backgroundImage?: string;
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
    description:
      "Empowering your financial future with modern, secure, and reliable banking solutions tailored for you.",
    contactPhone: "+1 (800) 123-4567",
    contactEmail: "support@alphabank.com",
    facebook: "https://facebook.com/alphabank",
    instagram: "https://instagram.com/alphabank",
    whatsapp: "+18001234567",
    backgroundImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // Business building
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
    description:
      "Sustainable banking for a greener tomorrow. Experience next-generation finance with Beta.",
    contactPhone: "+1 (888) 987-6543",
    contactEmail: "hello@betafinance.org",
    facebook: "https://facebook.com/betafinance",
    instagram: "https://instagram.com/betafinance",
    whatsapp: "+18889876543",
    backgroundImage:
      "https://images.skyscrapercenter.com/building/China-Merchants-Bank-Global-Headquarters-Main-Tower-Sanxin-Technology-1747760157657.jpg", // Green finance theme
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
    description:
      "Secure Internet Banking Platform. Manage your wealth efficiently and securely.",
    contactPhone: "+1 (555) 000-0000",
    contactEmail: "support@flowbank.io",
    facebook: "https://facebook.com/flowbank",
    instagram: "https://instagram.com/flowbank",
    whatsapp: "+15550000000",
    backgroundImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0c6o05jqWp8uxaqOkHE9gKgvcx4Evm84xQ6L-IYAdDZ69jnajzZuCuig&s=10", // Business tech
  },
};

export async function getTenantConfig(institutionId: string): Promise<TenantConfig> {
  // In a real application, this would fetch from a database.
  // We simulate a network delay.
  await new Promise((resolve) => setTimeout(resolve, 50));
  return tenants[institutionId] || tenants['default'];
}
