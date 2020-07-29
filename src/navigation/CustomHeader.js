import React from 'react';
import { 
  Body, 
  Header, 
  Left, 
  Right 
} from "native-base";
import { 
  Image,
  StyleSheet, 
} from 'react-native'


const customHeader = (props) => {
  const drmax = require('../assets/images/global/DrMax.png');
  
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
    alignItems: 'center',
  },
  right: {
    flex: 1
  },
  left: {
    flex: 1
  },
  logo: {
    resizeMode: 'contain',
    width: 150,
    height: 50,
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