/** @format */

import {ApplicationActions} from '@actions';
import {AssistiveTouch} from '@components';
import {BaseSetting, useTheme} from '@config';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {languageSelect} from '@selectors';
import * as Utils from '@utils';
import i18n from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {initReactI18next} from 'react-i18next';
import {Platform, StatusBar, View} from 'react-native';
import {DarkModeProvider, useDarkMode} from 'react-native-dark-mode';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {AllScreens, ModalScreens} from './config';
import Profile from '@screens/Profile';
import SignIn from '@screens/SignIn';
import Loading from '@screens/Loading';

const RootStack = createStackNavigator();
import {StackActions} from '@react-navigation/native';
import MainStack from './MainStack';
import getUser from '../selectors/UserSelectors';
import Skip from '../screens/Skip';
import EProductDetail from '../screens/EProductDetail';
import {fcmService} from '../config/FCMService';
import {localNotificationService} from '../config/LocalNotificationService';
// import {navigate, navigationRef} from './RootNavigation';
import messaging from '@react-native-firebase/messaging';

const Navigator = props => {
  const {theme, colors} = useTheme();
  const isDarkMode = useDarkMode();
  const language = useSelector(languageSelect);
  const {navigation} = useNavigation;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);
  const user = useSelector(state => getUser(state));
  const [initialRoute, setIntialRouete] = useState('Notification');

  useEffect(() => {
    // Hide screen loading
    SplashScreen.hide();

    // Config status bar
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    const onProcess = async () => {
      // Get current language of device
      const languageCode = language ?? BaseSetting.defaultLanguage;
      dispatch(ApplicationActions.onChangeLanguage(languageCode));
      // Config language for app
      await i18n.use(initReactI18next).init({
        resources: BaseSetting.resourcesLanguage,
        lng: languageCode,
        fallbackLng: languageCode,
      });
      setTimeout(() => {
        Utils.enableExperimental();
        setLoading(false);
        // navigationRef?.current?.dispatch(StackActions.replace('OnBoard'));
      }, 300);
    };
    onProcess();
  }, []);

  // useEffect(() => {
  //   fcmService.registerAppWithFCM();
  //   fcmService.register(onRegister, onNotification, onOpenNotification);
  //   localNotificationService.configure(onOpenNotification);
  // }, []);

  // const onRegister = token => {
  //   console.log('[App] Token', token);
  // };

  // const onNotification = notify => {
  //   // console.log("[App] onNotification", notify);
  //   const options = {
  //     soundName: 'default',
  //     playSound: true,
  //     largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
  //     smallIcon: 'ic_launcher', // (optional) default:  "ic_notification" with fallback for "ic_launcher"
  //   };

  //   localNotificationService.showNotification(
  //     0,
  //     notify.notification.title,
  //     notify.notification.body,
  //     notify,
  //     options,
  //   );
  // };

  // const onOpenNotification = async notify => {
  //   console.log('notify', notify);
  //   // if (notify) {
  //   //   navigate('Home', notify.data);
  //   // } else {
  //   // navigate('Notification', notify.data);
  //   // }
  // };

  // const goToApp = name => {
  //   navigationRef?.current?.navigate(name);
  // };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <DarkModeProvider>
        <NavigationContainer theme={theme} ref={navigationRef}>
          <RootStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            {loading ? (
              <RootStack.Screen name="Loading" component={Loading} />
            ) : user === null ? (
              <RootStack.Screen name="SignIn" component={SignIn} />
            ) : (
              <RootStack.Screen name="MainStack" component={MainStack} />
            )}
            <RootStack.Screen name="Skip" component={Skip} />
            <RootStack.Screen
              name="EProductDetail"
              component={EProductDetail}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </DarkModeProvider>
      {/* {!loading && <AssistiveTouch goToApp={goToApp} />} */}
    </View>
  );
};

export default Navigator;
