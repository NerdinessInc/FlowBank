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

export default function InternalTransfers() {
	const [step, setStep] = useState(1);

	const internalTransferSchema = z.object({
		sourceAccount: z.string().min(1, 'Please select your source account'),
		dailyTransferLimit: z
			.string()
			.min(1, 'Please enter your daily transfer limit'),
		destinationAccount: z
			.string()
			.min(1, 'Please enter your destination account'),
		amount: z.string().min(1, 'Please enter your amount'),
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: '',
		destinationAccount: '',
		amount: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(internalTransferSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger } = methods;

	const nextStep = async () => {
		const fields = {
			1: ['sourceAccount'],
			2: ['dailyTransferLimit', 'destinationAccount'],
			3: ['amount'],
		}[step];

		const isValid = await trigger(fields as any);

		if (isValid) {
			setStep((prev) => Math.min(prev + 1, 3));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof internalTransferSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Internal Transfers</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 3</h3>
				<p className='text-gray-600'>
					{step === 1 && 'Select your source account'}
					{step === 2 && 'Enter daily transfer limit and destination account'}
					{step === 3 && 'Enter transfer amount'}
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
												<SelectItem value='account3'>Account 3</SelectItem>
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
								Transfer
							</Button>
						)}
					</div>
				</form>
			</Form>
		</main>
	);
}
