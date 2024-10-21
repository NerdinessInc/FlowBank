'use client';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';

// query
import { useMutation } from '@tanstack/react-query';

// components
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// services
import { postTransferInternal } from '@/services/api';

export default function InterBankLocalTransfers() {
	const [step, setStep] = useState(1);

	const thirdPartyTransfersSchema = z.object({
		sourceAccount: z.string().min(1, 'Please select your source account'),
		destinationBank: z.string().min(1, 'Please select your destination bank'),
		beneficiaryAccount: z.string().min(1, 'Please enter beneficiary account'),
		beneficiaryName: z.string().min(1, 'Please enter beneficiary name'),
		transferAmount: z.string().min(1, 'Please enter transfer amount'),
		transferCode: z.string().min(1, 'Please enter transfer code'),
	});

	const defaultValues = {
		sourceAccount: '',
		destinationBank: '',
		beneficiaryAccount: '',
		beneficiaryName: '',
		transferAmount: '',
		transferCode: '',
	};

	const transferMutation = useMutation({
		mutationFn: postTransferInternal,
		onSuccess: (res: any) => {
			console.log(res);
		},
	});

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(thirdPartyTransfersSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger } = methods;

	const nextStep = async () => {
		const fields = {
			1: ['sourceAccount'],
			2: ['destinationBank', 'beneficiaryAccount', 'beneficiaryName'],
			3: ['transferAmount', 'transferCode'],
		}[step];

		const isValid = await trigger(fields as any);

		if (isValid) {
			setStep((prev) => Math.min(prev + 1, 3));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof thirdPartyTransfersSchema>) => {
		console.log(data);

		transferMutation.mutate(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>
				Third Party Transfers (Other Banks)
			</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 3</h3>
				<p className='text-gray-600'>
					{step === 1 && 'Select your source account'}
					{step === 2 && 'Select destination bank and beneficiary details'}
					{step === 3 && 'Enter transfer amount and details'}
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
												<SelectItem value='account1'>Account 1</SelectItem>
												<SelectItem value='account2'>Account 2</SelectItem>
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

					<Separator className='my-4' />

					<div className='flex justify-between'>
						{step > 1 && (
							<Button type='button' onClick={previousStep} variant='outline'>
								Back
							</Button>
						)}

						{step < 3 && (
							<Button type='button' className='ml-auto' onClick={nextStep}>
								Next
							</Button>
						)}

						{step === 3 && (
							<Button type='submit' className='ml-auto'>
								Submit
							</Button>
						)}
					</div>
				</form>
			</Form>
		</main>
	);
}
