
/* eslint-disable unicorn/filename-case */
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

import { Button } from '@/shared/ui/button';

type Props = {
  to: string;
  params?: Record<string, any>;
  label?: string;
  isExternal?: boolean;
  [key: string]: any; // for other Button props
};

export function LinkButton({ to, params, label, isExternal, ...rest }: Props) {
  const router = useRouter();

  const isExternalUrl = (url: string): boolean => {
    return (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:')
    );
  };

  const handleExternalLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } 
    } catch (error) {
      console.log('Error opening external link:', error);
    }
  };

  const handlePress = () => {
    // Check if it's an external link (either explicitly marked or detected as URL)
    if (isExternal || isExternalUrl(to)) {
      handleExternalLink(to);
    } else {
      // Internal navigation
      if (params) {
        router.push({ pathname: to as any, params });
      } else {
        router.push(to as any);
      }
    }
  };

  return <Button label={label} onPress={handlePress} {...rest} />;
}
