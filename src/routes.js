import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from './pages/SignIn';

import Checkin from './pages/Checkin';
import ListOrder from '~/pages/Help/ListOrder';
import NewOrder from '~/pages/Help/NewOrder';
import Answer from '~/pages/Help/Answer';

export default (signedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({
          SignIn,
        }),
        App: createBottomTabNavigator(
          {
            Checkin: {
              screen: createStackNavigator({ Checkin }),
              navigationOptions: {
                tabBarLabel: 'Check-ins',
                tabBarIcon: ({ tintColor }) => (
                  <Icon name="edit-location" size={20} color={tintColor} />
                ),
              },
            },
            Help: {
              screen: createStackNavigator(
                {
                  ListOrder,
                  NewOrder,
                  Answer,
                },
                {
                  defaultNavigationOptions: {
                    headerTintColor: '#f64f65',
                    headerLeftContainerStyle: {
                      marginLeft: 20,
                    },
                  },
                }
              ),
              navigationOptions: {
                tabBarLabel: 'Pedir ajuda',
                tabBarIcon: ({ tintColor }) => (
                  <Icon name="live-help" size={20} color={tintColor} />
                ),
              },
            },
          },
          {
            resetOnBlur: true,
            tabBarOptions: {
              keyboardHidesTabBar: true /* O teclado passa por acima da tab bar */,
              activeTintColor: '#ee4e62',
              inactiveTintColor: '#999',
              style: {
                backgroundColor: '#fff',
              },
            },
          }
        ),
      },
      { initialRouteName: signedIn ? 'App' : 'Sign' }
    )
  );
