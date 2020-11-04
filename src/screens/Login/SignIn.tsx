import React, { useState } from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    Spinner,
    Button,
    Text,
    Container,
    Content,
    Form,
    Item,
    Input,
} from 'native-base';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/actions/pharmacy';
import { httpUrl } from '../../../urlServer';
import showToast from '../../shared/Toast';
//import handleAxiosErrors from '../../shared/HandleAxiosErrors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginStackParamList } from '../../navigation/StackNavigator';

const image = require('../../assets/images/login/IsotipoWhite.png');
const lockYellow = require('../../assets/images/login/lock.png');
const emailYellow = require('../../assets/images/login/email.png');

type Props = {
    route: RouteProp<LoginStackParamList, 'SignIn'>,
    navigation: StackNavigationProp<LoginStackParamList, 'SignIn'>
  };

const SignIn = (props: Props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [pharmacy, setPharmacy] = useState({
        email: '',
        password: '',
    });
    const updateField = (key: string, value: string) => {
        setPharmacy({
            ...pharmacy,
            [key]: value,
        });
    };

    const login = () => {
        //console.log('credentials:', pharmacy.email, pharmacy.password);
        if (pharmacy.email && pharmacy.password) {
            setLoading(true);
            axios.post(`${httpUrl}/pharmacy/login`, {
                email: pharmacy.email,
                password: pharmacy.password,
            }).then(async res => {
                console.log(res.status, res.data, res.data.token);
                if (res.status === 200 && res.data.token) {
                    const newToken = JSON.stringify(res.data.token);
                    await AsyncStorage.setItem('token', newToken);
                    await AsyncStorage.setItem('pharmacy', JSON.stringify(res.data));
                    setLoading(false);
                    //props.navigation.navigate('Main');
                    dispatch(setToken(newToken));
                } else {
                    showToast('There was an error', 'warning');
                    setLoading(false);
                }
            }).catch((err) => {
                //handleAxiosErrors(err);
                console.log(err);
                setLoading(false);
            });
        } else {
            showToast('Fill in all parameters', 'warning');
        }
    };

    return (
        <Container style={styles.container}>
            <Image
                style={styles.logo}
                source={image}
            />
            <Text style={styles.textLogo}>
                Versión Farmacia
        </Text>
            {(loading) ?
                <Content style={styles.content}>
                    <Spinner color="#F4B13E" />
                </Content>
                : (
                    <Content style={styles.content}>
                        <Form style={styles.form}>
                            <Item rounded
                                style={styles.input}>
                                <Image
                                    style={styles.iconInput}
                                    source={emailYellow} />
                                <Input
                                    autoCapitalize="none"
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    maxLength={254}
                                    onChangeText={(mail) => updateField('email', mail)}
                                    value={pharmacy.email} />
                            </Item>
                            <Item rounded
                                style={styles.input}>
                                <Image
                                    style={styles.iconInput}
                                    source={lockYellow} />
                                <Input
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    placeholder="Password"
                                    maxLength={254}
                                    onChangeText={(pass) => updateField('password', pass)}
                                    value={pharmacy.password} />
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
                            onPress={() => props.navigation.navigate('SignUp')}>
                            REGÍSTRATE AQUÍ,
          </Text>
                        <Text style={styles.freeText}>
                            es gratuito
          </Text>
                    </Content>)}
        </Container>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#1ABC9C',
    },
    content: {
        paddingTop: '10%',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconInput: {
        width: 25,
        height: 25,
        marginLeft: 10,
    },
    logo: {
        resizeMode: 'contain',
        height: 150,
        width: 150,
        marginTop: '15%',
    },
    textLogo: {
        color: 'white',
        fontSize: 24,
    },
    text: {
        marginTop: '5%',
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
    },
    input: {
        color: 'white',
        backgroundColor: 'white',
        marginBottom: '2%',
        width: 300,
    },
    form: {
        padding: '4%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: '2%',
        marginHorizontal: '30%',
        backgroundColor: '#F4B13E',
    },
    bold: {
        marginTop: '5%',
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },
    freeText: {
        textAlign: 'center',
        width: '100%',
        fontSize: 18,
        color: 'white',
    },
});

export default SignIn;
