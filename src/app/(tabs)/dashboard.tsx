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
import { formatBalance } from '@/utils/formatBalance';
import colors from '@/constants/colors';
import { useTimeout } from '@/shared/hooks/useTimeout';
import { useBitcoinService } from '@/shared/services/BitcoinService';


export default function TabTwoScreen() {

  const { delay: copyDelay, isExecuting: isCopying } = useTimeout();
  const { delay: refreshDelay, isExecuting: isRefreshing } = useTimeout();

  const { 
    depositAddress, 
    balance, 
    transactions, 
    isLoading,
    activateDepositAddress,
    performRefresh
  } = useBitcoinService();


  const handleActivateDepositAddress = async () => {
    await activateDepositAddress();
  };
  
  const handleRefreshBalance = async () => {
    await refreshDelay(1000);
    await performRefresh(); // Force sync when manually refreshing
  };

  const copyToClipboard = async () => {
    if (depositAddress?.address) {
      await copyDelay(1000);
      await Clipboard.setStringAsync(depositAddress.address);
    }
  };


  const renderContent = () => {
    return (
          <>
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

                <View>
                  <Button 
                    variant='icon'
                    onPress={handleRefreshBalance}
                    iconFamily='MaterialIcons' 
                    iconName='update'
                    iconClassName={isRefreshing ? 'text-primary' : ''}
                    className='px-0 py-1'
                  />
                </View>

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
                    className='px-0 py-1'
                  />
                </View>

                  <View className='flex-row justify-between border-0 border-b border-borderColor opacity-50'>
                    <FontIcon iconFamily='FontAwesome5Brands' iconName='bitcoin' size={16} color={colors.inputColor} />
                    <Text
                      className='flex-1 py-1 px-2 text-inputColor'
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {depositAddress.address}
                    </Text>
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
          </>
    )
  }
  
  return ( 
    <SafeAreaView>

      <Header
        center={<H1>Dashboard</H1>}
        right={
          <LinkButton to='/settings' variant='icon' iconFamily='Ionicons' iconName='settings-sharp' />
        }
      />
      
      {renderContent()}

    </SafeAreaView>
  );
}

