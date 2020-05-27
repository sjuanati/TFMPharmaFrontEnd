import React, { useState } from 'react';
import { Body, Header, Left, Right } from "native-base";
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from 'react-redux';
import { setOrdersPage, setModifiedOrder } from '../store/actions/order';

const profileYellow = require('../assets/images/bottomBar/yellow/profile.png');
const drmax = require('../assets/images/global/DrMax.png');

const customHeaderBack = ( props ) => {
  const dispatch = useDispatch();
  const modifiedOrder = useSelector(state => state.modifiedOrder);
  const ordersPage = useSelector(state => state.order.ordersPage);

  const goBack = async () => {
    if(props.navigation.state.routeName === 'OrderDetail') {
      dispatch(setOrdersPage(true));
      dispatch(setModifiedOrder(true));
    }
    await props.navigation.goBack();
  };

  const showProfile = async () => {
    await props.navigation.navigate('Profile', props);
  };

  return (
    <Header style={styles.mainHeader}>
      <Left style={styles.left}>
        <View style={styles.backContainer}>
            <TouchableOpacity
                onPress={goBack}>
                <Ionicons
                    name="ios-arrow-back"
                    size={25}
                    color="#F4B13E"
                    style={styles.back}
                />
            </TouchableOpacity>
        </View>
      </Left>
      <Body style={styles.body}>
      <Image
        style={styles.logo}
        source={drmax}
      />
      </Body>
      <Right style={styles.right}>
        {/* <TouchableOpacity onPress={showProfile}>
          <Image
            style={styles.iconHeader}
            source={profileYellow}/>
        </TouchableOpacity> */}
      </Right>
    </Header>
  )
};


const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: 'white',
    height: 60, //110,
  },
  body: {
    flex: 1,
    alignItems: 'center'
  },
  right: {
    flex: 1
  },
  left: {
    flex: 1
  },
  logo: {
    resizeMode: 'contain',
    width: 170,
   },
  iconHeader: {
    height: 25,
    width: 25,
    paddingRight: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    zIndex: 2,
    backgroundColor: "transparent"
  },
  back: {
    paddingLeft: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    zIndex: 9999,
    backgroundColor: "transparent"
  },
  backContainer: {
    width: 80
  }
});

export default customHeaderBack;