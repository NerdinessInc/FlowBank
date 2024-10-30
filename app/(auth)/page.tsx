'use client';

import { useState, useEffect } from 'react';

// hooks
import { useToast } from '@/hooks/use-toast';

// import { useRouter } from 'next/navigation';

// icons
import { HelpCircle } from 'lucide-react';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useMutation } from '@tanstack/react-query';

// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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

// store
import { appStore } from '@/store';

// services
import { authUser, getAccessCode } from '@/services/api';

export const description =
	"A simple login form with email and password. The submit button says 'Login'.";

const LoginForm = () => {
	// const router = useRouter();
	const { login } = appStore();

	const { toast } = useToast();

	const [accessCodeChars, setAccessCodeChars] = useState<any>({});
	const [sessionID, setSessionID] = useState(null);

	const loginSchema = z.object({
		accessCode: z.string().min(3, 'Please enter your access code'),
		password: z.string().min(1, 'Please enter your password'),
		username: z.string().min(1, 'Please enter your username'),
	});

	const defaultValues = {
		accessCode: '',
		password: '',
		username: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(loginSchema),
	});

	useEffect(() => {
		getAccessCode().then((res: any) => setAccessCodeChars(res.data));
	}, []);

	useEffect(() => {
		async function fetchSessionID() {
			const res = await fetch('/api/getSessionId');

			if (res.ok) {
				const data = await res.json();
				setSessionID(data.sessionID);
			} else {
				console.error('Failed to fetch session ID');
			}
		}

		fetchSessionID();
	}, []);

	const { handleSubmit } = methods;

	const authUserMutation = useMutation({
		mutationFn: authUser,
		onSuccess: (res: any) => {
			console.log('Login Response');
			console.log(res);
			// wait(30000);
			if (!res.success) {
				toast({
					title: res.errorMessage,
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Login Successful',
				});

				login(res);
			}
		},
	});

	const onSubmit = async (data: z.infer<typeof loginSchema>) => {
		await authUserMutation.mutateAsync({
			...data,
			access: accessCodeChars,
			sid: sessionID,
		});
	};

	return (
		<main className='w-full h-full flex items-center justify-center bg-background'>
			<Card className='w-full max-w-sm py-6'>
				<CardContent className='grid gap-4'>
					<Form {...methods}>
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
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
									</FormItem>
								)}
							/>

							<FormField
								control={methods.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your password'
												type='password'
												required
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={methods.control}
								name='accessCode'
								render={({ field }) => (
									<FormItem>
										<div className='flex items-center space-x-2'>
											<div className='flex-grow'>
												<FormLabel>Access Code</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='Enter your access code'
														required
													/>
												</FormControl>
											</div>

											<Popover>
												<PopoverTrigger asChild>
													<button type='button' className='mt-6'>
														<HelpCircle className='h-5 w-5 text-gray-500' />
													</button>
												</PopoverTrigger>

												<PopoverContent
													side='right'
													className='w-[200px] text-sm'
												>
													<p>
														Enter the{' '}
														<span className='font-bold'>
															{accessCodeChars.Char1}
														</span>
														,
														<span className='font-bold'>
															{' '}
															{accessCodeChars.Char2}
														</span>
														, and
														<span className='font-bold'>
															{' '}
															{accessCodeChars.Char3}
														</span>{' '}
														Characters of your access code.
													</p>
												</PopoverContent>
											</Popover>
										</div>

										<FormMessage />
									</FormItem>
								)}
							/>

							<Button className='w-full font-semibold mt-3' type='submit'>
								{authUserMutation.isPending ? '...' : 'Login'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</main>
	);
};

export default LoginForm;
function wait(arg0: number) {
	throw new Error('Function not implemented.');
}
