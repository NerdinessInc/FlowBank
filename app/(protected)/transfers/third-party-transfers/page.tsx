'use client';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useQuery } from '@tanstack/react-query';

// components
import { Loading } from '@/components/Loader';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';

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

export default function ThirdPartyTransfers() {
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

	const thirdPartyTransfersSchema = z.object({
		sourceAccount: z.string().min(1, 'Please select your source account'),
		dailyTransferLimit: z
			.string()
			.min(1, 'Please enter your daily transfer limit'),
		beneficiary: z.string().min(1, 'Please enter your beneficiary'),
		destinationAccount: z
			.string()
			.min(1, 'Please enter your destination account'),
		transferAmount: z.string().min(1, 'Please enter your transfer amount'),
		transferCode: z.string().min(1, 'Please enter your transfer code'),
		otp: z.string().min(1, 'Please enter your OTP'),
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: '',
		beneficiary: '',
		destinationAccount: '',
		transferAmount: '',
		transferCode: '',
		otp: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(thirdPartyTransfersSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger, getValues, setValue } = methods;

	const nextStep = async () => {
		const fields = {
			1: ['sourceAccount', 'dailyTransferLimit'],
			2: ['beneficiary', 'destinationAccount'],
			3: ['transferAmount', 'transferCode'],
		}[step];

		const isValid = await trigger(fields as any);

		if (isValid) {
			setStep((prev) => Math.min(prev + 1, 4));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof thirdPartyTransfersSchema>) => {
		console.log('Processing transfer:', data);
	};

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Third Party Transfers</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 4</h3>
				<p className='text-gray-600'>
					{step === 1 &&
						'Select your source account and enter daily transfer limit'}
					{step === 2 && 'Enter beneficiary and destination account'}
					{step === 3 && 'Enter transfer amount and code'}
					{step === 4 && 'Confirm transfer details'}
				</p>
			</div>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-[90%] md:w-2/3 grid grid-cols-1 gap-4 border border-border rounded-md p-6'
				>
					{step === 1 && (
						<>
							<FormField
								control={control}
								name='sourceAccount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Source Account</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select Source Account' />
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
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{step === 2 && (
						<>
							<FormField
								control={control}
								name='beneficiary'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Beneficiary</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter your beneficiary' />
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
						<>
							<FormField
								control={control}
								name='transferAmount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Transfer Amount</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your transfer amount'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='transferCode'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Transfer Code</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your transfer code'
												disabled
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='grid grid-cols-3 gap-3'>
								<div className='col-span-1'>
									<Select
										onValueChange={(newValue) => {
											const currentValue = getValues('transferCode');
											setValue('transferCode', (currentValue || '') + newValue);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='*' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='*'>*</SelectItem>
											{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='col-span-1'>
									<Select
										onValueChange={(newValue) => {
											const currentValue = getValues('transferCode');
											setValue('transferCode', (currentValue || '') + newValue);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='*' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='*'>*</SelectItem>
											{Array.from({ length: 26 }, (_, i) =>
												String.fromCharCode(65 + i)
											).map((letter) => (
												<SelectItem key={letter} value={letter}>
													{letter}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='col-span-1'>
									<Select
										onValueChange={(newValue) => {
											const currentValue = getValues('transferCode');
											setValue('transferCode', (currentValue || '') + newValue);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='*' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='*'>*</SelectItem>
											{Array.from({ length: 26 }, (_, i) =>
												String.fromCharCode(97 + i)
											).map((letter) => (
												<SelectItem key={letter} value={letter}>
													{letter}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</>
					)}

					{step === 4 && (
						<div className='text-center'>
							<p className='mb-4'>
								You are about to transfer{' '}
								{formatCurrency(getValues('transferAmount'))} from your account{' '}
								{getValues('sourceAccount')} to{' '}
								{getValues('destinationAccount')}, {getValues('beneficiary')}.
							</p>
							<p className='font-bold mb-4'>Do you want to proceed?</p>

							<FormField
								control={control}
								name='otp'
								render={({ field }) => (
									<FormItem>
										<FormLabel>OTP</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter your OTP' />
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
