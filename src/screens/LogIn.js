import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import LottieView from 'lottie-react-native';
import {ANDROID_CLIENT_KEY} from '@env';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseUrl} from './constant';

export default function LogIn() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const handleLogin = async () => {
    try {
      //config androidId
      await GoogleSignin.configure({
        androidClientId: ANDROID_CLIENT_KEY,
      });
      //get data if signin is successful
      const data = await GoogleSignin.signIn();
      console.log('data: ' + JSON.stringify(data));
      callApiCheckUserExited(data);
    } catch (error) {
      //log error message if signin is failed
      console.error('Error: ' + error);
    }
  };

  // call api check email exits, if email is existing then login now, if email is not existing then create new user and login
  const callApiCheckUserExited = data => {
    axios
      .get(`${baseUrl}/api/user/check-email?email=${data.user.email}`)
      .then(async response => {
        if (response.data.check == true) {
          console.log(response.data.data._id);
          await AsyncStorage.setItem('uid', response.data.data._id);
          navigation.navigate('bottomNav');
        } else {
          ToastAndroid.show("email don't exiting", ToastAndroid.SHORT);
          await GoogleSignin.signOut();
        }
      })
      .catch(err => {
        console.error('call api error' + err);
      });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <LottieView
          className="w-full h-full object-contain"
          autoPlay
          loop
          source={require('../assets/animation_llg3d1es.json')}
        />
      </View>
      <View className="flex-1 items-center">
        <TouchableOpacity
          onPress={handleLogin}
          className="mt-10 w-[90%] items-center p-3 relative bg-white rounded-2xl shadow-lg shadow-gray-950">
          <Text className="text-black font-semibold">Sign in with google</Text>
          <Image
            className="w-6 h-6 absolute top-[50%] left-5"
            source={require('../assets/ic_google.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
