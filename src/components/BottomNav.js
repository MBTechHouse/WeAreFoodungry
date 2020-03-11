import React from 'react';
import {
  Icon,
  BottomNavigation,
  BottomNavigationTab
} from 'react-native-ui-kitten';

import { createBottomTabNavigator,createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'
import Received from '../screens/Orders/Received.js'
import Preparing from '../screens/Orders/Preparing.js'
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
        <Icon name='paper-plane' width={25} height={25} tintColor={focused?'#55C2FF':'#000'} />
      )
    }
  },
  Preparing: {
    screen: Preparing,
    navigationOptions:{
      tabBarIcon: ({ focused, tintcolor }) => (
        <Icon name='clock-outline' width={25} height={25} tintColor={focused?'#55C2FF':'#000'} />
      )
    }
  },
  Ready: {
    screen: Ready,
    navigationOptions:{
      tabBarIcon: ({ focused, tintcolor }) => (
        <Icon name='done-all' width={25} height={25} tintColor={focused?'#55C2FF':'#000'} />
      )
    }
  },
  Completed: {
    screen: Completed,
    navigationOptions:{
      tabBarIcon: ({ focused, tintcolor }) => (
        <Icon name='person-done-outline' width={25} height={25} tintColor={focused?'#55C2FF':'#000'} />
      )
    }
  }
}, {
  headerMode: 'none',
  tabBarOptions: {
    activeTintColor: '#55C2FF',  // Color of tab when pressed
    inactiveTintColor: '#b5b5b5', // Color of tab when not pressed
    showIcon: 'true', // Shows an icon for both iOS and Android
    showLabel: true,
    labelStyle: {
      fontSize: 10
    },
    style: {
      backgroundColor: '#fdfdfd',
      height: '9%'
    }
  }
});

const BottomNavigator = createBottomTabNavigator({
  ManageItems: {
    screen: ManageItems,
    navigationOptions: ({navigation}) =>({
      tabBarIcon:({ focused, horizontal, tintColor }) => {
        if (navigation.state.routeName === "ManageItems") {
          return <Icon name='clipboard-outline' width={25} height={25} tintColor={focused?'#55C2FF':'#fdfdfd'} />
        }
      }
    })
  },
  Orders: {
    screen: OrdersNavigator,
    navigationOptions: ({navigation}) =>({
      tabBarIcon:({ focused }) => {
        if (navigation.state.routeName === "Orders") {
          return <Icon name='edit-2-outline' width={25} height={25} tintColor={focused?'#55C2FF':'#fdfdfd'} />
        }
      }
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({navigation}) =>({
      tabBarIcon:({ focused }) => {
        if (navigation.state.routeName === "Profile") {
          return <Icon name='person' width={25} height={25} tintColor={focused?'#55C2FF':'#fdfdfd'} />
        }
    }

    })
  }
}, {
  initialRouteName: 'Orders',
  tabBarOptions:{  showLabel: false,
    activeTintColor: '#55c2ff',
    inactiveTintColor: '#272727',
    style: {
      backgroundColor: '#333'
    }
  },
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
