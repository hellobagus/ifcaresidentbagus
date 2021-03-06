/** @format */

import React, {useEffect} from 'react';
import {Icon, Text} from '@components';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {BaseColor, BaseStyle, useTheme} from '@config';
import {useDispatch, useSelector} from 'react-redux';
import apiCall from '../../config/ApiActionCreator';

export const tabBarIcon = ({color, name}) => (
  <Icon name={name} size={20} solid color={color} />
);

export const tabBarIconHaveNoty = ({color, name}) => {
  const dispatch = useDispatch();

  const data = useSelector(state => state.apiReducer.data);
  console.log('datassssskloada', data.length);
  const counter = useSelector(state => state.counter);

  const total = data.length + counter;

  useEffect(() => {
    console.log('datassssskloada', data.length);

    // dispatch(
    //   apiCall(
    //     'http://34.87.121.155:8181/apiwebpbi/api/notification?email=bagus.trinanda@ifca.co.id&entity_cd=01&project_no=01',
    //   ),
    // );
  }, []);
  return (
    <View>
      {tabBarIcon({color, name})}
      <View
        style={{
          borderWidth: 1,
          borderColor: BaseColor.whiteColor,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: 20,
          height: 20,
          backgroundColor: 'red',
          top: -5,
          right: -12,
          borderRadius: 10,
        }}>
        <Text whiteColor caption2>
          {total}
        </Text>
      </View>
    </View>
  );
};

const BottomTab = createBottomTabNavigator();

export const BottomTabNavigatorMazi = ({tabScreens = {}}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showIcon: true,
        showLabel: true,
        activeTintColor: colors.primaryColor,
        inactiveTintColor: BaseColor.grayColor,
        style: BaseStyle.tabBar,
        labelStyle: {
          fontSize: 12,
        },
      }}>
      {Object.keys(tabScreens).map((name, index) => {
        const {options, component} = tabScreens[name];
        return (
          <BottomTab.Screen
            key={index}
            name={name}
            component={component}
            options={{
              ...options,
              title: t(options.title),
            }}
          />
        );
      })}
    </BottomTab.Navigator>
  );
};
