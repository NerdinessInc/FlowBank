'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [currentTime, setCurrentTime] = useState<Date>(new Date());

	const bgImage =
		'https://images.unsplash.com/photo-1719937050445-098888c0625e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<main
			className='flex flex-col h-screen justify-between'
			style={{
				backgroundImage: `url(${bgImage})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<header className='py-1 px-3 '>
				<p className='text-sm font-semibold'>
					{format(currentTime, 'eeee, d MMMM, yyyy, h:mm:ss')}
				</p>
			</header>

			<header className='bg-primary/70 text-primary-foreground'>
				<div className='p-3 flex flex-row justify-between items-center'>
					<h2 className='text-4xl font-bold uppercase'>Nomase</h2>

					<div className='flex gap-12 font-bold items-center'>
						<p className='text-xl'>Internet Banking</p>
						<p className='text-sm font-bold'>Tel: +234 293 4255</p>
					</div>
				</div>
			</header>

			<div className='flex-grow'>{children}</div>

			<footer className='bg-primary text-primary-foreground h-16 flex items-center justify-center'>
				<p className='font-semibold text-sm'>
					© Nerdiness Software {new Date().getFullYear()}
				</p>
			</footer>
		</main>
	);
}
