import { Pressable, View, Image } from 'react-native';
import CustomInput from '@/shared/ui/Input/input';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { H1, H3, Paragraph } from '@/shared/ui/typography';
import { router } from 'expo-router';
import { Images } from '@/shared/config/Assets';
import { API_FORGOT_PASSWORD, API_RESET_PASSWORD } from '@/shared/config/endpoints';
import { ForgotPasswordDto, ForgotPasswordResponse, ResetPasswordDto, ResetPasswordResponse } from '@/shared/types/auth';
import { useGenericSet } from '@/shared/hooks/useGenericSet';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import { Header } from '@/shared/ui/header';
import { IconWrapper } from '@/shared/ui/icon-wrapper';
import { useSafeNavigation } from '@/utils/navigation';



export default function ForgotPassword() {
  useAuthGuard();

  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [resetToken, setResetToken] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  const { uploadData } = useGenericSet();
  const { canGoBack, handleGoBack } = useSafeNavigation('/log-in');

  const { control, handleSubmit, setError, reset, setValue, formState: { errors } } = useForm<ForgotPasswordDto & ResetPasswordDto>(
    {
      defaultValues: {
        email: '',
        token: '',
        newPassword: '',
      },
    }
  );
  
  const handleForgotPassword = async (data: ForgotPasswordDto & ResetPasswordDto) => {
    setApiError(null);
    
    // Only send email field for forgot password
    const forgotPasswordData = { email: data.email };
    
    await uploadData({
      api: API_FORGOT_PASSWORD,
      method: 'post',
      data: forgotPasswordData,
      loader: setIsLoading,
      dataCallback: (response: ForgotPasswordResponse) => {
        if (response.success) {
          setIsEmailSent(true);
          // Keep email in form for reset step
        } else {
          setApiError(response.message || 'Failed to send reset email');
        }
      },
    });
  };

  const handleResetPassword = async (data: ForgotPasswordDto & ResetPasswordDto) => {
    setApiError(null);
    
    // Only send token and newPassword for reset password
    const resetPasswordData = { 
      token: data.token, 
      newPassword: data.newPassword 
    };
    
    await uploadData({
      api: API_RESET_PASSWORD,
      method: 'post',
      data: resetPasswordData,
      loader: setIsLoading,
      dataCallback: (response: ResetPasswordResponse) => {
        if (response.success) {
          setIsPasswordReset(true);
          reset();
        } else {
          setApiError(response.message || 'Failed to reset password');
        }
      },
    });
  };

  const handleTokenSubmit = () => {
    if (resetToken.trim()) {
      setValue('token', resetToken);
      setIsEmailSent(false); // Move to reset step
    }
  };


  return (
    <SafeAreaView> 

        <Header
          center={<H1>Forgot password</H1>}
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
         
           {isPasswordReset ? (
             <View className='mt-6 p-4 bg-green-100 rounded-lg'>
               <Paragraph className='text-green-800 text-center'>
                 Password has been reset successfully! You can now log in with your new password.
               </Paragraph>
               <Button 
                 label='Go to Login'
                 className='mt-4' 
                 iconFamily='MaterialIcons' 
                 iconName='login' 
                 onPress={() => router.push('/log-in')}
                 fullWidth
               />
             </View>
           ) : isEmailSent ? (
             <View className='mt-6 p-4'>
               <H3 className='text-center mb-4'>
                 If an account with that email exists, a password reset link has been sent.
               </H3>
               
               <CustomInput 
                 iconName='key'
                 iconFamily='AntDesign'
                 control={control} 
                 errors={errors} 
                 placeholder={'Enter Reset Token'} 
                 name="token"
                 rules={{
                     validate: {
                       required: (value: any) => !!value?.trim() || 'Reset token is required',
                       minLength: (value: any) =>
                         value?.trim().length >= 10 || 'Token must be at least 10 characters',
                     },
                   }}
               />

               <CustomInput 
                 iconName='lock'
                 iconFamily='AntDesign'
                 control={control} 
                 errors={errors} 
                 placeholder={'New Password'} 
                 name="newPassword"
                 type="password"
                 rules={{
                     validate: {
                       required: (value: any) => !!value?.trim() || 'Password is required',
                       minLength: (value: any) =>
                         value?.trim().length >= 6 || 'Password must be at least 6 characters',
                     },
                   }}
               />

               {apiError && (
                 <Paragraph className='text-red-600 text-center mt-2'>
                   {apiError}
                 </Paragraph>
               )}
               
              <Button 
                label={isLoading ? 'Resetting...' : 'Reset Password'}
                className='mt-4 mb-2' 
                iconFamily='MaterialIcons' 
                iconName='lock-reset' 
                onPress={handleSubmit(handleResetPassword)}
                disabled={isLoading}
              />

              <Pressable onPress={() => setIsEmailSent(false)}>
                <Paragraph className='font-bold ml-1 text-primary'>Back to Step 1</Paragraph>
              </Pressable>

             </View>
           ) : (
             <>
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

               {apiError && (
                 <Paragraph className='text-red-600 text-center mt-2'>
                   {apiError}
                 </Paragraph>
               )}
               
               <View className='flex-row mt-6 mb-2'>
                   <Button 
                     label={isLoading ? 'Sending...' : 'Send Reset Email'}
                     className='mb-4' 
                     iconFamily='MaterialIcons' 
                     iconName='email' 
                     onPress={handleSubmit(handleForgotPassword)}
                     disabled={isLoading}
                     fullWidth
                   />
               </View>
             </>
           )}


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