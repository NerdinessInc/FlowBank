'use client';

// form
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function DataPayment() {
	const dataSchema = z.object({
		account: z.string().min(1, 'Please enter your account'),
		networkProvider: z.string().min(1, 'Please enter your network provider'),
		dataPlan: z.string().min(1, 'Please enter your amount'),
	});

	const defaultValues = {
		account: '',
		networkProvider: '',
		dataPlan: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(dataSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof dataSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Data Payments</h2>

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
						name='dataPlan'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Network Provider</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={(value) => field.onChange(value)}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select data plan' />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value='mtn'>1GB for 500</SelectItem>
											<SelectItem value='glo'>10GB for 1000</SelectItem>
											<SelectItem value='airtel'>100GB for 10000</SelectItem>
										</SelectContent>
									</Select>
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
