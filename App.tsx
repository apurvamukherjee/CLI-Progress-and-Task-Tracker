import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from './src/constants/theme';

import HomeScreen from './src/screens/HomeScreen';
import PendingScreen from './src/screens/PendingScreen';
import CompletedScreen from './src/screens/CompletedScreen';
import CustomTabBar from './src/components/BottomTabBar';

export type RootTabParamList = {
  Home: undefined;
  Pending: undefined;
  Completed: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={true}
      />
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Pending" component={PendingScreen} />
          <Tab.Screen name="Completed" component={CompletedScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
