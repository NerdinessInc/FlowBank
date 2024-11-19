'use client';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

export default function StandingInstruction() {
	const standingInstructionSchema = z.object({
		fromAccount: z.string().min(1, 'Please enter your from account'),
		availableBalance: z.string().min(1, 'Please enter your available balance'),
		toAccount: z.string().min(1, 'Please enter your to account'),
		amount: z.string().min(1, 'Please enter your amount'),
		startDate: z.string({ required_error: 'Please enter the start date' }),
		endDate: z.string({ required_error: 'Please enter the end date' }),
		frequency: z.string().min(1, 'Please enter your frequency'),
		narration: z.string().min(1, 'Please enter your narration'),
	});

	const defaultValues = {
		fromAccount: '',
		availableBalance: '',
		toAccount: '',
		amount: '',
		startDate: '',
		endDate: '',
		frequency: '',
		narration: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(standingInstructionSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof standingInstructionSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full grid grid-cols-2 gap-6 items-center md:justify-center'>
			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='col-span-2 grid grid-cols-2 gap-6 border border-border rounded-md p-6 divide-x'
				>
					<div className='col-span-2 md:col-span-1 flex flex-col justify-center items-center'>
						<h2 className='text-2xl font-bold mb-4'>
							Standing Instruction Maintenance
						</h2>
						<div className='space-y-3 w-[90%] md:w-2/3'>
							<FormField
								control={methods.control}
								name='fromAccount'
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
							<Input disabled placeholder='Account Name' />
							<FormField
								control={methods.control}
								name='availableBalance'
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
								name='toAccount'
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
							<Input disabled placeholder='Account Name' />
							<FormField
								control={methods.control}
								name='amount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>SI Amount</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your amount'
												required
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className='col-span-2 md:col-span-1 flex flex-col justify-center items-center'>
						<h2 className='text-2xl font-bold mb-4'>Duration Information</h2>
						<div className='space-y-3 w-[90%] md:w-2/3'>
							<FormField
								control={methods.control}
								name='startDate'
								render={({ field }) => (
									<FormItem className='flex flex-col w-full'>
										<FormLabel>Start Date</FormLabel>
										<Input
											{...field}
											placeholder='Enter your start date'
											type='date'
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={methods.control}
								name='endDate'
								render={({ field }) => (
									<FormItem className='flex flex-col w-full'>
										<FormLabel>End Date</FormLabel>
										<Input
											{...field}
											placeholder='Enter your end date'
											type='date'
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={methods.control}
								name='frequency'
								render={({ field }) => (
									<FormItem>
										<FormLabel>SI Frequency</FormLabel>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={(value) => field.onChange(value)}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select Frequency' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='weekly'>Weekly</SelectItem>
													<SelectItem value='monthly'>Monthly</SelectItem>
													<SelectItem value='quarterly'>Quarterly</SelectItem>
													<SelectItem value='yearly'>Yearly</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={methods.control}
								name='narration'
								render={({ field }) => (
									<FormItem>
										<FormLabel>SI Narration</FormLabel>
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

							<Button
								className='w-full self-end font-semibold mt-3'
								type='submit'
							>
								Submit
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</main>
	);
}
