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

export default function Profile() {
	const changePasswordSchema = z.object({
		username: z.string().min(1, 'Please enter your username'),
		oldPassword: z.string().min(1, 'Please enter your old password'),
		newPassword: z.string().min(1, 'Please enter your new password'),
		confirmPassword: z.string().min(1, 'Please confirm your new password'),
	});

	const defaultValues = {
		username: '',
		fullName: '',
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(changePasswordSchema),
	});

	const { handleSubmit } = methods;

	const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='font-semibold text-2xl'>Change User&apos;s Password</h2>

			<Form {...methods}>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-3 w-[90%] md:w-1/2'>
					<FormField
						control={methods.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your username'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='fullName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your full name'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='oldPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Old Password</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your old password'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='newPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your new password'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Confirm your new password'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full font-semibold mt-3' type='submit'>
						Change Password
					</Button>
				</form>
			</Form>
		</main>
	);
}
