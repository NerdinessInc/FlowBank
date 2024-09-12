'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

export const description =
	"A simple login form with email and password. The submit button says 'Login'.";

const LoginForm = () => {
	const router = useRouter();

	return (
		<main className='w-full h-full flex items-center justify-center bg-background'>
			<Card className='w-full max-w-sm py-6'>
				<CardContent className='grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='username'>Username</Label>
						<Input
							id='username'
							type='text'
							placeholder='Enter your username'
							required
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='password'>Password</Label>
						<Input id='password' type='password' required />
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='access'>Access Code</Label>

						<Popover>
							<PopoverTrigger asChild>
								<Input id='access' type='text' required />
							</PopoverTrigger>

							<PopoverContent side='right' className='w-[200px] text-sm'>
								<p>
									Enter the <span className='font-bold'>Third</span>,
									<span className='font-bold'> Second</span>, and
									<span className='font-bold'> Fourth</span> Characters of your
									access code.
								</p>
							</PopoverContent>
						</Popover>
					</div>
				</CardContent>

				<CardFooter>
					<Button
						className='w-full font-semibold'
						onClick={() => router.push('/dashboard')}
					>
						Login
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
};

export default LoginForm;
