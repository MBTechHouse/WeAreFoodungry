import React from 'react';
import {
  Icon,
  BottomNavigation,
  BottomNavigationTab
} from 'react-native-ui-kitten';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'
import Orders from './Orders'
import Search from './Search'
import Victor from './Victor'
import Profile from './Profile'
import OrderItems from './OrderItems'
import ViewCart from './ViewCart'
import HomeScreen from './HomeScreen.js'
import Login from './Login.js'
import Signup from './Signup.js'
import ManageItems from '../screens/ManageItems'

import AddButton from '../components/BottomNavHelper/AddButton'

const OrderNavigator = createStackNavigator(
  {
    Orders: Orders,
    OrderItemList: OrderItems,
    ViewCart: ViewCart
  },
  {
    initialRouteName: 'Orders',
  }
);

const BottomNavigator = createBottomTabNavigator({
  ManageItems: {
    screen: ManageItems,
    navigationOptions: ({navigation}) =>({
      tabBarIcon:({ focused, horizontal, tintColor }) => {
        if (navigation.state.routeName === "ManageItems") {
          return <Icon name='search' width={25} height={25} fill={tintColor} />
        }
    }

    })
  },
  Orders:{
    screen: OrderNavigator,
    navigationOptions: {
      tabBarIcon: <AddButton />
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({navigation}) =>({
      tabBarIcon:({ focused, horizontal, tintColor }) => {
        if (navigation.state.routeName === "Profile") {
          return <Icon name='person' width={25} height={25} fill={tintColor} />
        }
    }

    })
  }
}, {
  initialRouteName: 'Orders',
  tabBarOptions:{  showLabel: false,
    activeTintColor: '#55c2ff',
    inactiveTintColor: '#272727'},
});

const MainNav = createStackNavigator({
  Login: Login,
  Signup: Signup,
  MainFlow: BottomNavigator},
  {
    initialRouteName: 'Login',
    header: null,
  headerMode: 'none'
  }
)

export const BottomNav = createAppContainer(MainNav);
