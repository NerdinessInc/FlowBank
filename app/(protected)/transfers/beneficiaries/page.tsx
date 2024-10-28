'use client';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useQuery, useMutation } from '@tanstack/react-query';

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
import { Input } from '@/components/ui/input';

// store
import { appStore } from '@/store';

// services
import { getBeneficiaryInfo } from '@/services/api';

export default function Beneficiaries() {
	const { userData } = appStore();

	console.log(userData);

	const { data } = useQuery({
		queryKey: ['beneficiaryInfo'],
		queryFn: async () => {
			const res = await getBeneficiaryInfo({
				username: userData?.userRec?.pUserName,
				accountNumber: '',
				customerId: userData?.userRec?.PXfChar2,
				accountNameNew: '',
				accountCurrency: '',
			});

			return res;
		},
		enabled: !!userData,
	});

	console.log(data);

	const beneficiariesSchema = z.object({
		beneficiaryAccount: z
			.string()
			.min(1, 'Please enter your beneficiary account'),
		beneficiaryAccountCurrency: z
			.string()
			.min(1, 'Please enter your beneficiary account currency'),
		beneficiaryName: z.string().min(1, 'Please enter your beneficiary name'),
	});

	const defaultValues = {
		beneficiaryAccount: '',
		beneficiaryAccountCurrency: '',
		beneficiaryName: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(beneficiariesSchema),
	});

	const { handleSubmit } = methods;

	const { mutate, isPending } = useMutation({
		mutationFn: getBeneficiaryInfo,
		onSuccess: (res: any) => {
			console.log(res);
		},
	});

	const onSubmit = async (data: z.infer<typeof beneficiariesSchema>) => {
		console.log(data);
	};

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>
				Beneficiary Maintenance for Third Party Transfers
			</h2>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-3 w-[90%] md:w-1/2 border border-border rounded-md p-6'
				>
					<FormField
						control={methods.control}
						name='beneficiaryAccount'
						render={({ field }) => (
							<FormItem className='col-span-2 md:col-span-1'>
								<FormLabel>Beneficiary Account</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your beneficiary account'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='beneficiaryAccountCurrency'
						render={({ field }) => (
							<FormItem className='col-span-2 md:col-span-1'>
								<FormLabel>Beneficiary Account Currency</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your beneficiary account currency'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='beneficiaryName'
						render={({ field }) => (
							<FormItem className='col-span-2 md:col-span-1'>
								<FormLabel>Beneficiary Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your beneficiary name'
										required
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full font-semibold mt-3' type='submit'>
						Add Account
					</Button>
				</form>
			</Form>
		</main>
	);
}
