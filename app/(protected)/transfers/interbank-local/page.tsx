'use client';

// forms
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function InterBankLocalTransfers() {
  // State to track current step
  const [step, setStep] = useState(1);

  // Schema for the form
  const thirdPartyTransfersSchema = z.object({
    sourceAccount: z.string().min(1, 'Please select your source account'),
    destinationBank: z.string().min(1, 'Please select your destination bank'),
    beneficiaryAccount: z.string().min(1, 'Please enter beneficiary account'),
    beneficiaryName: z.string().min(1, 'Please enter beneficiary name'),
    transferAmount: z.string().min(1, 'Please enter transfer amount'),
    transferCode: z.string().min(1, 'Please enter transfer code'),
  });

  const defaultValues = {
    sourceAccount: '',
    destinationBank: '',
    beneficiaryAccount: '',
    beneficiaryName: '',
    transferAmount: '',
    transferCode: '',
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(thirdPartyTransfersSchema),
  });

  const { handleSubmit, control, setValue, trigger } = methods;

  const onSubmit = async (data) => {
    console.log(data);
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3)); // Step should not exceed 3
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1)); // Step should not go below 1
  };

  // Watching the fields to move to the next step automatically
  const sourceAccount = useWatch({
    control,
    name: 'sourceAccount',
  });

  const destinationBank = useWatch({
    control,
    name: 'destinationBank',
  });

  const beneficiaryAccount = useWatch({
    control,
    name: 'beneficiaryAccount',
  });

  const beneficiaryName = useWatch({
    control,
    name: 'beneficiaryName',
  });

  const transferAmount = useWatch({
    control,
    name: 'transferAmount',
  });

  const transferCode = useWatch({
    control,
    name: 'transferCode',
  });

  // Automatically move to the next step if input is valid for the current step
  useEffect(() => {
    if (step === 1 && sourceAccount) {
      trigger('sourceAccount').then((valid) => {
        if (valid) nextStep();
      });
    }
    if (step === 2 && destinationBank && beneficiaryAccount && beneficiaryName) {
      trigger(['destinationBank', 'beneficiaryAccount', 'beneficiaryName']).then((valid) => {
        if (valid) nextStep();
      });
    }
    if (step === 3 && transferAmount && transferCode) {
      trigger(['transferAmount', 'transferCode']);
    }
  }, [sourceAccount, destinationBank, beneficiaryAccount, beneficiaryName, transferAmount, transferCode, step, trigger]);

  return (
    <main className='h-full w-full flex flex-col gap-6 items-center md:justify-center'>
      <h2 className='text-2xl font-bold'>Third Party Transfers (Other Banks)</h2>

      {/* Header showing current step */}
      <div className='w-full text-center mb-4'>
        <h3 className='text-lg'>
          Step {step} of 3
        </h3>
        <p className='text-gray-600'>
          {step === 1 && 'Select your source account'}
          {step === 2 && 'Select destination bank and beneficiary details'}
          {step === 3 && 'Enter transfer amount and details'}
        </p>
      </div>

      <Form {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-[90%] md:w-2/3 grid grid-cols-1 gap-4 border border-border rounded-md p-6'
        >
          {/* Step 1: Select Source Account */}
          {step === 1 && (
            <>
              <FormField
                control={methods.control}
                name='sourceAccount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Account</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue('sourceAccount', value); // Ensure value is set in form state
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select Source Account' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='account1'>Account 1</SelectItem>
                          <SelectItem value='account2'>Account 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 2: Select Destination Bank and Beneficiary */}
          {step === 2 && (
            <>
              <FormField
                control={methods.control}
                name='destinationBank'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Bank</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue('destinationBank', value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select Destination Bank' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='bank1'>Bank 1</SelectItem>
                          <SelectItem value='bank2'>Bank 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

			    <FormField
                control={methods.control}
                name='beneficiaryAccount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiary Account</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Enter Beneficiary Account'
                        required
                        onBlur={() => trigger('beneficiaryAccount')}
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
                  <FormItem>
                    <FormLabel>Beneficiary Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Enter Beneficiary Name'
                        required
                        onBlur={() => trigger('beneficiaryName')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </>
          )}

          {/* Step 3: Transfer Amount and Details */}
          {step === 3 && (
            <>
              <FormField
                control={methods.control}
                name='transferAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer Amount</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter Transfer Amount' required />
                    </FormControl>
                    <FormMessage />
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
                      <Input {...field} placeholder='Enter Transfer Code' required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Separator className='my-4' />

          {/* Navigation Buttons */}
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
                Submit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </main>
  );
}
