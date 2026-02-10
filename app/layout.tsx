import type { Metadata } from 'next';
// import localFont from 'next/font/local';
import { Roboto_Slab } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';

import Providers from '@/app/providers';

import './globals.css';

// const geistSans = localFont({
// 	src: './fonts/GeistVF.woff',
// 	variable: '--font-geist-sans',
// 	weight: '100 900',
// });

// const geistMono = localFont({
// 	src: './fonts/GeistMonoVF.woff',
// 	variable: '--font-geist-mono',
// 	weight: '100 900',
// });

const robotoSlab = Roboto_Slab({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	display: 'swap',
});

export const metadata: Metadata = {
  title: "Nomase MFB",
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
			<body className={`${robotoSlab.className} antialiased`}>
				<Providers>
					{children}

					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
