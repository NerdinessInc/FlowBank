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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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

export default function Miscellaneous() {
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

	const miscellaneousSchema = z.object({
		messageTypeId: z.string().min(1, 'Please enter your message type id'),
		messageDate: z.string().min(1, 'Please enter your message date'),
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
		message: z.string().min(1, 'Please enter your message'),
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
		message: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(miscellaneousSchema),
	});

	const { handleSubmit, setValue } = methods;

	useEffect(() => {
		if (data?.data && sessionID && userData?.acctCollection?.AcctStruct) {
			setValue('messageTypeId', `MiscRequest|${sessionID}`);
			setValue('messageDate', format(new Date(), 'dd-MM-yyyy'));
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
			messageBody: `Miscellaneous Request from User with Acct No:${data.account}|.Details are as follows: ${data.message}`,
		};

		mutate(newData);
	};

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Miscellaneous Requests</h2>

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
						name='message'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Message</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder='Enter your message'
										className='resize-none'
									/>
								</FormControl>
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
