import React, { useState } from 'react';
import { 
    View, 
    Alert, 
    Image, 
    Linking, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Spinner, Button, Text, Container, Content, Form, Item, Input, Toast } from "native-base";
import axios from 'axios';
import { httpUrl } from '../../../urlServer';
import CheckBox from 'react-native-vector-icons/MaterialCommunityIcons';

const image = require('../../assets/images/login/IsotipoWhite.png');
const backgroundImage = require('../../assets/images/global/Background.jpg');
const lockYellow = require('../../assets/images/login/lock.png');
const emailYellow = require('../../assets/images/login/email.png');
const phoneYellow = require('../../assets/images/login/phone.png');
const userYellow = require('../../assets/images/login/user.png');


const signup = ( props ) => {
  const [isLegalAccepted, setIsLegalAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pharmacy, setPharmacy] = useState({
    pharmacy_desc: '',
    email: '',
    password: '',
    repeatPassword: '',
    phone: ''
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
      //buttonText: "Okay"
    });
  };

    const toggleIsLegalAccepted = () => {
        const prev = isLegalAccepted;
        setIsLegalAccepted(!isLegalAccepted);
    }

    const legalAlert = () => {
        Alert.alert('Por favor, marca la casilla de términos y condiciones legales');
    }

    // Opens a URL in the browser
    const handleURL = () => {
        const url = 'https://www.doctormax.es/privacidad-y-condiciones-de-uso/'
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(`No se puede abrir el navegador`);
                }
            })
            .catch(err => {
                Alert.alert('Ha habido un error con el navegador');
                console.log('Error on Pharmacy.js -> handleURL(): ', err);
        })
    };

  const register = () => {
    //console.log('credentials:', pharmacy.email, pharmacy.password, pharmacy.name, pharmacy.phone);
    if(pharmacy.email && pharmacy.password) {
      if(pharmacy.password === pharmacy.repeatPassword) {

        setLoading(true);
        axios.post(`${httpUrl}/pharmacy/register`, {
          pharmacy_desc: pharmacy.pharmacy_desc,
          email: pharmacy.email,
          password: pharmacy.password,
          phone: pharmacy.phone
        }).then(async res => {
          if (res.status === 200 && res.data.token) {
            await AsyncStorage.clear();
            await AsyncStorage.setItem('token', JSON.stringify(res.data.token));
            await AsyncStorage.setItem('pharmacy', JSON.stringify(res.data));
            setLoading(false);
            props.navigation.navigate('Main');
          } else {
            {showToast("Ha ocurrido un error")}
            setLoading(false);
          }
        }).catch((err) => {
          if(err.response && err.response.status === 400) {
            {showToast("Error en email o contraseña")}
          } else if(err.response && err.response.status === 404) {
            {showToast("No hay ningúna Farmacia con este email")}
          } else {
            {showToast("Ups... parece que no hay conexión")}
          }
          setLoading(false);
        });
      } else {
        {showToast("Las contraseñas no coinciden")}
      }
    } else {
      {showToast("Completa todos los campos")}
      setLoading(false);
    }
  };

  return (
    <ScrollView>
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
                source={userYellow}/>
              <Input type="text"
                     placeholder="Name"
                     maxLength={254}
                     onChangeText={(name) => updateField('pharmacy_desc', name)}
                     value={pharmacy.pharmacy_desc}/>
            </Item>
            <Item rounded
                  style={styles.input}>
              <Image
                style={styles.iconInput}
                source={emailYellow}/>
              <Input type="text"
                     keyboardType="email-address"
                     autoCapitalize='none'
                     placeholder="Email"
                     maxLength={254}
                     onChangeText={(mail) => updateField('email', mail)}
                     value={pharmacy.email}/>
            </Item>
            <Item rounded
                  style={styles.input}>
              <Image
                style={styles.iconInput}
                source={phoneYellow}/>
              <Input type="number"
                     keyboardType="phone-pad"
                     placeholder="Phone"
                     maxLength={20}
                     onChangeText={(phone) => updateField('phone', phone)}
                     value={pharmacy.phone}/>
            </Item>
            <Item rounded
                  style={styles.input}>
              <Image
                style={styles.iconInput}
                source={lockYellow}/>
              <Input secureTextEntry={true}
                     autoCapitalize='none'
                     type="text"
                     placeholder="Password"
                     maxLength={254}
                     onChangeText={(pass) => updateField('password', pass)}
                     value={pharmacy.password}/>
            </Item>
            <Item rounded
                  style={styles.input}>
              <Image
                style={styles.iconInput}
                source={lockYellow}/>
              <Input secureTextEntry={true}
                     autoCapitalize='none'
                     type="text"
                     placeholder="Repetir Contraseña"
                     maxLength={254}
                     onChangeText={(repeatPass) => updateField('repeatPassword', repeatPass)}
                     value={pharmacy.repeatPassword}/>
            </Item>
            <View style={[styles.text, styles.containerCheckBox]}>
                  <TouchableOpacity onPress={toggleIsLegalAccepted}>
                    <CheckBox 
                        name={(isLegalAccepted) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={30}
                    />
                  </TouchableOpacity>
                  <Text> Acepto los </Text>
                  <TouchableOpacity onPress={handleURL}>
                    <Text style={styles.textLegal}>términos y condiciones legales </Text>
                  </TouchableOpacity>
              </View>
            <Button block rounded
                    style={styles.button}
                    //onPress={register}>
                    onPress={(isLegalAccepted) ? register : legalAlert}>
              <Text>Registrarme</Text>
            </Button>
          </Form>
          <Text style={styles.text}>
            <Text style={styles.textInfo}>¿Tienes cuenta? </Text>
            <Text style={styles.bold}
                  onPress={() => props.navigation.navigate('StartScreen')}>
              Accede
            </Text>
          </Text>
        </Content>)}
      {/*</ImageBackground>*/}
    </Container>
    </ScrollView>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1ABC9C'
  },
  content: {
    paddingTop: '5%'
  },
  iconInput: {
    width: 25,
    height: 25,
    marginLeft: 10
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center'
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
    marginTop: '3%',
    textAlign: 'center'
  },
  textInfo: {
    color: 'white',
    fontSize: 18
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
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18
  },
  containerCheckBox: {
    flex: 1,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLegal: {
    color: '#2A4B7C', 
    //color: Cons.COLORS.BLUE
  },
});

export default signup;