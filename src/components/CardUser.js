import {
    View,
    Text,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Button,
    Image,
  } from 'react-native';
import React from 'react'
import { Calendar } from 'react-native-big-calendar'

export default function CardUser(data) {
    console.log(" data:  ",data);
    const user = data.userInfo
  return (
    <View className="flex-row w-full p-2 bg-white rounded-2xl shadow-lg shadow-gray-950">
    {user && user?.photo ? (
      <Image
        source={{uri: user?.photo}}
        style={{width: 100, height: 100, borderRadius: 50}}
      />
    ) : (
      <Image
        source={require('../assets/i8.jpg')} // Replace with your default image path
        style={{width: 100, height: 100, borderRadius: 50}}
      />
    )}

    <View className='mx-2 mt-1'>
      <Text className="text-black text-[18px] font-semibold  ">
        {user?.name}
      </Text>
      <Text className="text-black  ">
        {user?.email}
      </Text>
    </View>
  </View>
  )
}