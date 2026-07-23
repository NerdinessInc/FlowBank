import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Outfit } from 'next/font/google';
import { getTenantConfig } from '@/lib/tenants';
import { TenantProvider } from '@/components/providers/TenantProvider';

import { Toaster } from '@/components/ui/toaster';
import Providers from '@/app/providers';
import './globals.css';

const outfit = Outfit({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
  title: "FlowBank",
  description: "Internet Banking Platform",
//   icons: {
//     icon: "..assets/images/favicon.png",
//     apple: "..assets/images/favicon.png",
//     shortcut: "..assets/images/favicon.png",
//   },
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const tenantId = headersList.get('x-tenant-id') || 'default';
	const config = await getTenantConfig(tenantId);

	return (
		<html lang='en'>
			<head>
				<style dangerouslySetInnerHTML={{
					__html: `
						:root {
							--primary: ${config.colors.primary};
							--primary-foreground: ${config.colors.primaryForeground};
							--accent: ${config.colors.accent};
							--accent-foreground: #ffffff;
							
							/* Light Mode Tinted Palette */
							--background: color-mix(in srgb, var(--primary) 2%, #ffffff);
							--card: color-mix(in srgb, var(--primary) 5%, #ffffff);
							--muted: color-mix(in srgb, var(--primary) 10%, #ffffff);
							--border: color-mix(in srgb, var(--primary) 15%, #ffffff);
							--input: color-mix(in srgb, var(--primary) 15%, #ffffff);
							--ring: var(--primary);
						}

						.dark {
							/* Dark Mode Tinted Palette */
							--background: color-mix(in srgb, var(--primary) 8%, #0a0a0a);
							--card: color-mix(in srgb, var(--primary) 12%, #0a0a0a);
							--muted: color-mix(in srgb, var(--primary) 20%, #0a0a0a);
							--border: color-mix(in srgb, var(--primary) 25%, #0a0a0a);
							--input: color-mix(in srgb, var(--primary) 25%, #0a0a0a);
							--ring: var(--primary);
						}
					`
				}} />
			</head>
			<body className={`${outfit.className} antialiased`}>
				<TenantProvider config={config}>
					<Providers>
						{children}

						<Toaster />
					</Providers>
				</TenantProvider>
			</body>
		</html>
	);
}
