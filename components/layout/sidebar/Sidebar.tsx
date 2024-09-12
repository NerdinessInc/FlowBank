import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { LogOut } from 'lucide-react';


import { Button } from '@/components/ui/button';
import { renderRoutes, sidebarRoutes } from '@/utils';

export const Sidebar = () => {
	const pathname = usePathname();
	const [openItems, setOpenItems] = useState<string[]>([]);

	return (
		<nav className='grid items-start px-4 text-sm font-medium gap-1'>
			<div className='h-14 flex items-center'>
				<h2 className='text-xl font-bold'>Flow Bank</h2>
			</div>

			{renderRoutes({
				routes: sidebarRoutes,
				level: 0,
				pathname,
				openItems,
				setOpenItems,
			})}

			<div className='mt-12 px-4'>
				<Button variant={'outline'} className='gap-2'>
					<LogOut className='h-4 w-4' />
					Log Out
				</Button>
			</div>
		</nav>
	);
};
