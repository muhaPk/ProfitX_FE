import { Pressable, View, Image } from 'react-native';
import { Images } from '@/shared/config/Assets';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { LinkButton } from '@/shared/ui/link-button';
import { H1, H2, H3, Paragraph } from '@/shared/ui/typography';
import { router } from 'expo-router';
import { Header } from '@/shared/ui/header';
import { IconWrapper } from '@/shared/ui/icon-wrapper';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { useForm } from 'react-hook-form';
import CustomInput from '@/shared/ui/Input/input';
import { Button } from '@/shared/ui';
import { useAuth } from '@/shared/hooks/useAuthGuard';
import { useAuthStore } from '@/shared/store/auth.store';
import WithKeyboard from '@/shared/ui/WithKeyboard';

export default function Settings() {

  const { user, clearAuth } = useAuthStore();

  const logout = () => {
    clearAuth();
    router.replace('/');
  };

  const { control, handleSubmit, setError, reset, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        name: user?.name,
        email: user?.email,
        withdraw: '',
      },
    }
  );


  const renderContent = () => {
    return (
          <>
            <CustomInput 
              iconName='user'
              iconFamily='AntDesign'
              control={control} 
              errors={errors} 
              placeholder={'Username'} 
              name="name"
              rules={{
                  validate: {
                    required: (value: any) => !!value?.trim() || 'Username is required',
                    minLength: (value: any) =>
                      value?.trim().length > 3 || 'Username must be at least 4 characters',
                  },
                }}
            />

            <CustomInput 
              iconName='email'
              iconFamily='Entypo'
              control={control} 
              errors={errors} 
              placeholder={'Email'} 
              name="email"
              rules={{
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format',
                  },
                  validate: {
                    required: (value: any) => !!value?.trim() || 'Email is required',
                    minLength: (value: any) =>
                      value?.trim().length > 5 || 'Email must be at least 6 characters',
                  },
                }}
            />

            <CustomInput 
              iconName='user'
              iconFamily='AntDesign'
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

            <Button 
              variant='active' 
              label='Logout' 
              onPress={logout} 
              iconFamily='Ionicons' 
              iconName='log-out-outline' 
              className='mt-auto mb-4'
            />
          </>
    )
  }


  return (
    <SafeAreaView>

      <Header
        center={<H1>Settings</H1>}
        left={(
          <Pressable onPress={() => router.back()}>
            <IconWrapper>
              <FontIcon iconFamily='Ionicons' iconName='arrow-back' size={24} color='black' />
            </IconWrapper>
          </Pressable>
        )}
        // right={<LinkButton to="/log-in" label="Log in" />}
      />


      <WithKeyboard>
        {renderContent()}
      </WithKeyboard>

    </SafeAreaView>
  );
}