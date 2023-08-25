import {View, Image} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Profile from './Profile';
import {useNavigation} from '@react-navigation/native';
const Tab = createBottomTabNavigator();

export default function BottomNav() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../assets/ic_home.png')}
              style={{tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../assets/ic_profile.png')}
              style={{tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
