'use client';

import { useEffect } from 'react';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useQuery } from '@tanstack/react-query';

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
import { ReturnAcctDetails2 } from '@/services/api';

export default function InternalTransfers() {
	const { userData } = appStore();

	const [step, setStep] = useState(1);

	const { data, isLoading } = useQuery({
		queryKey: ['internal-transfers'],
		queryFn: () =>
			ReturnAcctDetails2(
				2,
				userData?.userRec,
				userData?.acctCollection?.AcctStruct
			),
		enabled: !!userData?.acctCollection?.AcctStruct,
	});

	const internalTransferSchema = z.object({
		sourceAccount: z.string().min(1, 'Please select your source account'),
		dailyTransferLimit: z
			.number()
			.min(1, 'Please enter your daily transfer limit'),
		destinationAccount: z
			.string()
			.min(1, 'Please enter your destination account'),
		amount: z.string().min(1, 'Please enter your amount'),
		token: z.string().min(1, 'Please enter your Token'),
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: 0,
		destinationAccount: '',
		amount: '',
		token: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(internalTransferSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger, getValues, setValue, watch } =
		methods;

	// get daily transfer limit with source account
	useEffect(() => {
		if (watch('sourceAccount').length >= 10) {
			setValue(
				'dailyTransferLimit',

				userData?.pLimitsObject?.LimitsObject?.find(
					(limit: any) =>
						limit.Accountnumber.toString() === watch('sourceAccount')
				)?.InternalXferLimit as number
			);
		}
	}, [setValue, userData, watch('sourceAccount')]);

	const nextStep = async () => {
		const fields = {
			1: ['sourceAccount'],
			2: ['dailyTransferLimit', 'destinationAccount'],
			3: ['amount'],
		}[step];

		const isValid = await trigger(fields as any);

		if (isValid) {
			setStep((prev) => Math.min(prev + 1, 4));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof internalTransferSchema>) => {
		console.log(data);
	};

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Internal Transfers</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 4</h3>
				<p className='text-gray-600'>
					{step === 1 && 'Select your source account'}
					{step === 2 && 'Enter daily transfer limit and destination account'}
					{step === 3 && 'Enter transfer amount'}
					{step === 4 && 'Confirm transfer details'}
				</p>
			</div>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-[90%] md:w-2/3 grid grid-cols-1 gap-4 border border-border rounded-md p-6'
				>
					{step === 1 && (
						<FormField
							control={control}
							name='sourceAccount'
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
					)}

					{step === 2 && (
						<>
							<FormField
								control={control}
								name='dailyTransferLimit'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Daily Transfer Limit</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your daily transfer limit'
												disabled
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='destinationAccount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Destination Account</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your destination account'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{step === 3 && (
						<FormField
							control={control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input {...field} placeholder='Enter your amount' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{step === 4 && (
						<div className='text-center'>
							<p className='mb-4'>
								You are about to transfer {formatCurrency(getValues('amount'))}{' '}
								from your account {getValues('sourceAccount')} to{' '}
								{getValues('destinationAccount')}.
							</p>

							<p className='font-bold mb-4'>Do you want to proceed?</p>

							<FormField
								control={control}
								name='token'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Token</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter your Token' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					<div className='flex justify-between'>
						{step > 1 && (
							<Button
								type='button'
								onClick={previousStep}
								variant='outline'
								className='mr-2'
							>
								Back
							</Button>
						)}

						{step < 4 && (
							<Button type='button' className='ml-auto' onClick={nextStep}>
								Next
							</Button>
						)}

						{step === 4 && (
							<>
								<Button type='button' onClick={previousStep} variant='outline'>
									Cancel
								</Button>

								<Button type='submit' className='ml-auto'>
									Confirm Transfer
								</Button>
							</>
						)}
					</div>
				</form>
			</Form>
		</main>
	);
}
