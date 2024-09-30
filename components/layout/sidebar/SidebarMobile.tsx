import { useState } from 'react';
import { usePathname } from 'next/navigation';

// icons
import { Menu, LogOut } from 'lucide-react';

// components
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// utils
import { sidebarRoutes, renderRoutes } from '@/utils';

// store
import { appStore } from '@/store';

export const SidebarMobile = () => {
	const pathname = usePathname();

	const { logout } = appStore();

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

				<div className='mt-12 px-4'>
					<Button variant={'outline'} className='gap-2' onClick={logout}>
						<LogOut className='h-4 w-4' />
						Log Out
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
