import { useState, useEffect } from 'react';
import { Pressable, View, Image, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Images } from '@/shared/config/Assets';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { LinkButton } from '@/shared/ui/link-button';
import { H1, H2, H3, Paragraph } from '@/shared/ui/typography';
import { router } from 'expo-router';
import { Button } from '@/shared/ui';
import { TextInput } from 'react-native';
import { Header } from '@/shared/ui/header';
import { IconWrapper } from '@/shared/ui/icon-wrapper';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { useUnauthGuard } from '@/shared/hooks/useAuthGuard';
import { useAuthStore } from '@/shared/store/auth.store';
import { useBitcoin } from '@/shared/hooks/useBitcoin';
import { formatBalance } from '@/utils/formatBalance';
import colors from '@/constants/colors';


export default function TabTwoScreen() {
  useUnauthGuard();

  const [isCopying, setIsCopying] = useState(false);

  const { 
    depositAddress, 
    balance, 
    transactions, 
    isLoading, 
    error, 
    getDepositAddress,
    activateDepositAddress,
  } = useBitcoin();

  // Auto-fetch address on component mount (only if not in store)
  useEffect(() => {
    if (!depositAddress) {
      getDepositAddress();
    }
  }, [depositAddress]);

  const handleActivateDepositAddress = async () => {
    await activateDepositAddress();
  };

  const copyToClipboard = async () => {
    if (depositAddress?.address) {
      setIsCopying(true);
      await Clipboard.setStringAsync(depositAddress.address);
      
      setTimeout(() => setIsCopying(false), 1000);
    }
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
        <View className='mb-4'>
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

      {!depositAddress && !isLoading && (
        <Button 
          variant='active' 
          label='Get Deposit Address' 
          onPress={handleActivateDepositAddress}
          loading={isLoading}
          iconFamily='FontAwesome5Brands' 
          iconName='bitcoin' 
        />
      )}

      {depositAddress && (
        <View className='bg-bgWrapper rounded-lg p-4'>

          <View className='flex-row justify-between items-center mb-2'>
            <H3>Your Bitcoin Address</H3>
            <Button 
              variant='icon'
              onPress={copyToClipboard}
              iconFamily='Ionicons' 
              iconName='copy-outline'
              iconClassName={isCopying ? 'text-primary' : ''}
              className='px-1 py-1'
            />
          </View>

            <View className='flex-row justify-between border-0 border-b border-borderColor opacity-50'>
              <FontIcon iconFamily='FontAwesome5Brands' iconName='bitcoin' size={16} color={colors.inputColor} />
              <TextInput
                value={depositAddress.address}
                placeholder='Deposit Address'
                placeholderTextColor={colors.inputPlaceholderColor}
                className='flex-1 py-1 px-2 text-inputColor'
                editable={false}
              />
            </View>

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

