import React, { useState } from 'react';
import {
    View,
    Alert,
    Image,
    Linking,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
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
import { httpUrl } from '../../../urlServer';
import CheckBox from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/actions/pharmacy';
import showToast from '../../shared/Toast';
import handleAxiosErrors from '../../shared/HandleAxiosErrors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginStackParamList } from '../../navigation/StackNavigator';

const image = require('../../assets/images/login/IsotipoWhite.png');
const lockYellow = require('../../assets/images/login/lock.png');
const emailYellow = require('../../assets/images/login/email.png');
const phoneYellow = require('../../assets/images/login/phone.png');
const userYellow = require('../../assets/images/login/user.png');

type Props = {
    route: RouteProp<LoginStackParamList, 'SignUp'>,
    navigation: StackNavigationProp<LoginStackParamList, 'SignUp'>
  };

const SignUp = (props: Props) => {
    const dispatch = useDispatch();
    const [isLegalAccepted,setIsLegalAccepted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [pharmacy, setPharmacy] = useState({
        pharmacy_desc: '',
        email: '',
        password: '',
        repeatPassword: '',
        phone: '',
    });
    const updateField = (key: string, value: string) => {
        setPharmacy({
            ...pharmacy,
            [key]: value,
        });
    };

    const toggleIsLegalAccepted = () => {
        setIsLegalAccepted(!isLegalAccepted);
    };

    const legalAlert = () => {
        Alert.alert('Por favor, marca la casilla de términos y condiciones legales');
    };

    // Opens a URL in the browser
    const handleURL = () => {
        const url = 'https://www.doctormax.es/privacidad-y-condiciones-de-uso/';
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Can\'t open browser');
                }
            })
            .catch(err => {
                Alert.alert('Error with browser');
                console.log('Error in SignUp.tsx -> handleURL(): ', err);
            });
    };

    const register = () => {
        //console.log('credentials:', pharmacy.email, pharmacy.password, pharmacy.name, pharmacy.phone);
        if (pharmacy.email && pharmacy.password) {
            if (pharmacy.password === pharmacy.repeatPassword) {

                setLoading(true);
                axios.post(`${httpUrl}/pharmacy/register`, {
                    pharmacy_desc: pharmacy.pharmacy_desc,
                    email: pharmacy.email,
                    password: pharmacy.password,
                    phone: pharmacy.phone,
                }).then(async res => {
                    if (res.status === 200 && res.data.token) {
                        const newToken = JSON.stringify(res.data.token);
                        await AsyncStorage.clear();
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
                    if (err.response && err.response.status === 400) {
                        handleAxiosErrors(err);
                        setLoading(false);
                    }
                });
            } else {
                showToast('Passwords do not match', 'warning');
            }
        } else {
            showToast('Fill in all parameters', 'warning');
            setLoading(false);
        }
    };

    return (
        <ScrollView>
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
                                        source={userYellow} />
                                    <Input
                                        placeholder="Name"
                                        maxLength={254}
                                        onChangeText={(name) => updateField('pharmacy_desc', name)}
                                        value={pharmacy.pharmacy_desc} />
                                </Item>
                                <Item rounded
                                    style={styles.input}>
                                    <Image
                                        style={styles.iconInput}
                                        source={emailYellow} />
                                    <Input
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholder="Email"
                                        maxLength={254}
                                        onChangeText={(mail) => updateField('email', mail)}
                                        value={pharmacy.email} />
                                </Item>
                                <Item rounded
                                    style={styles.input}>
                                    <Image
                                        style={styles.iconInput}
                                        source={phoneYellow} />
                                    <Input
                                        keyboardType="phone-pad"
                                        placeholder="Phone"
                                        maxLength={20}
                                        onChangeText={(phone) => updateField('phone', phone)}
                                        value={pharmacy.phone} />
                                </Item>
                                <Item rounded
                                    style={styles.input}>
                                    <Image
                                        style={styles.iconInput}
                                        source={lockYellow} />
                                    <Input secureTextEntry={true}
                                        autoCapitalize="none"
                                        placeholder="Password"
                                        maxLength={254}
                                        onChangeText={(pass) => updateField('password', pass)}
                                        value={pharmacy.password} />
                                </Item>
                                <Item rounded
                                    style={styles.input}>
                                    <Image
                                        style={styles.iconInput}
                                        source={lockYellow} />
                                    <Input secureTextEntry={true}
                                        autoCapitalize="none"
                                        placeholder="Repetir Contraseña"
                                        maxLength={254}
                                        onChangeText={(repeatPass) => updateField('repeatPassword', repeatPass)}
                                        value={pharmacy.repeatPassword} />
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
                                    onPress={() => props.navigation.navigate('SignIn')}>
                                    Accede
            </Text>
                            </Text>
                        </Content>)}
            </Container>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#1ABC9C',
    },
    content: {
        paddingTop: '5%',
    },
    iconInput: {
        width: 25,
        height: 25,
        marginLeft: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: '3%',
        textAlign: 'center',
    },
    textInfo: {
        color: 'white',
        fontSize: 18,
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
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
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

export default SignUp;
