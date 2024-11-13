'use client';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// components
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

// utils
import { Textarea } from '@/components/ui/textarea';

export default function CreateHolds() {
	const createHoldSchema = z.object({
		account: z.string().min(1, 'Please enter your account'),
		balance: z.string().min(1, 'Please enter your balance'),
		holdAmount: z.string().min(1, 'Please enter your hold amount'),
		holdReason: z.string().min(1, 'Please enter your hold reason'),
		holdExpiryDate: z.string({
			required_error: 'Please enter the date',
		}),
	});

	const defaultValues = {
		account: '',
		balance: '',
		holdAmount: '',
		holdReason: '',
		holdExpiryDate: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(createHoldSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof createHoldSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Accounts Hold Maintenance</h2>

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
						name='balance'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Available Balance</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Available Balance' required />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='holdAmount'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Hold Amount</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Enter hold amount' required />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='holdReason'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Message</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder='Enter your message'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='holdExpiryDate'
						render={({ field }) => (
							<FormItem className='flex flex-col w-full'>
								<FormLabel>Hold Expiry Date</FormLabel>
								<Input
									{...field}
									placeholder='Enter your hold expiry date'
									type='date'
								/>

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
