import React from 'react';
import Settings from '../screens/Settings';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyBarterScreen from '../screens/MyBarters';
import NotificationsScreen from '../screens/NotificationsScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
    },
   Settings: {
    screen : Settings
    },
   MyBarters:{
      screen : MyBarterScreen
    },
    Notifications:{
      screen: NotificationsScreen
    }
  },
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
