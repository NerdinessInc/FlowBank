'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useQuery, useMutation } from '@tanstack/react-query';

// components
import { Loading } from '@/components/Loader';
import { Button } from '@/components/ui/button';
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

// store
import { appStore } from '@/store';

// utils
import { formatCurrency } from '@/utils/formatNumber';

// services
import { saveMessageDetails, ReturnAcctDetails2 } from '@/services/api';

export default function StopPayment() {
	const { userData } = appStore();
	const [sessionID, setSessionID] = useState(null);

	// session id
	useEffect(() => {
		async function fetchSessionID() {
			const res = await fetch('/api/getSessionId');
			if (res.ok) {
				const data = await res.json();
				setSessionID(data.sessionID);
			} else {
				console.error('Failed to fetch session ID');
			}
		}
		fetchSessionID();
	}, []);

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

	const { mutate, isPending } = useMutation({
		mutationFn: (data: any) => saveMessageDetails(data),
		onSuccess: (res: any) => {
			console.log(res);
		},
	});

	const stopPaymentSchema = z.object({
		messageTypeId: z.string().min(1, 'Please enter your message type id'),
		messageDate: z.string().min(1, 'Please enter a date'),
		messageStatus: z.string().min(1, 'Please enter your message status'),
		messageSenderName: z
			.string()
			.min(1, 'Please enter your message sender name'),
		messageSenderEmail: z
			.string()
			.min(1, 'Please enter your message sender email'),
		messageSenderPhone: z
			.number()
			.min(1, 'Please enter your message sender phone'),
		messageSenderCustId: z
			.number()
			.min(1, 'Please enter your message sender cust id'),
		account: z.string().min(1, 'Please select an account'),
		startChequeNumber: z.string().min(1, 'Please enter start cheque number'),
		endChequeNumber: z.string().min(1, 'Please enter end cheque number'),
		amount: z.string().min(1, 'Please enter amount'),
	});

	const defaultValues = {
		messageTypeId: '',
		messageDate: '',
		messageStatus: '',
		messageSenderName: '',
		messageSenderEmail: '',
		messageSenderPhone: '',
		messageSenderCustId: '',
		account: '',
		startChequeNumber: '',
		endChequeNumber: '',
		amount: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(stopPaymentSchema),
	});

	const { handleSubmit, setValue } = methods;

	useEffect(() => {
		if (data?.data && sessionID && userData?.acctCollection?.AcctStruct) {
			setValue('messageTypeId', `StopPayment|${sessionID}`);
			setValue('messageStatus', 'Pending');
			setValue(
				'messageSenderName',
				userData.acctCollection.AcctStruct[1].cod_acct_title as string
			);
			setValue(
				'messageSenderEmail',
				userData.acctCollection.AcctStruct[1].Email as string
			);
			setValue(
				'messageSenderPhone',
				userData.acctCollection.AcctStruct[1].Gsm as any
			);
			setValue(
				'messageSenderCustId',
				userData.acctCollection.AcctStruct[1].CustomerID as any
			);
		}
	}, [data, sessionID, userData, setValue]);

	const onSubmit = async (data: any) => {
		const newData = {
			...data,
			messageDate: format(new Date(data.messageDate), 'dd-MM-yyyy'),
			messageBody: `Cheque Bk Stop Request from User with Acct No:${data.account}|.Details are as follows: Range of requested leaves is from ${data.startChequeNumber} to ${data.endChequeNumber}|. The amount is ${data.amount}|.Cheque Date is ${data.messageDate}`,
		};

		mutate(newData);
	};

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Stop Cheque Payment Request</h2>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-3 w-[90%] md:w-1/2 border border-border rounded-md p-6'
				>
					<FormField
						control={methods.control}
						name='account'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Select Account</FormLabel>
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
						control={methods.control}
						name='startChequeNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Start Cheque Number</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Enter start cheque number' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='endChequeNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>End Cheque Number</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Enter end cheque number' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='amount'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Enter amount' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='messageDate'
						render={({ field }) => (
							<FormItem className='flex flex-col w-full'>
								<FormLabel>Date</FormLabel>
								<Input {...field} placeholder='Enter your date' type='date' />
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full font-semibold mt-3' type='submit'>
						{isPending ? '...' : 'Submit'}
					</Button>
				</form>
			</Form>
		</main>
	);
}
