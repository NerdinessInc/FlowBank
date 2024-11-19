import Link from 'next/link';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { Route } from './routes';

import { cn } from '@/lib/utils';

export const renderRoutes = ({
	routes,
	level,
	pathname,
	openItems,
	setOpenItems,
}: {
	routes: Route[];
	level: number;
	pathname: string;
	openItems: string[];
	setOpenItems: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
	const toggleItem = (pathname: string) => {
		setOpenItems((prevOpenItems) =>
			prevOpenItems.includes(pathname)
				? prevOpenItems.filter((item) => item !== pathname)
				: [...prevOpenItems, pathname]
		);
	};

	return routes.map((route) => {
		const isOpen = openItems.includes(route.pathname);

		const isActive =
			pathname === route.pathname || pathname.startsWith(route.pathname + '/');

		if (route.children) {
			return (
				<Collapsible
					key={route.pathname}
					open={isOpen}
					onOpenChange={() => toggleItem(route.pathname)}
					className='space-y-1.5'
				>
					<CollapsibleTrigger asChild>
						<Button
							variant='ghost'
							className={cn(
								'w-full justify-between',
								isActive && 'bg-muted',
								level > 0 && 'pl-8'
							)}
						>
							<span className='flex items-center gap-2'>
								{route.icon}
								{route.label}
							</span>

							{isOpen ? (
								<ChevronDown className='h-4 w-4' />
							) : (
								<ChevronRight className='h-4 w-4' />
							)}
						</Button>
					</CollapsibleTrigger>

					<CollapsibleContent>
						{renderRoutes({
							routes: route.children,
							level: level + 1,
							pathname,
							openItems,
							setOpenItems,
						})}
					</CollapsibleContent>
				</Collapsible>
			);
		}

		return (
			<Button
				key={route.pathname}
				variant='ghost'
				className={cn(
					'w-full justify-start',
					isActive && 'bg-muted',
					level > 0 && 'pl-8'
				)}
				asChild
			>
				<Link href={route.pathname}>
					<span className='flex items-center gap-2'>
						{route.icon}
						{route.label}
					</span>
				</Link>
			</Button>
		);
	});
};
