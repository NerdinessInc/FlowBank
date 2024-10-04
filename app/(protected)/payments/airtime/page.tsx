'use client';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// icons

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// utils
import { Input } from '@/components/ui/input';

export default function AirtimePayment() {
	const airtimeSchema = z.object({
		account: z.string().min(1, 'Please enter your account'),
		networkProvider: z.string().min(1, 'Please enter your network provider'),
		amount: z.string().min(1, 'Please enter your amount'),
	});

	const defaultValues = {
		account: '',
		networkProvider: '',
		amount: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(airtimeSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof airtimeSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Airtime Payments</h2>

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
						name='networkProvider'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Network Provider</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={(value) => field.onChange(value)}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select network provider' />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value='mtn'>MTN</SelectItem>
											<SelectItem value='glo'>Glo</SelectItem>
											<SelectItem value='airtel'>Airtel</SelectItem>
										</SelectContent>
									</Select>
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

					<Button className='w-full font-semibold mt-3' type='submit'>
						Submit
					</Button>
				</form>
			</Form>
		</main>
	);
}
