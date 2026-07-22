import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// icons
import { Menu, LogOut } from 'lucide-react';

// components
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

// utils
import { sidebarRoutes, renderRoutes } from '@/utils';

// store
import { appStore } from '@/store';

export const SidebarMobile = () => {
	const pathname = usePathname();

	const { logout } = appStore();

	const [openItems, setOpenItems] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	// Close the sidebar when the route changes
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant='outline' size='icon' className='shrink-0 md:hidden'>
					<Menu className='h-5 w-5' />
					<span className='sr-only'>Toggle navigation menu</span>
				</Button>
			</SheetTrigger>

			<SheetContent side='left' className='flex flex-col'>
				<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
				<div className='flex items-center'>
					<h2 className='text-bold text-xl'>FlowBank</h2>
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
