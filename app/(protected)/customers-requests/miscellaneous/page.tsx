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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

// utils
import { cn } from '@/lib/utils';

export default function Miscellaneous() {
	const miscellaneousSchema = z.object({
		requestDate: z.date({
			required_error: 'Please enter your request date',
		}),
		message: z.string().min(1, 'Please enter your message'),
	});

	const defaultValues = {
		requestDate: new Date(),
		message: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(miscellaneousSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof miscellaneousSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Miscellaneous Requests</h2>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-3 w-[90%] md:w-1/2'
				>
					<FormField
						control={methods.control}
						name='requestDate'
						render={({ field }) => (
							<FormItem className='flex flex-col w-full'>
								<FormLabel>Date of birth</FormLabel>
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
											disabled={(date) =>
												date > new Date() || date < new Date('1900-01-01')
											}
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
						name='message'
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

					<Button className='w-full font-semibold mt-3' type='submit'>
						Submit
					</Button>
				</form>
			</Form>
		</main>
	);
}
