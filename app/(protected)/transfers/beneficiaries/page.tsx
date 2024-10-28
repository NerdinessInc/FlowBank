'use client';

import { useToast } from '@/hooks/use-toast';

// form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// components
import { Loading } from '@/components/Loader';

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

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

// store
import { appStore } from '@/store';

// services
import { returnGetBenefInfo, returnSaveBenefInfo } from '@/services/api';

export default function Beneficiaries() {
	const { userData } = appStore();

	const queryClient = useQueryClient();

	const { toast } = useToast();

	const { data, isLoading } = useQuery({
		queryKey: ['beneficiaries'],
		queryFn: () => returnGetBenefInfo(userData?.userRec),
		enabled: !!userData,
	});

	const beneficiariesSchema = z.object({
		accountNumber: z.string().min(1, 'Please enter your beneficiary account'),
		accountName: z.string().min(1, 'Please enter your beneficiary name'),
		currency: z
			.string()
			.min(1, 'Please enter your beneficiary account currency'),
	});

	const defaultValues = {
		accountNumber: '',
		accountName: '',
		currency: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(beneficiariesSchema),
	});

	const { handleSubmit } = methods;

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: { user: any; data: any }) =>
			returnSaveBenefInfo(payload.user, payload.data),
		mutationKey: ['add-beneficiary'],
		onSuccess: (res: any) => {
			if (res.retVal) {
				toast({
					title: 'Account added successfully!',
				});
			} else {
				toast({
					title: res.success,
					variant: 'destructive',
				});
			}

			queryClient.invalidateQueries({
				queryKey: ['beneficiaries'],
			});
		},
	});

	const onSubmit = async (data: z.infer<typeof beneficiariesSchema>) => {
		mutate({
			user: userData?.userRec,
			data: data,
		});
	};

	const parsedBeneficiaries = data?.data?.slice(1).map((account: string) => {
		const [accountNumber, accountName, currency] = account.split('|');

		return {
			accountNumber,
			accountName,
			currency,
		};
	});

	if (isLoading) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>
				Beneficiary Maintenance for Third Party Transfers
			</h2>

			<div className='grid grid-cols-2 w-full gap-8'>
				<div className='col-span-2 md:col-span-1'>
					<h2 className='font-semibold mb-2 text-xl'>Beneficiary Accounts</h2>

					<div className='w-full'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Account Number</TableHead>
									<TableHead>Account Title</TableHead>
									<TableHead>Currency</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{parsedBeneficiaries?.map((account: any, index: number) => (
									<TableRow key={index} className='cursor-pointer'>
										<TableCell>{account.accountNumber}</TableCell>
										<TableCell>{account.accountName}</TableCell>
										<TableCell>{account.currency}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>

				<div className='col-span-2 md:col-span-1 w-full'>
					<h2 className='font-semibold mb-2 text-xl'>Add New Beneficiary</h2>

					<Form {...methods}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-3  border border-border rounded-md p-6'
						>
							<FormField
								control={methods.control}
								name='accountNumber'
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
								name='accountName'
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

							<FormField
								control={methods.control}
								name='currency'
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

							<Button className='w-full font-semibold mt-3' type='submit'>
								{isPending ? '...' : 'Add Account'}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</main>
	);
}
