export const formatBalance = (satoshis: number): string => {
  if (satoshis === 0) return '0.00000000 BTC';
  
  const btc = satoshis / 100000000;
  return `${btc.toFixed(8)} BTC`;
};