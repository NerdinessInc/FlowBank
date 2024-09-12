'use client';

import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { SidebarMobile } from '@/components/layout/sidebar/SidebarMobile';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]'>
			<div className='hidden border-r bg-muted/40 md:block'>
				<Sidebar />
			</div>

			<div className='flex flex-col h-screen'>
				<div className='p-3 md:hidden'>
					<SidebarMobile />
				</div>

				<main className='flex flex-1 flex-col gap-4 mb-6 p-4 md:gap-6 md:p-6'>
					{children}
				</main>
			</div>
		</div>
	);
}
