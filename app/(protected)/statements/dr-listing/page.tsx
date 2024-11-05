'use client';

import { format } from 'date-fns';
import { useState } from 'react';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// components
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/Loader';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

// utils
import { formatCurrency } from '@/utils/formatNumber';

// store
import { appStore } from '@/store';

// services
import { getAccountHistory, ReturnAcctDetails2 } from '@/services/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function DRListing() {
	const { userData } = appStore();

	const [step, setStep] = useState(1);
	const [accountHistory, setAccountHistory] = useState<any[]>([]);

	const { data, isLoading } = useQuery({
		queryKey: ['dr-listing'],
		queryFn: () =>
			ReturnAcctDetails2(
				2,
				userData?.userRec,
				userData?.acctCollection?.AcctStruct
			),
		enabled: !!userData?.acctCollection?.AcctStruct,
	});

	const drListingSchema = z.object({
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
		resolver: zodResolver(drListingSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger } = methods;

	const nextStep = async () => {
		const isValid = await trigger('account');
		if (isValid) {
			setStep(2);
		}
	};

	const previousStep = () => {
		setStep(1);
	};

	const { mutate, isPending } = useMutation({
		mutationFn: (data: any) =>
			getAccountHistory(data.account, data.startDate, data.endDate),
		onSuccess: (res: any) => {
			const debitData = res.data.filter((data: any) => data.COD_DRCR === 'DR');

			setAccountHistory(debitData);
		},
	});

	const onSubmit = async (data: z.infer<typeof drListingSchema>) => {
		const formattedData = {
			...data,
			startDate: format(data.startDate, 'yyyy-MM-dd'),
			endDate: format(data.endDate, 'yyyy-MM-dd'),
		};

		mutate(formattedData);
	};

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>DR Listing</h2>

			{accountHistory.length === 0 && (
				<>
					<div className='w-full text-center mb-4'>
						<h3 className='text-lg'>Step {step} of 2</h3>
						<p className='text-gray-600'>
							{step === 1 && 'Select your account'}
							{step === 2 && 'Choose the start and end dates'}
						</p>
					</div>

					<Form {...methods}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-3 w-[90%] md:w-1/2 border border-border rounded-md p-6'
						>
							{step === 1 && (
								<FormField
									control={control}
									name='account'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Select Account</FormLabel>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger>
														<SelectValue placeholder='Select account' />
													</SelectTrigger>

													<SelectContent>
														{data?.data?.map((account: any, index: number) => (
															<SelectItem
																key={index}
																value={account.accountNumber}
															>
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
							)}

							{step === 2 && (
								<>
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
								</>
							)}

							<div className='flex justify-between'>
								{step > 1 && (
									<Button
										type='button'
										onClick={previousStep}
										variant='outline'
									>
										Back
									</Button>
								)}

								{step === 1 && (
									<Button type='button' className='ml-auto' onClick={nextStep}>
										Next
									</Button>
								)}

								{step === 2 && (
									<Button
										type='submit'
										className='ml-auto'
										disabled={isPending}
									>
										Submit
									</Button>
								)}
							</div>
						</form>
					</Form>
				</>
			)}

			{accountHistory.length > 0 && (
				<div className='w-full text-center mb-4'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Account Number</TableHead>
								<TableHead>Transaction Date</TableHead>
								<TableHead>Transaction Amount</TableHead>
								<TableHead>Description</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody className='text-left'>
							{accountHistory.map((account: any, index: number) => (
								<TableRow key={index}>
									<TableCell>{account.COD_ACCT_NO}</TableCell>
									<TableCell>{account.DAT_TXN}</TableCell>
									<TableCell>{formatCurrency(account.AMT_TXN)}</TableCell>
									<TableCell>{account.trandesc}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</main>
	);
}
