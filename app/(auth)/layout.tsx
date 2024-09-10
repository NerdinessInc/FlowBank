'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [currentTime, setCurrentTime] = useState<Date>(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<main className='flex flex-col items-center justify-between h-screen'>
			<header className='flex flex-col  w-full bg-fuchsia-600 text-white justify-between'>
				<div className='p-3 flex justify-between items-center'>
					<h2 className='text-4xl font-bold uppercase'>Nomase</h2>

					<div className='flex gap-12 font-bold'>
						<p className='text-xl'>Internet Banking</p>
						<p className='text-sm font-bold'>Tel: +234 293 4255</p>
					</div>
				</div>

				<div className='w-full px-4 py-1'>
					<p className='text-sm font-semibold'>
						{format(currentTime, 'eeee, d MMMM, yyyy, h:mm:ss')}
					</p>
				</div>
			</header>

			{children}

			<footer className='w-full flex items-center justify-center h-16 bg-fuchsia-600 text-white'>
				<p className='font-semibold text-sm'> © Nerdiness Software 2022</p>
			</footer>
		</main>
	);
}
