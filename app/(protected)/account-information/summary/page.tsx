'use client';

// components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

// store
import { appStore } from '@/store';

export default function AccountSummary() {
	const { userData } = appStore();

	console.log(userData?.acctCollection);

	return (
		<div>
			<Card>
				<CardHeader className='flex flex-row items-center'>
					<CardTitle>My Accounts (Summary)</CardTitle>
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
		</div>
	);
}
