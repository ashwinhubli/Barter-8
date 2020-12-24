import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/Homescreen';
import UserDetailsScreen  from '../screens/UserDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  ItemExchangeList : {
    screen : HomeScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  UserDetails : {
    screen : UserDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  },

},
  {
    initialRouteName: 'ItemExchangeList'
  }
);