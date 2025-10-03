import { Pressable, View, Image, Text } from 'react-native';
import CustomInput from '@/shared/ui/Input/input';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { H1, H2, Paragraph } from '@/shared/ui/typography';
import { router } from 'expo-router';
import { Images } from '@/shared/config/Assets';
import { useAxios } from '@/shared/hooks/useAxios';
import { API_LOGIN } from '@/shared/config/endpoints';
import { LoginUserDto, LoginResponse } from '@/shared/types/auth';
import { useAuthStore } from '@/shared/store/auth.store';
import { useGenericSet } from '@/shared/hooks/useGenericSet';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import { IconWrapper } from '@/shared/ui/icon-wrapper';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { Header } from '@/shared/ui/header';
import { useSafeNavigation } from '@/utils/navigation';



export default function LogIn() {
  useAuthGuard();

  const [isLoading, setIsLoading] = useState(false);
  const { set } = useAxios();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { uploadData, setError: setApiError } = useGenericSet();
  const { canGoBack, handleGoBack } = useSafeNavigation('/');

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
    
    await uploadData({
      api: API_LOGIN,
      method: "post",
      data,
      loader: setIsLoading,
      dataCallback: (response: LoginResponse) => {
        // Store auth data in Zustand store
        setAuth(response.token, response.user);
        // Navigate only on success
        router.replace('/(tabs)/dashboard');
      },
    });
    
  };

  return (

    <SafeAreaView> 
    
        <Header
          center={<H1>Log in</H1>}
          left={canGoBack ? (
            <Pressable onPress={handleGoBack}>
              <IconWrapper>
                <FontIcon iconFamily='Ionicons' iconName='arrow-back' size={24} color='black' />
              </IconWrapper>
            </Pressable>
          ) : undefined}
        />
        
        <View className='mt-12 items-center'>
          <Image source={Images.LOGO} className='w-40 h-40' />
        </View>

        <View className='flex-1 flex-col justify-center -mt-12 px-[34px]'>


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
            type='password'
            rules={{
                validate: {
                  required: (value: any) => !!value?.trim() || 'Password is required',
                  minLength: (value: any) =>
                    value?.trim().length > 5 || 'Password must be at least 6 characters',
                },
              }}
          />

          <Pressable onPress={() => router.push('/forgot-password')}>
            <Paragraph className='mt-8 text-primary'>Forgot Password ?</Paragraph>
          </Pressable>
          
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


          <View className='flex-row justify-center'>

            <Paragraph>Dont have an account ?</Paragraph>
            <Pressable onPress={() => router.push('/sign-up')}>
              <Paragraph className='font-bold ml-1 text-primary'>Sign up</Paragraph>
            </Pressable>

          </View>

        </View>

    </SafeAreaView>
  );
}