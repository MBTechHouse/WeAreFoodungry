import React from 'react';
import {
  Icon,
  BottomNavigation,
  BottomNavigationTab
} from 'react-native-ui-kitten';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'
import Received from '../screens/Orders/Received.js'
import Preparing from '../screens/Orders/Ready.js/index.js'
import Ready from '../screens/Orders/Ready.js'
import Completed from '../screens/Orders/Completed.js'
import Profile from '../screens/Profile'
import Login from '../screens/Login.js'
import Signup from '../screens/Signup.js'
import ManageItems from '../screens/ManageItems'

const OrdersNavigator = createMaterialTopTabNavigator ({
  Received: {
    screen: Received,
    navigationOptions:{
      tabBarIcon: ({ focused, tintcolor }) => (
        <Icon name='search' width={25} height={25} fill={tintColor} />
      )
    }
  },
  Preparing: {
    screen: Preparing,
    navigationOptions:{
      tabBarIcon: ({ tintcolor }) => (
        <Icon name='search' width={25} height={25} fill={tintColor} />
      )
    }
  },
  Ready: {
    screen: Ready,
    navigationOptions:{
      tabBarIcon: ({ focused, tintcolor }) => (
        <Icon name='search' width={25} height={25} fill={tintColor} />
      )
    }
  },
  Completed: {
    screen: Completed,
    navigationOptions:{
      tabBarIcon: ({ tintcolor }) => (
        <Icon name='search' width={25} height={25} fill={tintColor} />
      )
    }
  },
});

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
  Orders: {
    screen: OrdersNavigator,
    navigationOptions: ({navigation}) =>({
      tabBarIcon:({ focused, horizontal, tintColor }) => {
        if (navigation.state.routeName === "Orders") {
          return <Icon name='search' width={25} height={25} fill={tintColor} />
        }
      }
    })
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
