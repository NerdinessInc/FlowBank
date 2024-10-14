'use client';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// components
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function InternalTransfers() {
	const internalTransferScheme = z.object({
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
		resolver: zodResolver(internalTransferScheme),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof internalTransferScheme>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='font-semibold text-2xl'>Internal Transfers</h2>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-3 w-[90%] md:w-1/2 border border-border rounded-md p-6'
				>
					<FormField
						control={methods.control}
						name='sourceAccount'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Source Account</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={(value) => field.onChange(value)}
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
						control={methods.control}
						name='dailyTransferLimit'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Daily Transfer Limit</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your daily transfer limit'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='destinationAccount'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Destination Account</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your destination account'
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

					<Button className='w-full font-semibold mt-3' type='submit'>
						Transfer
					</Button>
				</form>
			</Form>
		</main>
	);
}
