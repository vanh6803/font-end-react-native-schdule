import { View, Text } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LogIn from './src/screens/LogIn';
import BottomNav from './src/screens/BottomNav';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={LogIn}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="bottomNav" component={BottomNav} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}