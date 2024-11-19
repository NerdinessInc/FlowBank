'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// icons
import { Save } from 'lucide-react';

// query
import { useMutation, useQuery } from '@tanstack/react-query';

// components
import { Loading } from '@/components/Loader';
import { Paginate } from '@/components/Paginate';
import { StatementPDF } from '@/components/StatementPDF';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// utils
import { formatCurrency } from '@/utils/formatNumber';

// store
import { appStore } from '@/store';

// services
import { getAccountHistory, ReturnAcctDetails2 } from '@/services/api';

export default function CRListing() {
	const { userData } = appStore();

	const [accountHistory, setAccountHistory] = useState<any[]>([]);
	const [items, setItems] = useState<any[]>([]);

	const { data, isLoading } = useQuery({
		queryKey: ['my-accounts'],
		queryFn: () =>
			ReturnAcctDetails2(
				2,
				userData?.userRec,
				userData?.acctCollection?.AcctStruct
			),
		enabled: !!userData?.acctCollection?.AcctStruct,
	});

	const crListingSchema = z.object({
		account: z.string().min(1, 'Please enter your account'),
		startDate: z.string({
			required_error: 'Please enter the start date',
		}),
		endDate: z.string({
			required_error: 'Please enter the end date',
		}),
	});

	const defaultValues = {
		account: '',
		startDate: '',
		endDate: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(crListingSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control } = methods;

	const { mutate, isPending } = useMutation({
		mutationFn: (data: any) =>
			getAccountHistory(data.account, data.startDate, data.endDate),
		onSuccess: (res: any) => {
			const creditData = res.data.filter((data: any) => data.COD_DRCR === 'CR');
			setAccountHistory(creditData);
			setItems(creditData.slice(0, 10));
		},
	});

	const handlePageChange = (page: number) => {
		const offset = (page - 1) * 10;
		const newItems = accountHistory?.slice(offset, offset + 10);
		setItems(newItems);
	};

	const onSubmit = async (data: z.infer<typeof crListingSchema>) => {
		const formattedData = {
			...data,
			startDate: format(new Date(data.startDate), 'yyyy-MM-dd'),
			endDate: format(new Date(data.endDate), 'yyyy-MM-dd'),
		};

		mutate(formattedData);
	};

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>CR Listing</h2>

			{accountHistory.length === 0 && (
				<Form {...methods}>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-3 w-[90%] md:w-1/2 border border-border rounded-md p-6'
					>
						<FormField
							control={control}
							name='account'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Source Account</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder='Select Source Account' />
											</SelectTrigger>
											<SelectContent>
												{data?.data?.map((account: any, index: number) => (
													<SelectItem key={index} value={account.accountNumber}>
														{account.accountNumber} -{' '}
														{formatCurrency(account.bookBalance)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='startDate'
							render={({ field }) => (
								<FormItem className='flex flex-col w-full'>
									<FormLabel>Start Date</FormLabel>

									<Input
										{...field}
										placeholder='Enter your start date'
										type='date'
									/>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name='endDate'
							render={({ field }) => (
								<FormItem className='flex flex-col w-full'>
									<FormLabel>End Date</FormLabel>

									<Input
										{...field}
										placeholder='Enter your end date'
										type='date'
									/>

									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type='submit' className='w-full' disabled={isPending}>
							Submit
						</Button>
					</form>
				</Form>
			)}

			{accountHistory.length > 0 && (
				<div className='w-full text-center mb-4'>
					<Card>
						<CardHeader>
							<CardTitle>Statement Details</CardTitle>

							<PDFDownloadLink
								document={<StatementPDF accountHistory={accountHistory} />}
								fileName={`Statement ${accountHistory[0].COD_ACCT_NO}.pdf`}
								className='w-36'
							>
								<Button className='flex gap-2 items-center font-bold w-full'>
									Download
									<Save className='h-4 w-4' />
								</Button>
							</PDFDownloadLink>
						</CardHeader>

						<CardContent>
							<Separator className='my-4' />

							<div className='w-full flex justify-between my-6'>
								<div className='flex flex-col items-start'>
									<p>Account No: {accountHistory[0].COD_ACCT_NO}</p>
									<p>
										Opening Balance:{' '}
										{formatCurrency(accountHistory[0].OPENING_BAL)}
									</p>
									<p>
										Available Balance:{' '}
										{formatCurrency(accountHistory[0].CLOSING_BAL)}
									</p>
									<p>Account Type: {accountHistory[0].NAM_PRODUCT}</p>
									<p>
										Statement Period: {accountHistory[0].pSTART_DATE} -{' '}
										{accountHistory[0].END_DATE}
									</p>
									<p>Total Transactions: {accountHistory.length}</p>
								</div>

								<div className='flex flex-col items-end'>
									<p>{accountHistory[0].NAM_CUST_FULL}</p>
									<p>{accountHistory[0].address}</p>
								</div>
							</div>

							<Separator className='my-4' />

							<Table>
								<TableHeader className='bg-background'>
									<TableRow>
										<TableHead>Account Number</TableHead>
										<TableHead>Transaction Date</TableHead>
										<TableHead>Transaction Amount</TableHead>
										<TableHead>Narration</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody className='text-left'>
									{items.map((account: any, index: number) => (
										<TableRow key={index}>
											<TableCell>{account.COD_ACCT_NO}</TableCell>
											<TableCell>{account.DAT_TXN}</TableCell>
											<TableCell>{formatCurrency(account.AMT_TXN)}</TableCell>
											<TableCell>{account.TXT_TXN_DESC}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					<div className='float-right my-3'>
						<Paginate
							totalItems={accountHistory?.length}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			)}
		</main>
	);
}
