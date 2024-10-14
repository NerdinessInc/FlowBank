'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

import { ActivitySquare, Banknote, CreditCard } from 'lucide-react';

// components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Loading } from '@/components/Loader';

// store
import { appStore } from '@/store';

export default function Dashboard() {
	const { userData, appData } = appStore();

	console.log(appData);

	const advertImages: string[] = [
		'https://images.unsplash.com/photo-1719937050445-098888c0625e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1725714835081-118a2b0456b2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1726134212431-c794fd3d0c34?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	];

	if (!userData) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6'>
			<h2 className='text-2xl font-bold'>
				Welcome, {userData?.userRec?.pFullName}
			</h2>

			<div className='grid gap-2 md:grid-cols-3'>
				<Card x-chunk='dashboard-01-chunk-0'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Account Balance
						</CardTitle>
						<Banknote />
					</CardHeader>

					<CardContent>
						<div className='text-2xl font-bold'>N20,000.08</div>
					</CardContent>
				</Card>

				<Card x-chunk='dashboard-01-chunk-1'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Account Number
						</CardTitle>
						<CreditCard />
					</CardHeader>

					<CardContent>
						<div className='text-2xl font-bold'>1234567890</div>
					</CardContent>
				</Card>

				<Card x-chunk='dashboard-01-chunk-2'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Status</CardTitle>
						<ActivitySquare />
					</CardHeader>

					<CardContent>
						<div className='text-2xl font-bold'>Active</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className='flex flex-row items-center'>
					<CardTitle>My Accounts</CardTitle>
				</CardHeader>

				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Account Number</TableHead>
								<TableHead>Account Title</TableHead>
								<TableHead>Currency</TableHead>
								<TableHead>Type</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{userData?.acctCollection?.AcctStruct?.slice(1).map(
								(account, index) => (
									<TableRow key={index}>
										<TableCell>{account.AccountNumber}</TableCell>
										<TableCell>{account.accountName}</TableCell>
										<TableCell>{account.IsoCurrencyName}</TableCell>
										<TableCell>{account.cod_acct_type}</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Carousel
				className='mt-4'
				opts={{
					loop: true,
				}}
				plugins={[
					Autoplay({
						delay: 5000,
					}),
				]}
			>
				<CarouselContent>
					{advertImages.map((image, index) => (
						<CarouselItem className='relative w-full h-[300px]' key={index}>
							<div className='w-full h-full'>
								<Image
									src={image}
									fill
									alt={`image ${index + 1}`}
									className='object-cover'
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</main>
	);
}
