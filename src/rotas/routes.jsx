import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../paginas/home';
import Mapa from '../paginas/mapa';
import Login from '../paginas/login'; 
import Sensores from '../paginas/sensores'; 
import Cadastro from '../paginas/cadastro';
import Sair from '../paginas/sair';
import IconMapa from 'react-native-vector-icons/FontAwesome6';
import IconSensores from 'react-native-vector-icons/MaterialIcons';
import IconSair from 'react-native-vector-icons/Ionicons';
import IconHome from 'react-native-vector-icons/MaterialCommunityIcons'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#DE013F',
      tabBarInactiveTintColor: 'gray',
      tabBarActiveBackgroundColor: 'lightblack',
      tabBarInactiveBackgroundColor: 'black',
      tabBarLabelStyle: {
        fontSize: 12,
      },
      tabBarStyle: {
        backgroundColor: 'black',
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <IconHome name="home-map-marker" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Mapa"
      component={Mapa}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <IconMapa name="map-location-dot" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Sensores"
      component={Sensores}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <IconSensores name="sensors" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Sair"
      component={Sair}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <IconSair name="exit" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
