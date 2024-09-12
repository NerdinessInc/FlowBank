import { Banknote, CreditCard, ActivitySquare } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export default function Dashboard() {
	return (
		<main className='h-full w-full flex flex-col gap-6'>
			<h2 className='text-2xl font-bold'>Welcome, Segun Olagunju</h2>

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

			<div>
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
								<TableRow>
									<TableCell>1234567890</TableCell>
									<TableCell>Segun Olagunju</TableCell>
									<TableCell>USD</TableCell>
									<TableCell>Savings</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
