import { Pressable, View, Image } from 'react-native';
import CustomInput from '@/shared/ui/Input/input';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { LinkButton } from '@/shared/ui/link-button';
import { H1, H2, Paragraph } from '@/shared/ui/typography';
import { Header } from '@/shared/ui/header';
import { IconWrapper } from '@/shared/ui/icon-wrapper';
import { router } from 'expo-router';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { Images } from '@/shared/config/Assets';
import { useAxios } from '@/shared/hooks/useAxios';
import { API_LOGIN } from '@/shared/config/endpoints';
import { LoginUserDto, LoginResponse } from '@/shared/types/auth';
import { useAuthStore } from '@/shared/store/auth.store';
import { useGenericSet } from '@/shared/hooks/useGenericSet';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';



export default function LogIn() {
  useAuthGuard();

  const [isLoading, setIsLoading] = useState(false);
  const { set } = useAxios();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { uploadData, setError: setApiError } = useGenericSet();

  const { control, handleSubmit, setError, reset, formState: { errors } } = useForm<LoginUserDto>(
    {
      defaultValues: {
        email: '',
        password: '',
      },
    }
  );
  

  const handleLogin = async (data: LoginUserDto) => {
    // clear previous API error
    setApiError(null);
    
    try {
      await uploadData({
        api: API_LOGIN,
        method: "post",
        data,
        loader: setIsLoading,
        dataCallback: (response: LoginResponse) => {
          // Store auth data in Zustand store
          setAuth(response.token, response.user);
        },
      });
      
      // After successful login and auth setup, navigate to the tabs
      router.replace('/(tabs)/dashboard');
      
    } catch (error) {
      console.error('Login failed:', error);
      const status = error?.statusCode;
      const message =
        status === 400
          ? 'Invalid email or password. Please check your credentials and try again.'
          : status === 500
          ? 'Something went wrong on our end. Please try again later.'
          : error?.message || 'An unexpected error occurred. Please try again.';
      setApiError({ message, statusCode: status, name: 'LoginError' });
    }
  };

  return (
    <SafeAreaView className='px-[34px] flex-col justify-center items-center'>
    
        <View className='mb-16 -mt-4 items-center'>
          <Image source={Images.LOGO} className='w-40 h-40' />
        </View>


        <CustomInput 
          iconName='user'
          iconFamily='AntDesign'
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
          iconName='password'
          iconFamily='MaterialIcons'
          control={control} 
          errors={errors} 
          placeholder={'Password'} 
          name="password"
          rules={{
              validate: {
                required: (value: any) => !!value?.trim() || 'Password is required',
                minLength: (value: any) =>
                  value?.trim().length > 5 || 'Password must be at least 6 characters',
              },
            }}
        />


        <Paragraph className='mt-8'>Forgot Password ?</Paragraph>
        
        <View className='flex-row mt-6 mb-2'>
            <Button 
              label={isLoading ? 'Logging in...' : 'Log in'} 
              className='mb-4' 
              iconFamily='MaterialIcons' 
              iconName='login' 
              onPress={handleSubmit(handleLogin)}
              disabled={isLoading}
              fullWidth
            />
        </View>


        <View className='flex-row'>

          <Paragraph>Dont have an account ?</Paragraph>
          <Pressable onPress={() => router.push('/sign-up')}>
            <Paragraph className='font-bold ml-1 text-primary'>Sign up</Paragraph>
          </Pressable>

        </View>


    </SafeAreaView>
  );
}