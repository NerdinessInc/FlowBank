'use client';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';

export default function ThirdPartyTransfers() {
	const [step, setStep] = useState(1);

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
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: '',
		beneficiary: '',
		destinationAccount: '',
		transferAmount: '',
		transferCode: '',
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
			setStep((prev) => Math.min(prev + 1, 3));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof thirdPartyTransfersSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Third Party Transfers</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 3</h3>
				<p className='text-gray-600'>
					{step === 1 &&
						'Select your source account and enter daily transfer limit'}
					{step === 2 && 'Enter beneficiary and destination account'}
					{step === 3 && 'Enter transfer amount and code'}
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
													<SelectValue placeholder='Select your source account' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='account1'>Account 1</SelectItem>
													<SelectItem value='account2'>Account 2</SelectItem>
													<SelectItem value='account3'>Account 3</SelectItem>
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
									<Label>Numbers</Label>
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
									<Label>Big Letters</Label>
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
									<Label>Small Letters</Label>
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
