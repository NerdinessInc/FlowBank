'use client';

import { useState, useEffect } from 'react';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useQuery, useMutation } from '@tanstack/react-query';

// icons
import { HelpCircle } from 'lucide-react';

// components
import { Loading } from '@/components/Loader';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';

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

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

// store
import { appStore } from '@/store';

// utils
import { formatCurrency } from '@/utils/formatNumber';

// services
import {
	ReturnAcctDetails2,
	getNeftBranches,
	returnNameEnquiry,
	getAccessCode,
	ReturngetOTUP,
	returnPutXrefDetails,
} from '@/services/api';

export default function ThirdPartyTransfers() {
	const { userData, accessCode } = appStore();

	const [step, setStep] = useState(1);
	const [bankCategory, setBankCategory] = useState<'2-4' | '7-9' | '10-11'>(
		'2-4'
	);

	const [accessCodeChars, setAccessCodeChars] = useState<any>({});
	const [notificationMode, setNotificationMode] = useState<'1' | '2'>('1');

	const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
	const [sessionID, setSessionID] = useState(null);

	// get account details
	const { data, isLoading } = useQuery({
		queryKey: ['internal-transfers'],
		queryFn: () =>
			ReturnAcctDetails2(
				2,
				userData?.userRec,
				userData?.acctCollection?.AcctStruct
			),
		enabled: !!userData?.acctCollection?.AcctStruct,
	});

	useEffect(() => {
		getAccessCode().then((res: any) => setAccessCodeChars(res.data));
	}, []);

	// session id
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

	// get banks
	const { data: neftBranches, isLoading: isLoadingNeftBranches } = useQuery({
		queryKey: ['neft-branches'],
		queryFn: getNeftBranches,
	});

	// send otp
	const { mutate, isPending } = useMutation({
		mutationFn: (data: any) => returnPutXrefDetails(data.userRec, data.values),
		onSuccess: (res: any) => {
			console.log(res, 'hi');
		},
	});

	const thirdPartyTransfersSchema = z.object({
		sourceAccount: z.string().min(1, 'Please select your source account'),
		dailyTransferLimit: z
			.number()
			.min(1, 'Please enter your daily transfer limit'),
		beneficiary: z.string().min(1, 'Please enter your beneficiary'),
		bankCode: z.string().min(1, 'Please enter your bank code'),
		destinationAccountNumber: z
			.string()
			.min(10, 'Please enter your destination account'),
		destinationAccountName: z
			.string()
			.min(1, 'Please enter your destination account name'),
		transferAmount: z.string().min(1, 'Please enter your transfer amount'),
		transferCode: z.string().min(3, 'Please enter your transfer code'),
		token: z.string().min(1, 'Please enter your Token'),
		narration: z.string().min(1, 'Please enter your narration'),
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: 0,
		beneficiary: '',
		bankCode: '',
		destinationAccountNumber: '',
		destinationAccountName: '',
		transferAmount: '',
		transferCode: '',
		token: '',
		narration: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(thirdPartyTransfersSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger, getValues, setValue, watch } =
		methods;

	useEffect(() => {
		if (watch('sourceAccount').length >= 10) {
			setValue(
				'dailyTransferLimit',
				userData?.pLimitsObject?.LimitsObject?.find(
					(limit: any) =>
						limit.Accountnumber.toString() === watch('sourceAccount')
				)?.ThirdPartyLimit as number
			);
		}
	}, [setValue, userData, watch('sourceAccount')]);

	// name enquiry
	const { data: nameEnquiry, isLoading: isLoadingNameEnquiry } = useQuery({
		queryKey: [
			'name-enquiry',
			watch('bankCode'),
			watch('destinationAccountNumber'),
		],
		queryFn: () =>
			returnNameEnquiry(watch('destinationAccountNumber'), watch('bankCode')),
		enabled:
			!!watch('bankCode') && watch('destinationAccountNumber').length >= 10,
	});

	console.log(nameEnquiry);

	useEffect(() => {
		if (watch('sourceAccount').length >= 10) {
			setSelectedAccount(
				userData?.acctCollection?.AcctStruct?.slice(1).find(
					(account: any) =>
						account.AccountNumber.toString() === watch('sourceAccount')
				)
			);
		}
	}, [watch('sourceAccount'), userData]);

	const nextStep = async () => {
		const fields = {
			1: ['sourceAccount', 'dailyTransferLimit'],
			2: ['bankCode', 'destinationAccount'],
			3: ['transferAmount', 'transferCode'],
		}[step];

		const isValid = await trigger(fields as any);

		if (isValid) {
			setStep((prev) => Math.min(prev + 1, 4));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof thirdPartyTransfersSchema>) => {
		const newData = {
			...data,
			DestinationInstitutionCode: data.bankCode,
			DestAcct: data.destinationAccountNumber,
			BeneficiaryAccountName: data.destinationAccountName,
			SessionId: sessionID,
			Amount: data.transferAmount,
			email: selectedAccount?.Email,
			gsm: selectedAccount?.Gsm,
			Narration: data.narration,
			TransferCode: data.transferCode,
			sendOption: notificationMode,
			theTree: {
				Char1: accessCode?.Char1,
				Char2: accessCode?.Char2,
				Char3: accessCode?.Char3,
				bool: accessCode?.bool,
				retMsg: accessCode?.retMsg,
			},
		};

		console.log('Processing transfer:', newData);
	};

	const banks = neftBranches?.data?.filter((bank: any) => {
		const [start, end] = bankCategory.split('-').map(Number);

		const categoryNum = Number(bank.category);

		return categoryNum >= start && categoryNum <= end;
	});

	if (isLoading || isLoadingNeftBranches) return <Loading />;

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Third Party Transfers</h2>

			<div className='w-full text-center mb-4'>
				<h3 className='text-lg'>Step {step} of 4</h3>
				<p className='text-gray-600'>
					{step === 1 &&
						'Select your source account and enter daily transfer limit'}
					{step === 2 && 'Enter beneficiary and destination account'}
					{step === 3 && 'Enter transfer amount and code'}
					{step === 4 && 'Confirm transfer details'}
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
								name='sourceAccount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Source Account</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select Source Account' />
												</SelectTrigger>
												<SelectContent>
													{data?.data?.map((account: any, index: number) => (
														<SelectItem
															key={index}
															value={account.accountNumber}
														>
															{account.accountNumber} -{' '}
															{formatCurrency(account.bookBalance)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='dailyTransferLimit'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Daily Transfer Limit</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your daily transfer limit'
												disabled
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{step === 2 && (
						<>
							{/* select bank category */}
							<div className='flex flex-col justify-between'>
								<div className='text-sm font-semibold'>
									Select Bank Category
								</div>

								<Select
									onValueChange={(newValue) => {
										setBankCategory(newValue as any);
									}}
									value={bankCategory}
								>
									<SelectTrigger>
										<SelectValue placeholder='Select Bank Category' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='2-4'>
											Commercial Banks/Discount Houses
										</SelectItem>
										<SelectItem value='7-9'>
											Merchant/Microfinance Banks
										</SelectItem>
										<SelectItem value='10-11'>
											Mobile Money Operators/Virtual Banks
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<FormField
								control={control}
								name='bankCode'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Destination Bank</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select Destination Bank' />
												</SelectTrigger>
												<SelectContent>
													{banks?.map((bank: any, index: number) => (
														<SelectItem key={index} value={bank.bankcode}>
															{bank.bankName}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='destinationAccountNumber'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Destination Account</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your destination account'
												disabled={isLoadingNameEnquiry}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{step === 3 && (
						<>
							<FormField
								control={control}
								name='transferAmount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Transfer Amount</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your transfer amount'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name='transferCode'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex items-end gap-2'>
											<p> Transfer Code</p>

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
														Characters of your transfer code.
													</p>
												</PopoverContent>
											</Popover>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Enter your transfer code'
												disabled
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='grid grid-cols-3 gap-3'>
								<div className='col-span-1'>
									<Select
										onValueChange={(newValue) => {
											const currentValue = getValues('transferCode');
											setValue('transferCode', (currentValue || '') + newValue);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='*' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='*'>*</SelectItem>
											{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='col-span-1'>
									<Select
										onValueChange={(newValue) => {
											const currentValue = getValues('transferCode');
											setValue('transferCode', (currentValue || '') + newValue);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='*' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='*'>*</SelectItem>
											{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='col-span-1'>
									<Select
										onValueChange={(newValue) => {
											const currentValue = getValues('transferCode');
											setValue('transferCode', (currentValue || '') + newValue);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder='*' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='*'>*</SelectItem>
											{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</>
					)}

					{step === 4 && (
						<div className='text-center'>
							<p className='mb-4'>
								You are about to transfer{' '}
								{formatCurrency(getValues('transferAmount'))} from your account{' '}
								{getValues('sourceAccount')} to{' '}
								{getValues('destinationAccountNumber')},{' '}
								{getValues('destinationAccountName')}.
							</p>
							<p className='font-bold mb-4'>Do you want to proceed?</p>

							{/* select email or sms */}
							<div className='flex gap-3 justify-between items-center'>
								<div className='flex flex-col flex-1'>
									<Select
										onValueChange={(newValue) => {
											setNotificationMode(newValue as any);
										}}
										value={notificationMode}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select Notification Mode' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='1'>Email</SelectItem>
											<SelectItem value='2'>SMS</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<Button
									type='button'
									onClick={() =>
										mutate({
											userRec: userData?.userRec,
											values: {
												DestinationInstitutionCode: getValues('bankCode'),
												DestAcct: getValues('destinationAccountNumber'),
												BeneficiaryAccountName: getValues(
													'destinationAccountName'
												),
												SessionId: sessionID,
												Amount: getValues('transferAmount'),
												email: selectedAccount?.Email,
												gsm: selectedAccount?.Gsm,
												Narration: getValues('narration'),
												TransferCode: getValues('transferCode'),
												sendOption: notificationMode,
												trfType: 'InterBankNeft',
												theTree: {
													Char1: accessCode?.Char1,
													Char2: accessCode?.Char2,
													Char3: accessCode?.Char3,
													bool: accessCode?.bool,
													retMsg: accessCode?.retMsg,
												},
											},
										})
									}
									variant='outline'
									className='flex-1'
									disabled={isPending}
								>
									Send
								</Button>
							</div>

							<FormField
								control={control}
								name='token'
								render={({ field }) => (
									<FormItem className='mt-4'>
										<FormLabel>Token</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Enter your Token' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					<div className='flex justify-between'>
						{step > 1 && (
							<Button
								type='button'
								onClick={previousStep}
								variant='outline'
								className='mr-2'
							>
								Back
							</Button>
						)}

						{step < 4 && (
							<Button type='button' className='ml-auto' onClick={nextStep}>
								Next
							</Button>
						)}

						{step === 4 && (
							<>
								<Button type='button' onClick={previousStep} variant='outline'>
									Cancel
								</Button>
								<Button type='submit' className='ml-auto'>
									Confirm Transfer
								</Button>
							</>
						)}
					</div>
				</form>
			</Form>
		</main>
	);
}
