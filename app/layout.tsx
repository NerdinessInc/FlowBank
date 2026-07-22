import type { Metadata } from 'next';
// import localFont from 'next/font/local';
import { Outfit } from 'next/font/google';

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${outfit.className} antialiased`}>
				<Providers>
					{children}

					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
