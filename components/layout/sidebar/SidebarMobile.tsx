import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { sidebarRoutes, renderRoutes } from '@/utils';

export const SidebarMobile = () => {
	const pathname = usePathname();
	const [openItems, setOpenItems] = useState<string[]>([]);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant='outline' size='icon' className='shrink-0 md:hidden'>
					<Menu className='h-5 w-5' />
					<span className='sr-only'>Toggle navigation menu</span>
				</Button>
			</SheetTrigger>

			<SheetContent side='left' className='flex flex-col'>
				<div className='flex items-center'>
					<h2 className='text-bold text-xl'>Flow Bank</h2>
				</div>

				{renderRoutes({
					routes: sidebarRoutes,
					level: 0,
					pathname,
					openItems,
					setOpenItems,
				})}
			</SheetContent>
		</Sheet>
	);
};
