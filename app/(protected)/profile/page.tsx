'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';

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
import { Separator } from '@/components/ui/separator';

export default function Profile() {
	const [step, setStep] = useState(1);

	const changePasswordSchema = z.object({
		username: z.string().min(1, 'Please enter your username'),
		fullName: z.string().min(1, 'Please enter your full name'),
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
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger } = methods;

	const nextStep = async () => {
		const fields = {
			1: ['username', 'fullName'],
			2: ['oldPassword'],
			3: ['newPassword', 'confirmPassword'],
		}[step];

		const isValid = await trigger(fields as any);

		if (isValid) {
			setStep((prev) => Math.min(prev + 1, 3));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='font-semibold text-2xl'>Change User&apos;s Password</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 3</h3>
				<p className='text-gray-600'>
					{step === 1 && 'Enter your username and full name'}
					{step === 2 && 'Enter your old password'}
					{step === 3 && 'Enter and confirm your new password'}
				</p>
			</div>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-[90%] md:w-2/3 grid grid-cols-1 gap-4 border border-border rounded-md p-6'
				>
					{step === 1 && (
						<>
							<FormField
								control={control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter your username' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='fullName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter your full name' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{step === 2 && (
						<FormField
							control={control}
							name='oldPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Old Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='password'
											placeholder='Enter your old password'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{step === 3 && (
						<>
							<FormField
								control={control}
								name='newPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='password'
												placeholder='Enter your new password'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='password'
												placeholder='Confirm your new password'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					<Separator className='my-4' />

					<div className='flex justify-between'>
						{step > 1 && (
							<Button type='button' onClick={previousStep} variant='outline'>
								Back
							</Button>
						)}

						{step < 3 && (
							<Button type='button' className='ml-auto' onClick={nextStep}>
								Next
							</Button>
						)}

						{step === 3 && (
							<Button type='submit' className='ml-auto'>
								Change Password
							</Button>
						)}
					</div>
				</form>
			</Form>
		</main>
	);
}
