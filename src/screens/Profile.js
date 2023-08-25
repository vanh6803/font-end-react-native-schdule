import {View, Text, Icon, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import CardUser from '../components/CardUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import axios from 'axios'
import { baseUrl } from './constant';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const uid=  await AsyncStorage.getItem('uid')
    axios.get(`${baseUrl}/api/user/profile/${uid}`).then((response)=>{
      const data = response.data.data
      setUserInfo(data)
    })
  };

  

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      await AsyncStorage.clear(); // Await the clear operation
      navigation.replace('login');
    } catch (error) {
      console.error(error.message);
    }
  };

  console.log('profile: ', userInfo);
  return (
    <View className="flex-1 p-2 bg-white">
      <CardUser userInfo={userInfo} />
      <TouchableOpacity onPress={signOut} className='w-full mt-5 bg-red-600 justify-center items-center p-2 rounded-xl shadow-lg shadow-gray-950' >
        <Text className='text-white font-semibold text-lg' >Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
