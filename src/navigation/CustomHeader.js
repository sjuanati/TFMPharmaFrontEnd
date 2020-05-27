import React, { useState } from 'react';
import { Button, Text, Container, Card, CardItem, Body, Content, Header, Title, Left, Icon, Right } from "native-base";
import { StyleSheet, Image, TouchableOpacity } from 'react-native'

const profileYellow = require('../assets/images/bottomBar/yellow/profile.png');
const drmax = require('../assets/images/global/DrMax.png');

const customHeader = ( props ) => {

  const showProfile = async () => {
    await props.navigation.navigate('Profile', props);
  };

  return (
    <Header style={styles.header}>
      <Left style={styles.left}>
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
  header: {
    backgroundColor: 'white',
    height: 60
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
    width: 170
  },
  iconHeader: {
    height: 25,
    width: 25,
    paddingRight: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    zIndex: 2,
    backgroundColor: "transparent"
  }
});

export default customHeader;