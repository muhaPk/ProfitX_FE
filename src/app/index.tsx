import { Pressable, View, Image } from 'react-native';
import { Images } from '@/shared/config/Assets';
import { SafeAreaView } from '@/shared/ui/safe-area-view';
import { LinkButton } from '@/shared/ui/link-button';
import { H1, H2, H3, Paragraph } from '@/shared/ui/typography';
import { router } from 'expo-router';


export default function Index() {

  return (
    <SafeAreaView className='flex-1 justify-around px-4'>

      <View>

          <View className='mt-4 mb-2 items-center'>
            <Image source={Images.LOGO} className='w-40 h-40' />
          </View>

          <H1 className='text-center'>Welcome</H1>
          <Paragraph className='text-center'>To continue, please log in or sign up for an account.</Paragraph>

      </View>

      <View className='px-8'>

          <View className='mt-10 mb-4'>
              <LinkButton variant='active' label='Log in' to="/log-in" iconFamily='MaterialIcons' iconName='login' />
          </View>

          <View className='flex-row justify-center'>

            <Paragraph>Dont have an account ?</Paragraph>
            <Pressable onPress={() => {router.push('/sign-up')}}>
              <Paragraph className='font-bold ml-1'>Sign up</Paragraph>
            </Pressable>

          </View>
      </View>


    </SafeAreaView>
  );
}