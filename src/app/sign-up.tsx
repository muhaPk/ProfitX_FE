import { Pressable, View, Image } from 'react-native';
import CustomInput from '@/shared/ui/Input/input';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from '@/shared/ui/safe-area-view';

import { Button } from '@/shared/ui/button';
import { H1, H2, Paragraph } from '@/shared/ui/typography';
import { Header } from '@/shared/ui/header';
import { IconWrapper } from '@/shared/ui/icon-wrapper';
import { router } from 'expo-router';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { Images } from '@/shared/config/Assets';
import { useGenericSet } from '@/shared/hooks/useGenericSet';
import { API_SIGNUP } from '@/shared/config/endpoints';
import { useAuthStore } from '@/shared/store/auth.store';

interface ISignupResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    createdAt: string;
  };
}

export default function SignUp() {

  const { setAuth } = useAuthStore.getState()

  const { uploadData, submitting, error, setError: setApiError } = useGenericSet();

  const { control, handleSubmit, setError, reset, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        name: '',
        email: '',
        password: '',
        passwordconf: "",
      },
    }
  );

  const password = watch("password");

  const handleSend = async (data: any) => {

    const { passwordRepeat, ...rest } = data; // remove passwordRepeat
    
    await uploadData({
      api: API_SIGNUP,
      method: "post",
      data: rest,
      dataCallback: (res: ISignupResponse) => {
        setAuth(res.token, res.user);
        router.replace('/(tabs)/dashboard');
      },
    });

  };

  return (

    <SafeAreaView>

        <Header
          center={<H1>Sign up</H1>}
          left={(
            <Pressable onPress={() => router.back()}>
              <IconWrapper>
                <FontIcon iconFamily='Ionicons' iconName='arrow-back' size={24} color='black' />
              </IconWrapper>
            </Pressable>
          )}
        />
    
        <View className='mt-12 mb-4 items-center'>
          <Image source={Images.LOGO} className='w-40 h-40' />
        </View>



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
          iconName='password'
          iconFamily='MaterialIcons'
          control={control} 
          errors={errors} 
          placeholder={'Password'} 
          name="password"
          type='password'
          rules={{
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
          name="passwordconf"
          type='password'
          rules={{
              required: "Please confirm your password",
              validate: (value: string) =>
                value === password || "Passwords do not match",
          }}
        />
        
        <View className='mt-10'>
            <Button label='Sign up' className='mb-4' iconFamily='MaterialIcons' iconName='login' onPress={handleSubmit(handleSend)} />
        </View>


        <View className='flex-row justify-center mt-1'>

          <Paragraph>Already have an account ?</Paragraph>
          <Pressable onPress={() => router.push('/log-in')}>
            <Paragraph className='font-bold ml-1 text-primary'>Log in</Paragraph>
          </Pressable>

        </View>


    </SafeAreaView>

  );
}