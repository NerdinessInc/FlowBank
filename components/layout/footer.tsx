import { useTenant } from "@/components/providers/TenantProvider";

const Footer = () => {
  const tenant = useTenant();
  const isDefault = tenant.id === "default";
  const footerBgClass = isDefault
    ? "bg-white text-gray-900 border-gray-200"
    : "bg-gradient-to-r from-primary to-accent text-white border-primary/20";

  return (
    <footer className={`p-4 transition-colors duration-300 border-t ${footerBgClass}`}>
      <div className="container mx-auto text-center">
        <p className="text-sm font-medium">
          &copy; Rubicon {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
