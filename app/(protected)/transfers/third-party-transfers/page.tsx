'use client';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';

export default function ThirdPartyTransfers() {
	const thirdPartyTransfersSchema = z.object({
		sourceAccount: z.string().min(1, 'Please enter your source account'),
		dailyTransferLimit: z
			.string()
			.min(1, 'Please enter your daily transfer limit'),
		beneficiary: z.string().min(1, 'Please enter your beneficiary'),
		destinationAccount: z
			.string()
			.min(1, 'Please enter your destination account'),
		transferAmount: z.string().min(1, 'Please enter your transfer amount'),
		transferCode: z.string().min(1, 'Please enter your transfer code'),
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: '',
		beneficiary: '',
		destinationAccount: '',
		transferAmount: '',
		transferCode: '',
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(thirdPartyTransfersSchema),
	});

	const { handleSubmit, setValue, getValues, watch } = methods;

	const onSubmit = async (data: z.infer<typeof thirdPartyTransfersSchema>) => {
		console.log(data);
	};

	console.log(watch());

	return (
		<main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
			<h2 className='text-2xl font-bold'>Third Party Transfers</h2>

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
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='beneficiary'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Beneficiary</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your beneficiary'
										required
									/>
								</FormControl>
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
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='transferAmount'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Transfer Amount</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your transfer amount'
										required
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name='transferCode'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Transfer Code</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your transfer code'
										required
										disabled
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<div className='grid grid-cols-3 gap-3'>
						<div className='col-span-1'>
							<Label>Numbers</Label>
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
									<SelectItem value='0'>0</SelectItem>
									<SelectItem value='1'>1</SelectItem>
									<SelectItem value='2'>2</SelectItem>
									<SelectItem value='3'>3</SelectItem>
									<SelectItem value='4'>4</SelectItem>
									<SelectItem value='5'>5</SelectItem>
									<SelectItem value='6'>6</SelectItem>
									<SelectItem value='7'>7</SelectItem>
									<SelectItem value='8'>8</SelectItem>
									<SelectItem value='9'>9</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='col-span-1'>
							<Label>Big Letters</Label>
							<Select
								onValueChange={(newValue) => {
									const currentValue = getValues('transferCode');
									console.log(currentValue);

									setValue('transferCode', (currentValue || '') + newValue);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder='*' />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value='*'>*</SelectItem>
									<SelectItem value='A'>A</SelectItem>
									<SelectItem value='B'>B</SelectItem>
									<SelectItem value='C'>C</SelectItem>
									<SelectItem value='D'>D</SelectItem>
									<SelectItem value='E'>E</SelectItem>
									<SelectItem value='F'>F</SelectItem>
									<SelectItem value='G'>G</SelectItem>
									<SelectItem value='H'>H</SelectItem>
									<SelectItem value='I'>I</SelectItem>
									<SelectItem value='J'>J</SelectItem>
									<SelectItem value='K'>K</SelectItem>
									<SelectItem value='L'>L</SelectItem>
									<SelectItem value='M'>M</SelectItem>
									<SelectItem value='N'>N</SelectItem>
									<SelectItem value='O'>O</SelectItem>
									<SelectItem value='P'>P</SelectItem>
									<SelectItem value='Q'>Q</SelectItem>
									<SelectItem value='R'>R</SelectItem>
									<SelectItem value='S'>S</SelectItem>
									<SelectItem value='T'>T</SelectItem>
									<SelectItem value='U'>U</SelectItem>
									<SelectItem value='V'>V</SelectItem>
									<SelectItem value='W'>W</SelectItem>
									<SelectItem value='X'>X</SelectItem>
									<SelectItem value='Y'>Y</SelectItem>
									<SelectItem value='Z'>Z</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='col-span-1'>
							<Label>Small Letters</Label>
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
									<SelectItem value='a'>a</SelectItem>
									<SelectItem value='b'>b</SelectItem>
									<SelectItem value='c'>c</SelectItem>
									<SelectItem value='d'>d</SelectItem>
									<SelectItem value='e'>e</SelectItem>
									<SelectItem value='f'>f</SelectItem>
									<SelectItem value='g'>g</SelectItem>
									<SelectItem value='h'>h</SelectItem>
									<SelectItem value='i'>i</SelectItem>
									<SelectItem value='j'>j</SelectItem>
									<SelectItem value='k'>k</SelectItem>
									<SelectItem value='l'>l</SelectItem>
									<SelectItem value='m'>m</SelectItem>
									<SelectItem value='n'>n</SelectItem>
									<SelectItem value='o'>o</SelectItem>
									<SelectItem value='p'>p</SelectItem>
									<SelectItem value='q'>q</SelectItem>
									<SelectItem value='r'>r</SelectItem>
									<SelectItem value='s'>s</SelectItem>
									<SelectItem value='t'>t</SelectItem>
									<SelectItem value='u'>u</SelectItem>
									<SelectItem value='v'>v</SelectItem>
									<SelectItem value='w'>w</SelectItem>
									<SelectItem value='x'>x</SelectItem>
									<SelectItem value='y'>y</SelectItem>
									<SelectItem value='z'>z</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<Button className='w-full font-semibold mt-3' type='submit'>
						Submit
					</Button>
				</form>
			</Form>
		</main>
	);
}
