'use client';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
import { postTransferInternal, ReturnAcctDetails2 } from '@/services/api';

export default function InterBankLocalTransfers() {
	const { userData } = appStore();

	const [step, setStep] = useState(1);

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

	const interbankLocalTransfersSchema = z.object({
		sourceAccount: z.string().min(1, 'Please select your source account'),
		dailyTransferLimit: z
			.number()
			.min(1, 'Please enter your daily transfer limit'),
		destinationBank: z.string().min(1, 'Please select your destination bank'),
		beneficiaryAccount: z.string().min(1, 'Please enter beneficiary account'),
		beneficiaryName: z.string().min(1, 'Please enter beneficiary name'),
		transferAmount: z.string().min(1, 'Please enter transfer amount'),
		transferCode: z.string().min(1, 'Please enter transfer code'),
		token: z.string().min(1, 'Please enter your Token'),
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: 0,
		destinationBank: '',
		beneficiaryAccount: '',
		beneficiaryName: '',
		transferAmount: '',
		transferCode: '',
		token: '',
	};

	const transferMutation = useMutation({
		mutationFn: postTransferInternal,
		onSuccess: (res: any) => {
			console.log(res);
		},
	});

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(interbankLocalTransfersSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger, getValues, setValue, watch } =
		methods;

	useEffect(() => {
		if (watch('sourceAccount').length >= 10) {
			setValue(
				'dailyTransferLimit',
				userData?.pLimitsObject?.LimitsObject?.find(
					(limit: any) =>
						limit.Accountnumber.toString() === watch('sourceAccount')
				)?.InterBankLimit as number
			);
		}
	}, [setValue, userData, watch('sourceAccount')]);

	const nextStep = async () => {
		const fields = {
			1: ['sourceAccount'],
			2: ['destinationBank', 'beneficiaryAccount', 'beneficiaryName'],
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

	const onSubmit = async (
		data: z.infer<typeof interbankLocalTransfersSchema>
	) => {
		console.log('Processing transfer:', data);
		transferMutation.mutate(data);
	};

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Interbank (Local)</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 4</h3>
				<p className='text-gray-600'>
					{step === 1 && 'Select your source account'}
					{step === 2 && 'Select destination bank and beneficiary details'}
					{step === 3 && 'Enter transfer amount and details'}
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
												disabled
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
								name='destinationBank'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Destination Bank</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select Destination Bank' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='bank1'>Bank 1</SelectItem>
													<SelectItem value='bank2'>Bank 2</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='beneficiaryAccount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Beneficiary Account</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter Beneficiary Account'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='beneficiaryName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Beneficiary Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter Beneficiary Name' />
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
											<Input {...field} placeholder='Enter Transfer Amount' />
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
											<Input {...field} placeholder='Enter Transfer Code' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{step === 4 && (
						<div className='text-center'>
							<p className='mb-4'>
								You are about to transfer{' '}
								{formatCurrency(getValues('transferAmount'))} from your account{' '}
								{getValues('sourceAccount')} to{' '}
								{getValues('beneficiaryAccount')},{' '}
								{getValues('beneficiaryName')} at {getValues('destinationBank')}
								.
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
