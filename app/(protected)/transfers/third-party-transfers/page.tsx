'use client';

import { useEffect, useState } from 'react';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// query
import { useQuery } from '@tanstack/react-query';

// components
import { Loading } from '@/components/Loader';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

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

// store
import { appStore } from '@/store';

// utils
import { formatCurrency } from '@/utils/formatNumber';

// services
import { returnGetBenefInfo } from '@/services/api';
import { ReturnAcctDetails2 } from '@/services/apiAuth';

export default function InternalTransfers() {
	const { userData } = appStore();

	const [step, setStep] = useState(1);
	const [selectBeneficiary, setSelectBeneficiary] = useState<boolean>(false);

	const { data, isLoading } = useQuery({
		queryKey: ['my-accounts'],
		queryFn: () =>
			ReturnAcctDetails2(
				2,
				userData?.userRec,
				userData?.acctCollection?.AcctStruct
			),
		enabled: !!userData?.acctCollection?.AcctStruct,
	});

	const accounts = userData?.acctCollection || []
	console.log(userData)

	const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useQuery({
		queryKey: ['beneficiaries'],
		queryFn: () => returnGetBenefInfo(userData?.userRec),
		enabled: !!userData,
	});

	const internalTransferSchema = z.object({
		sourceAccount: z.string().min(1, 'Please select your source account'),
		dailyTransferLimit: z
			.number()
			.min(1, 'Please enter your daily transfer limit'),
		destinationAccount: z
			.string()
			.regex(/^\d+$/, 'Account number must contain only numeric values')
			.min(10, 'Account number must be at least 10 digits long'),
		amount: z.coerce.number().min(1, 'Please enter your amount'),
		token: z.coerce.number().min(1, 'Please enter your Token'),
		saveBeneficiary: z.boolean().optional(),
	});

	const defaultValues = {
		sourceAccount: '',
		dailyTransferLimit: 0,
		destinationAccount: '',
		amount: 0,
		token: 0,
		saveBeneficiary: false,
	};

	const methods = useForm({
		defaultValues,
		resolver: zodResolver(internalTransferSchema),
		mode: 'onChange',
	});

	const { handleSubmit, control, trigger, getValues, setValue, watch } =
		methods;

	// get daily transfer limit with source account
	useEffect(() => {
    if (watch("sourceAccount")?.length >= 10) {
      const limit = userData?.pLimitsObject?.find(
        (limit: any) => limit.accountnumber === watch("sourceAccount")
      )?.thirdPartyLimit;

      setValue("dailyTransferLimit", Number(limit));
    }
  }, [setValue, userData, watch("sourceAccount")]);


	const nextStep = async () => {
		const fields = {
			1: ['sourceAccount'],
			2: ['dailyTransferLimit', 'destinationAccount'],
			3: ['amount'],
		}[step];

		const isValid = await trigger(fields as any);

		if (isValid) {
			setStep((prev) => Math.min(prev + 1, 4));
		}
	};

	const previousStep = () => {
		setStep((prev) => Math.max(prev - 1, 1));
	};

	const onSubmit = async (data: z.infer<typeof internalTransferSchema>) => {
		console.log(data);
	};

	const parsedBeneficiaries = beneficiaries?.data
		?.slice(1)
		.map((account: string) => {
			const [accountNumber, accountName, currency] = account.split('|');

			return {
				accountNumber,
				accountName,
				currency,
			};
		});

	if (isLoading || isLoadingBeneficiaries) return <Loading />;

	return (
    <main className="h-full w-full flex flex-col gap-6 items-center md:justify-center">
      <h2 className="text-2xl font-bold">Third Party Transfers</h2>

      <div className="w-full text-center mb-4">
        <h3 className="text-lg">Step {step} of 4</h3>
        <p className="text-gray-600">
          {step === 1 && "Select your source account"}
          {step === 2 && "Enter destination account"}
          {step === 3 && "Enter transfer amount"}
          {step === 4 && "Confirm transfer details"}
        </p>
      </div>

      <Form {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[90%] md:w-2/3 grid grid-cols-1 gap-4 border border-border rounded-md p-6"
        >
          {step === 1 && (
            <>
              <FormField
                control={control}
                name="sourceAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Account</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Source Account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account: any, index: number) => (
                            <SelectItem
                              key={index}
                              value={account.accountNumber}
                            >
                              {account.accountNumber} -{" "}
                              {formatCurrency(
                                Number(account.availBalance) || 0
                              )}
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
                name="dailyTransferLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Transfer Limit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your daily transfer limit"
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
              <FormField
                control={control}
                name="destinationAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      Destination Account
                      <div>
                        Select Beneficiary?{" "}
                        <Checkbox
                          checked={selectBeneficiary}
                          onCheckedChange={() =>
                            setSelectBeneficiary(!selectBeneficiary)
                          }
                          className="ml-auto"
                        >
                          Select Beneficiary?{" "}
                        </Checkbox>
                      </div>
                    </FormLabel>

                    <FormControl>
                      <>
                        {!selectBeneficiary && (
                          <Input
                            {...field}
                            placeholder="Enter your destination account"
                          />
                        )}

                        {selectBeneficiary && (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination account" />
                            </SelectTrigger>
                            <SelectContent>
                              {parsedBeneficiaries?.map(
                                (account: any, index: number) => (
                                  <SelectItem
                                    key={index}
                                    value={account.accountNumber}
                                  >
                                    {account.accountNumber} -{" "}
                                    {account.accountName} ({account.currency})
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!selectBeneficiary && (
                <Input disabled placeholder="Account Name" />
              )}

              <FormField
                control={control}
                name="saveBeneficiary"
                render={({ field }) => (
                  <FormItem className="flex items-end gap-2">
                    <FormLabel>Save Beneficiary?</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      >
                        Save Beneficiary?
                      </Checkbox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 3 && (
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your amount" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === 4 && (
            <div className="text-center">
              <p className="mb-4">
                You are about to transfer {formatCurrency(getValues("amount"))}{" "}
                from your account {getValues("sourceAccount")} to{" "}
                {getValues("destinationAccount")}.
              </p>

              <p className="font-bold mb-4">Do you want to proceed?</p>

              <FormField
                control={control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your Token" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                onClick={previousStep}
                variant="outline"
                className="mr-2"
              >
                Back
              </Button>
            )}

            {step < 4 && (
              <Button type="button" className="ml-auto" onClick={nextStep}>
                Next
              </Button>
            )}

            {step === 4 && (
              <>
                <Button type="button" onClick={previousStep} variant="outline">
                  Cancel
                </Button>

                <Button type="submit" className="ml-auto">
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
