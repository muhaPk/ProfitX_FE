import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { Header } from '@/shared/ui/header';
import { H1, H2, H3, Paragraph } from '@/shared/ui/typography';
import { LinkButton } from '@/shared/ui/link-button';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { useBitcoin } from '@/shared/hooks/useBitcoin';
import { BitcoinTransaction } from '@/shared/types/bitcoin';

export default function TransactionsScreen() {
  const { transactions, isLoading, getTransactions, depositAddress } = useBitcoin();
  const [filteredTransactions, setFilteredTransactions] = useState<BitcoinTransaction[]>([]);


  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const formatAmount = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8) + ' BTC';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'check-circle';
      case 'pending':
        return 'schedule';
      case 'failed':
        return 'error';
      default:
        return 'help';
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <Header
        left={<LinkButton to='/(tabs)/dashboard' variant='icon' iconFamily='Ionicons' iconName='arrow-back' />}
        center={<H1>Transactions</H1>}
      />

      <ScrollView className='flex-1 px-4'>
        {isLoading ? (
          <View className='flex-1 justify-center items-center py-8'>
            <Paragraph>Loading transactions...</Paragraph>
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View className='flex-1 justify-center items-center py-8'>
            <FontIcon iconFamily='MaterialIcons' iconName='history' size={48} className='text-gray-400 mb-4' />
            <H3 className='text-gray-600 mb-2'>No Transactions Yet</H3>
            <Paragraph className='text-gray-500 text-center'>
              Your Bitcoin transactions will appear here once you receive funds.
            </Paragraph>
          </View>
        ) : (
          <View className='py-4'>
            {filteredTransactions.map((transaction) => (
              <View key={transaction.id} className='bg-bgWrapper rounded-lg p-4 mb-3'>
                <View className='flex-row justify-between items-start mb-2'>
                  <View className='flex-1'>
                    <View className='flex-row items-center mb-1'>
                      <FontIcon 
                        iconFamily='MaterialIcons' 
                        iconName={getStatusIcon(transaction.status)} 
                        className={`mr-2 ${getStatusColor(transaction.status)}`}
                      />
                      <H3 className={transaction.type === 'received' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'received' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </H3>
                    </View>
                    <Paragraph className='text-gray-600 text-xs'>
                      {formatDate(transaction.timestamp)}
                    </Paragraph>
                  </View>
                  <View className='items-end'>
                    <Paragraph className={`text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.toUpperCase()}
                    </Paragraph>
                    {transaction.confirmations > 0 && (
                      <Paragraph className='text-xs text-gray-500'>
                        {transaction.confirmations} confirmations
                      </Paragraph>
                    )}
                  </View>
                </View>
                
                <View className='mt-2 pt-2 border-t border-gray-200'>
                  <Paragraph className='text-xs text-gray-500 font-mono'>
                    {transaction.txHash.substring(0, 20)}...{transaction.txHash.substring(transaction.txHash.length - 20)}
                  </Paragraph>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
