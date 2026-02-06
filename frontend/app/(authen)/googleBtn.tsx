import { Pressable, Text, Image } from 'react-native'
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin'

import { supabase } from '../../src/lib/supabase'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: '667226347064-49tq9q0l1a7d35hkuvjoes3vd7fdbuo0.apps.googleusercontent.com',
})

export default function GoogleLoginButton() {

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices()

      const result = await GoogleSignin.signIn()

      console.log("test")

      if (result.type !== 'success') {
        throw new Error('Google sign in failed')
      }

      const idToken = result.data.idToken

      if (!idToken) {
        throw new Error('No idToken from Google')
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      })


      if (error) console.log('Supabase error:', error)
      console.log(JSON.stringify(result, null, 2))

      const { data: { user } } = await supabase.auth.getUser()

      if (!user || !user.email) throw new Error('No Supabase user email')

      const email = user.email

      const username =
        user.user_metadata?.full_name ||
        email.split('@')[0]

      const avatar =
        user.user_metadata?.avatar_url || null

      await supabase.from('user_profile').upsert({
        user_id: user.id,
        email: email,
        username: username,
        avatar_url: avatar,
        created_by: user.app_metadata.provider,
      })

      await AsyncStorage.setItem("username", username)
      await AsyncStorage.setItem("email", email)
            await AsyncStorage.setItem("profile", avatar)
      router.replace('/homepage')

    } catch (err) {
      console.log('Google login error:', err)
    }
  }

  return (
    <Pressable
      onPress={handleGoogleLogin}
      className="mt-0 w-full flex-row items-center justify-center rounded-xl bg-white py-3 border border-gray-300"
    >
      <Image
        source={icons.googleLogo}
        className="mr-3 h-5 w-5"
        resizeMode="contain"
      />

      <Text className="font-kanitRegular text-black">
        Continue with Google
      </Text>
    </Pressable>
  )
}
