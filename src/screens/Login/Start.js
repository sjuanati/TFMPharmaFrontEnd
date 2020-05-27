import React, { useState } from 'react';
import { StyleSheet, 
        Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Spinner, 
        Button, 
        Text, 
        Container, 
        Content, 
        Form, 
        Item, 
        Input, 
        Toast } from "native-base";
import axios from 'axios';

import { httpUrl } from '../../../urlServer';

const image = require('../../assets/images/login/IsotipoWhite.png');
const backgroundImage = require('../../assets/images/global/Background.jpg');
const lockYellow = require('../../assets/images/login/lock.png');
const emailYellow = require('../../assets/images/login/email.png');

const start = props => {
  const [loading, setLoading] = useState(false);
  const [pharmacy, setPharmacy] = useState({
    email: '',
    password: ''
  });
  const updateField = (key, value) => {
    setPharmacy({
      ...pharmacy,
      [key]: value
    });
  };

  const showToast = (text) => {
    Toast.show({
      text: text,
      position: "bottom",
      buttonText: "Okay"
    });
  };

  const login = () => {
    console.log('credentials:', pharmacy.email, pharmacy.password);
    if(pharmacy.email && pharmacy.password) {
      setLoading(true);
      axios.post(`${httpUrl}/pharmacy/login`, {
        email: pharmacy.email,
        password: pharmacy.password
      }).then(async res => {
        console.log(res.status, res.data, res.data.token);
        if(res.status === 200 && res.data.token) {
          //await AsyncStorage.clear();
          await AsyncStorage.setItem('token', JSON.stringify(res.data.token));
          await AsyncStorage.setItem('pharmacy', JSON.stringify(res.data));
          setLoading(false);
          props.navigation.navigate('Main');
        } else {
          {showToast("Ha ocurrido un error")}
          setLoading(false);
        }
      }).catch((err) => {
        if(err.response &&(err.response.status === 401 || err.response.status === 403)) {
          {showToast("Error en email o contraseña")}
        } else if(err.response && err.response.status === 404) {
          {showToast("No hay ningúna Farmacia con este email")}
        } else {
          {showToast("Ups... parece que no hay conexión")}
        }
        setLoading(false);
      });
    } else {
      {showToast("Complete all parameters")}
    }
  };

  return (
    <Container style={styles.container}>
      {/*<ImageBackground*/}
        {/*style={styles.backgroundImage}*/}
        {/*source={backgroundImage}>*/}
        <Image
          style={styles.logo}
          source={image}
        />
        <Text style={styles.textLogo}>
          Versión Farmacia
        </Text>
      {(loading) ?
        <Content style={styles.content}>
          <Spinner color='#F4B13E' />
        </Content>
        : (
        <Content style={styles.content}>
          <Form style={styles.form}>
            <Item rounded
                  style={styles.input}>
              <Image
                style={styles.iconInput}
                source={emailYellow}/>
              <Input type="text"
                     autoCapitalize='none'
                     placeholder="Email"
                     keyboardType="email-address"
                     maxLength={254}
                     onChangeText={(mail) => updateField('email', mail)}
                     value={pharmacy.email}/>
            </Item>
            <Item rounded
                  style={styles.input}>
              <Image
                style={styles.iconInput}
                source={lockYellow}/>
              <Input secureTextEntry={true}
                     autoCapitalize='none'
                     type="text"
                     placeholder="Contraseña"
                     maxLength={254}
                     onChangeText={(pass) => updateField('password', pass)}
                     value={pharmacy.password}/>
            </Item>
            <Button block rounded
                    style={styles.button}
                    onPress={login}>
              <Text>Acceder</Text>
            </Button>
          </Form>
          <Text style={styles.text}>
            ¿No tienes cuenta todavía?
          </Text>
          <Text style={styles.bold}
                onPress={() => props.navigation.navigate('SignUpScreen')}>
            REGÍSTRATE AQUÍ,
          </Text>
          <Text style={styles.freeText}>
            es gratuito
          </Text>
        </Content>)}
      {/*</ImageBackground>*/}
    </Container>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1ABC9C'
  },
  content: {
    paddingTop: '10%'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center'
  },
  iconInput: {
    width: 25,
    height: 25,
    marginLeft: 10
  },
  logo: {
    resizeMode: 'contain',
    height: 150,
    width: 150,
    marginTop: '15%'
  },
  textLogo: {
    color: 'white',
    fontSize: 24
  },
  text: {
    marginTop: '5%',
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
    color: 'white'
  },
  input: {
    color: 'white',
    backgroundColor: 'white',
    marginBottom: '2%',
    width: 300
  },
  form: {
    padding: '4%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: '2%',
    marginHorizontal: '30%',
    backgroundColor: '#F4B13E'
  },
  bold: {
    marginTop: '5%',
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white'
  },
  freeText: {
    textAlign: 'center',
    width: '100%',
    fontSize: 18,
    color: 'white'
  }
});
export default start;