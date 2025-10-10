import { useState, useEffect } from 'react';
import { Pressable, View, Image, Alert, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { LinkButton } from '@/shared/ui/link-button';
import { H1, H2, H3, Paragraph } from '@/shared/ui/typography';
import { router } from 'expo-router';
import { Button } from '@/shared/ui';
import { Header } from '@/shared/ui/header';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { useBitcoinService } from '@/shared/services/BitcoinService';
import { formatBalance } from '@/utils/formatBalance';
import { useForm } from 'react-hook-form';
import CustomInput from '@/shared/ui/Input/input';


export default function TabTwoScreen() {

  const { 
    balance, 
    transactions, 
  } = useBitcoinService();

  const { control, handleSubmit, setError, reset, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        withdraw: '',
      },
    }
  );
  
  return ( 
    <SafeAreaView className=''>

      <Header
        center={<H1>Withdraw</H1>}
        right={
          <LinkButton to='/settings' variant='icon' iconFamily='Ionicons' iconName='settings-sharp' />
        }
      />

      {balance && (
        <View className='mb-4 flex-row justify-between items-center'>

          <View>
            <H3>Current Balance</H3>
            <Paragraph>
              {formatBalance(balance.balance)} 
              {balance.unconfirmedBalance > 0 && (
                <Paragraph className='text-orange-600'>
                  (+{formatBalance(balance.unconfirmedBalance)} pending)
                </Paragraph>
              )}
            </Paragraph>
            {transactions.some(tx => tx.status === 'pending' || tx.confirmations < 6) && (
              <Paragraph className='text-orange-600 text-sm'>
                {transactions.filter(tx => tx.status === 'pending' || tx.confirmations < 6).length} transaction(s) pending confirmation
              </Paragraph>
            )}
          </View>

        </View>
      )}


      <CustomInput 
        iconName='bitcoin'
        iconFamily='Fontisto'
        control={control} 
        errors={errors} 
        placeholder={'Withdrawal address'} 
        name="withdraw"
        className='mt-8'
        rules={{
            validate: {
              required: (value: any) => !!value?.trim() || 'Withdrawal address is required',
              minLength: (value: any) =>
                value?.trim().length > 3 || 'Withdrawal address must be at least 4 characters',
            },
          }}
      />

      <CustomInput 
        iconName='check'
        iconFamily='Feather'
        control={control} 
        errors={errors} 
        placeholder={'Amount'} 
        name="Amount"
        className='mb-6'
        rules={{
            validate: {
              required: (value: any) => !!value?.trim() || 'Amount is required',
            },
          }}
      />

      <Button 
        variant='active' 
        label='Withdraw' 
        onPress={() => {}} 
        className='mb-4'
      />


      <Pressable 
        className='flex-row justify-between items-center mt-4 bg-bgWrapper rounded-lg px-2 pt-1 pb-2'
        onPress={() => router.push('/transactions')}
      >
        <View>
          <H3>Withdrawals</H3>
          <Paragraph>
            {transactions.length > 0 
              ? `${transactions.length} transactions` 
              : 'No transactions yet'
            }
          </Paragraph>
        </View>
        <FontIcon iconFamily='MaterialIcons' iconName='keyboard-arrow-right' />
      </Pressable>



    </SafeAreaView>
  );
}

