'use client';

import { format } from 'date-fns';
import { useState } from 'react';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// icons
import { CalendarIcon } from 'lucide-react';

// components
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// utils
import { cn } from '@/lib/utils';

export default function DRListing() {
	const [step, setStep] = useState(1);

	const drListingSchema = z.object({
		account: z.string().min(1, 'Please enter your account'),
		startDate: z.date({
			required_error: 'Please enter the start date',
		}),
		endDate: z.date({
			required_error: 'Please enter the end date',
		}),
	});

	const defaultValues = {
		account: '',
		startDate: new Date(),
		endDate: new Date(),
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

	const onSubmit = async (data: z.infer<typeof drListingSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>DR Listing</h2>

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
											onValueChange={(value) => field.onChange(value)}
										>
											<SelectTrigger>
												<SelectValue placeholder='Select account' />
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
								name='startDate'
								render={({ field }) => (
									<FormItem className='flex flex-col w-full'>
										<FormLabel>Start Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value ? (
															format(field.value, 'PPP')
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>

											<PopoverContent className='w-auto p-0' align='start'>
												<Calendar
													mode='single'
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>

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
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value ? (
															format(field.value, 'PPP')
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>

											<PopoverContent className='w-auto p-0' align='start'>
												<Calendar
													mode='single'
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					<div className='flex justify-between'>
						{step > 1 && (
							<Button type='button' onClick={previousStep} variant='outline'>
								Back
							</Button>
						)}

						{step === 1 && (
							<Button type='button' className='ml-auto' onClick={nextStep}>
								Next
							</Button>
						)}

						{step === 2 && (
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
