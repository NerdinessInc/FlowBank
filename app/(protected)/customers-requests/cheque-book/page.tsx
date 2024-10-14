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

export default function ChequeBook() {
	const chequeBookSchema = z.object({
		account: z.string().min(1, 'Please enter your account'),
		leaves: z.string().min(1, 'Please enter your leaves'),
		deliveryOption: z.string().min(1, 'Please enter your delivery option'),
	});

	const defaultValues = {
		account: '',
		leaves: '',
		deliveryOption: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(chequeBookSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof chequeBookSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Cheque Book Request</h2>

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
						name='leaves'
						render={({ field }) => (
							<FormItem>
								<FormLabel>No. of Leaves</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={(value) => field.onChange(value)}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select No. of Leaves' />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value='25'>25</SelectItem>
											<SelectItem value='50'>50</SelectItem>
											<SelectItem value='100'>100</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='deliveryOption'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Delivery Option</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={(value) => field.onChange(value)}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select Delivery Option' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='branch'>By Branch</SelectItem>
											<SelectItem value='centralLocation'>
												By Central Location
											</SelectItem>
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
