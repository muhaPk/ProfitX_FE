import { useState, useEffect } from 'react';
import { Pressable, View, Image, Alert, Clipboard } from 'react-native';
import { Images } from '@/shared/config/Assets';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { LinkButton } from '@/shared/ui/link-button';
import { H1, H2, H3, Paragraph } from '@/shared/ui/typography';
import { router } from 'expo-router';
import { Button } from '@/shared/ui';
import CustomInput from '@/shared/ui/Input/input';
import { useForm } from 'react-hook-form';
import { Header } from '@/shared/ui/header';
import { IconWrapper } from '@/shared/ui/icon-wrapper';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { useUnauthGuard } from '@/shared/hooks/useAuthGuard';
import { useAuthStore } from '@/shared/store/auth.store';
import { useBitcoin } from '@/shared/hooks/useBitcoin';


export default function TabTwoScreen() {
  // Redirect unauthenticated users to login
  useUnauthGuard();

  const { user } = useAuthStore();
  const { 
    address, 
    balance, 
    transactions, 
    isLoading, 
    error, 
    getDepositAddress, 
    refreshData 
  } = useBitcoin();

  const { control, reset } = useForm(
    {
      defaultValues: {
        depositAddress: '',
      },
    }
  );

  // Update form when address changes
  useEffect(() => {
    console.log('📍 Dashboard address changed:', address);
    if (address) {
      reset({ depositAddress: address.address });
    }
  }, [address, reset]);

  const handleGetDepositAddress = async () => {
    await getDepositAddress();
  };

  const copyToClipboard = async () => {
    if (address?.address) {
      Clipboard.setString(address.address);
      Alert.alert('Copied!', 'Bitcoin address copied to clipboard');
    }
  };

  const formatBalance = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8) + ' BTC';
  };
  
  return ( 
    <SafeAreaView className=''>

      <Header
        center={<H1>Dashboard</H1>}
        right={
          <LinkButton to='/settings' variant='icon' iconFamily='Ionicons' iconName='settings-sharp' />
        }
      />

      {balance && (
        <View className='mt-4 p-3'>
          <H3>Current Balance</H3>
          <Paragraph>
            {formatBalance(balance.balance)} 
            {balance.unconfirmedBalance > 0 && (
              <Paragraph className='text-orange-600'>
                (+{formatBalance(balance.unconfirmedBalance)} pending)
              </Paragraph>
            )}
          </Paragraph>
        </View>
      )}

      {!address && (
        <Button 
          variant='active' 
          label='Get the deposit address' 
          onPress={handleGetDepositAddress}
          loading={isLoading}
          iconFamily='FontAwesome5Brands' 
          iconName='bitcoin' 
        />
      )}

      {address && (
        <View className='bg-bgWrapper rounded-lg p-4'>

          <View className='flex-row justify-between items-center mb-2'>
            <H3>Your Bitcoin Address</H3>
            <Button 
              variant='icon'
              onPress={copyToClipboard}
              iconFamily='Ionicons' 
              iconName='copy-outline'
              className='px-3 py-1'
            />
          </View>

          <CustomInput 
            control={control}
            iconFamily='FontAwesome5Brands'
            iconName='bitcoin'
            placeholder='Deposit Address'
            name="depositAddress"
            // isDisabled={true}
          />

        </View>
      )}

      {error && (
        <View className='mt-4 p-3 bg-red-100 rounded-lg'>
          <Paragraph className='text-red-700'>{error}</Paragraph>
        </View>
      )}


      <Pressable 
        className='flex-row justify-between items-center mt-4 bg-bgWrapper rounded-lg px-2 pt-1 pb-2'
        onPress={() => router.push('/transactions')}
      >
        <View>
          <H3>Deposits</H3>
          <Paragraph>
            {transactions.length > 0 
              ? `${transactions.length} transactions` 
              : 'No transactions yet'
            }
          </Paragraph>
        </View>
        <FontIcon iconFamily='MaterialIcons' iconName='keyboard-arrow-right' />
      </Pressable>

      <View className='flex-row justify-between items-center mt-4 bg-bgWrapper rounded-lg px-2 pt-1 pb-2'>
        <View>
          <H3>Earnings</H3>
          <Paragraph>Earnings history</Paragraph>
        </View>
        <FontIcon iconFamily='MaterialIcons' iconName='keyboard-arrow-right' />
      </View>


    </SafeAreaView>
  );
}

