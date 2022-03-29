import {
  Header,
  Icon,
  ListThumbCircleNotif,
  SafeAreaView,
  Text,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
// Load sample data
import {NotificationData} from '@data';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import axios from 'axios';
import {API_URL} from '@env';
import styles from './styles';
import apiCall from '../../config/ApiActionCreator';

import {decrement} from '../../actions/actionsTotal';

const Notification = props => {
  const {navigation, route} = props;
  // const {params} = props;
  console.log('routes from ', route.params);
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(NotificationData);
  const users = useSelector(state => getUser(state));
  const [email, setEmail] = useState(users.user);
  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [urlApi, seturlApi] = useState(API_URL);
  const [dataNotif, setDataNotif] = useState([]);

  const dispatch = useDispatch();

  const data = useSelector(state => state.apiReducer.data);
  console.log('datasada', data.length);

  const loading = useSelector(state => state.apiReducer.loading);
  const counter = useSelector(state => state.counter);

  useEffect(() => {
    dispatch(
      apiCall(
        'http://34.87.121.155:8181/apiwebpbi/api/notification?email=bagus.trinanda@ifca.co.id&entity_cd=01&project_no=01',
      ),
    );
  }, []);

  const [notif, setNotif] = useState(route && route.params ? route.params : {});

  // http://34.87.121.155:2121/apiwebpbi/api/notification

  // POST
  // body : email, entity_cd, project_no, device (hardcode aja valuenya Mobile)
  //-----FOR GET ENTITY & PROJJECT
  const getTower = async () => {
    const data = {
      email: email,
      app: 'O',
    };

    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        // token: "",
      },
    };

    await axios
      .get(
        `http://34.87.121.155:2121/apiwebpbi/api/getData/mysql/${data.email}/${data.app}`,
      )
      .then(res => {
        const datas = res.data;

        const arrDataTower = datas.Data;
        arrDataTower.map(dat => {
          if (dat) {
            setdataTowerUser(dat);
            // getNotification(dat);
          }
        });
        setArrDataTowerUser(arrDataTower);
        setSpinner(false);

        // return res.data;
      })
      .catch(error => {
        console.log('error get tower api', error);
        alert('error get');
      });
  };

  useEffect(() => {
    setTimeout(() => {
      getTower(users);
    }, 3000);
  }, []);

  // const getNotification = async data => {
  //   const formData = {
  //     email: email,
  //     entity_cd: data.entity_cd,
  //     project_no: data.project_no,
  //   };

  //   console.log('form data notif', formData);

  //   const config = {
  //     headers: {
  //       accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       token: '',
  //     },
  //   };

  //   await axios
  //     .get(
  //       `http://34.87.121.155:8181/apiwebpbi/api/notification?email=bagus.trinanda@ifca.co.id&entity_cd=01&project_no=01`,
  //     )
  //     .then(res => {
  //       // console.log('res tiket multi', res.data);
  //       const resNotif = res.data;

  //       console.log('resNotif', resNotif);
  //       setDataNotif(resNotif);
  //       setSpinner(false);
  //       // return res.data;
  //     })
  //     .catch(error => {
  //       console.log('err data notif', error);
  //       alert('error nih');
  //     });
  // };

  // const goNotifDetail = item => () => {
  //   const minusKlikNotif = data.length - 1;
  //   console.log('minus', minusKlikNotif);
  //   // navigation.navigate('NotificationDetail', {item: item});
  // };

  const goNotif = decrement;
  console.log('minus', goNotif);
  // navigation.navigate('NotificationDetail', {item: item});

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('notification')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <FlatList
            contentContainerStyle={{paddingHorizontal: 20}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={data}
            keyExtractor={(item, index) => item.NotificationID}
            renderItem={({item, index}) => (
              <ListThumbCircleNotif
                // image={item.image}
                txtLeftTitle1={item.Report_no}
                txtLeftTitle2={item.NotificationCd}
                txtContent={item.Remarks}
                txtRight={item.NotificationDate}
                onPress={() => dispatch({type: 'DECREMENT'})}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notification;
