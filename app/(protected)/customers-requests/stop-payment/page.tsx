'use client';

import { format } from 'date-fns';

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
import { Input } from '@/components/ui/input';
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

export default function StopPayment() {
	const stopPaymentSchema = z.object({
		account: z.string().min(1, 'Please enter your account'),
		startChequeNumber: z
			.string()
			.min(1, 'Please enter your start cheque number'),
		endChequeNumber: z.string().min(1, 'Please enter your end cheque number'),
		amount: z.string().min(1, 'Please enter your amount'),
		date: z.date({
			required_error: 'Please enter the date',
		}),
		beneficiaryName: z.string().min(1, 'Please enter your beneficiary name'),
	});

	const defaultValues = {
		account: '',
		startChequeNumber: '',
		endChequeNumber: '',
		amount: '',
		date: new Date(),
		beneficiaryName: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(stopPaymentSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof stopPaymentSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Stop Cheque Payment Request</h2>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-3 w-[90%] md:w-1/2'
				>
					<FormField
						control={methods.control}
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

					<FormField
						control={methods.control}
						name='startChequeNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Start Cheque Number</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your start cheque number'
										required
									/>
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
									<Input
										{...field}
										placeholder='Enter your end cheque number'
										required
									/>
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
									<Input {...field} placeholder='Enter your amount' required />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='date'
						render={({ field }) => (
							<FormItem className='flex flex-col w-full'>
								<FormLabel>Date on Cheque</FormLabel>
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
						control={methods.control}
						name='beneficiaryName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Beneficiary Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your beneficiary name'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full font-semibold mt-3' type='submit'>
						Submit
					</Button>
				</form>
			</Form>
		</main>
	);
}
