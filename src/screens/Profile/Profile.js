import React, { useState } from 'react';
import {
    View,
    Text,
    Alert,
    Modal,
    Linking,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { httpUrl } from '../../../urlServer';
import Cons from '../../shared/Constants'
//import showToast from '../src/shared/Toast'; // Toast not working with modals
import globalStyles from '../../UI/Style';
import CustomHeader from '../../navigation/CustomHeader';
import ActivityIndicator from '../../UI/ActivityIndicator';
import { updateData } from '../../store/actions/pharmacy';
import logger from '../../shared/logRecorder';

import imageProfile from '../../assets/images/profile/rod-of-asclepius-100.png';

const profile = (props) => {

    const dispatch = useDispatch();
    const pharmacy = useSelector(state => state.pharmacy);
    const [name, setName] = useState(pharmacy.pharmacy_desc);
    const [phone, setPhone] = useState(pharmacy.phone_number);
    const [email, setEmail] = useState(pharmacy.email);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoding] = useState(false);

    const logOut = () => {
        Alert.alert(
            '¿Seguro que quieres salir?', 'Volverás a la pantalla de inicio',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        await AsyncStorage.clear();
                        props.navigation.navigate('Auth');
                    }
                },
            ],
            { cancelable: false }
        )
    };

    const toggleIsModalOpen = () => {
        const prev = isModalOpen;
        setIsModalOpen(!prev);
    }

    // Close Modal and undo field updates
    const closeProfile = () => {
        toggleIsModalOpen();
        setName(pharmacy.pharmacy_desc);
        setPhone(pharmacy.phone_number);
        setEmail(pharmacy.email);
    }

    const checkTextInput = async () => {
        return new Promise((resolve) => {

            // Check if email is filled in
            if (email && pharmacy.email) {
                const emailChecked = email.toLowerCase().trim();
                const emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
                // Check if email has been updated
                if (pharmacy.email !== emailChecked) {
    
                    // Check if email structure is correct
                    if (!emailPattern.test(emailChecked)) {
                        Alert.alert('Por favor, introduzca un correo electrónico válido');
                        resolve(false);
                    }
    
                    // Check if email already exists in DB
                    axios.get(`${httpUrl}/pharmacy/check/email`, {
                        params: { user_id: pharmacy.pharmacy_id, email: emailChecked },
                        headers: { authorization: pharmacy.token }
                    })
                        .then(response => {
                            if ((response.data.length > 0) && (response.data[0].count > 0)) {
                                Alert.alert('Ya existe una cuenta con ese correo electrónico');
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        })
                        .catch(err => {
                            console.log('Error at Profile.js -> checkTextInput() :', err);
                            if (err.response && err.response.status === 404) {
                                logger('ERR', 'FRONT-PHARMA', `Profile.js -> checkTextInput() : ${err}`, pharmacy, '');
                            }
                            resolve(false);
                        })
                } else resolve(true);
            } else resolve(false);
        })
    }

    const saveProfile = async () => {
        if (await checkTextInput()) {
            setIsLoding(true);
            // Update User in Redux
            dispatch(updateData(
                pharmacy.pharmacy_id,
                pharmacy.token,
                name,
                phone,
                email,
            ));
            // TODO: save photo to S3
            // Update User's profile and address. In case of error, show message and do not close Modal
            if (await saveProfileToDB()) {
                toggleIsModalOpen();
            }
            setIsLoding(false);
        } else {
            Alert.alert('No se puede comprobar el correo electrónico');
        }
    }

    // Save User's profile (name, gender, email) to DB
    const saveProfileToDB = async () => {
        return new Promise((resolve) => {

            if (pharmacy.pharmacy_id) {
                axios.post(`${httpUrl}/pharmacy/profile/set`, {
                    pharmacy: {
                        pharmacy_id: pharmacy.pharmacy_id,
                        name: name,
                        phone: phone,
                        email: email,
                    }
                }, {
                    headers: {
                        authorization: pharmacy.token,
                        pharmacy_id: pharmacy.pharmacy_id
                    }
                })
                    .then((response) => {
                        if (response.status === 202) {
                            Alert.alert('Error al guardar perfil');
                            resolve(false);
                        } else {
                            resolve(true);
                        }

                    })
                    .catch(err => {
                        Alert.alert('Error al guardar el perfil');
                        logger('ERR', 'FRONT-PHARMA', `Profile.js -> saveProfileToDB() : ${err}`, pharmacy, '');
                        console.log('Error at Profile.js -> saveProfileToDB() :', err);
                        resolve(false);
                    })
            } else {
                logger('ERR', 'FRONT-PHARMA', `Profile.js -> saveProfileToDB() :`, pharmacy, 'No Pharmacy to save Profile');
                console.log('Warning on Profile.js -> saveProfileToDB(): No Pharmacy to save Profile');
                resolve(false);
            }
        })
    }

    // Send an email to the given address
    const handleEmail = () => {
        let sendEmail: String;
        (Platform.OS === 'ios')
            ? sendEmail = `mailto:support@doctormax.es&subject=Consulta de ${pharmacy.pharmacy_desc} [${pharmacy.pharmacy_id}]`
            : sendEmail = `mailto:support@doctormax.es?subject=Consulta de ${pharmacy.pharmacy_desc} [${pharmacy.pharmacy_id}]`
        Linking.canOpenURL(sendEmail)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(sendEmail);
                } else {
                    Alert.alert(`No se puede abrir el correo`);
                }
            })
            .catch(err => {
                Alert.alert(`Ha habido un error con el correo electrónico`);
                console.log('Error on Profile.js -> handleEmail(): ', err);
                logger('ERR', 'FRONT-PHARMA', `Profile.js -> handleEmail() : ${err}`, pharmacy,  `email: ${email}`);
            })
    };

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
                Alert.alert(`Ha habido un error con el navegador`);
                console.log('Error on Profile.js -> handleURL(): ', err);
                logger('ERR', 'FRONT-PHARMA', `Profile.js -> handleURL() : ${err}`, pharmacy,  `url: ${url}`);
            })
    };

    const renderEditProfile = () => (
        <Modal visible={isModalOpen} animationType='slide'>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                enabled
                keyboardVerticalOffset={10}
            >
                <ScrollView>
                    <View style={styles.containerModal}>
                        <View style={styles.containerHeaderButtons}>
                            <TouchableOpacity
                                // style={styles.button}
                                onPress={closeProfile}>
                                <Text style={styles.buttonText}> Cerrar </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                // style={styles.button}
                                onPress={saveProfile}>
                                <Text style={[styles.buttonText, styles.textBold]}> Guardar </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <ActivityIndicator isLoading={isLoading} />
                        </View>

                        <View style={styles.containerInput}>
                            <Text style={styles.text}>Nombre de farmacia </Text>
                            <TextInput
                                style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                maxLength={254}
                                onChangeText={value => setName(value)}
                                value={name}
                            />
                        </View>
                        <View style={styles.containerInput}>
                            <Text style={styles.text}>Teléfono</Text>
                            <TextInput
                                style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                maxLength={20}
                                onChangeText={value => { setPhone(value) }}
                                value={phone}
                            />
                        </View>
                        <View style={styles.containerInput}>
                            <Text style={styles.text}>Correo electrónico </Text>
                            <TextInput
                                style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                maxLength={254}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                onChangeText={value => { setEmail(value) }}
                                value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.margins}>
                        <Text style={[styles.text, styles.italic]}>Si deseas modificar otros datos de tu farmacia, por favor, ponte en contacto con nosotros. </Text>
                    </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>

    );

    const renderShowProfile = () => (
        <View>
            <TouchableOpacity
                style={styles.buttonEdit}
                onPress={toggleIsModalOpen}>
                <Text style={styles.buttonText}> Editar </Text>
            </TouchableOpacity>

            <View style={styles.containerHeader}>
                <View style={styles.profileImage}>
                    <ImageBackground
                        source={imageProfile}
                        style={styles.image}
                    />
                </View>
                <Text style={[styles.text, styles.textHeader]}> Farmacia {pharmacy.pharmacy_desc} </Text>
                <Text style={styles.text}>{pharmacy.pharmacy_code}</Text>
            </View>
            <View style={[styles.containerItems, { marginLeft: 6 }]}>
                <Ionicons name="ios-phone-portrait" size={30} style={styles.icon} />
                <Text style={styles.text}>{pharmacy.phone_number}</Text>
            </View>
            <View style={styles.containerItems}>
                <AntDesign name="user" size={25} style={styles.icon} />
                <Text style={styles.text}>{pharmacy.owner_name}</Text>
            </View>
            <View style={[styles.containerItems, { marginLeft: 3 }]}>
                <Ionicons name="ios-at" size={25} style={styles.icon} />
                <Text style={styles.text}>{pharmacy.email}</Text>
            </View>
            <View style={styles.containerItems}>
                <MaterialCommunityIcons name="web" size={25} style={styles.icon} />
                <Text style={styles.text}>{pharmacy.web}</Text>
            </View>
            <View style={styles.containerItems}>
                <Ionicons name="md-home" size={30} style={styles.icon} />
                {(pharmacy.street) ?
                    <View style={styles.container}>
                        <Text style={styles.text}>{pharmacy.street}</Text>
                        <Text style={styles.text}>{pharmacy.locality}</Text>
                        <Text style={styles.text}>{pharmacy.zip_code} {pharmacy.country}</Text>
                    </View>
                    :
                    <Text style={styles.text}> Sin informar </Text>
                }
            </View>
        </View>
    );


    const renderContactUs = () => (
        <View>
            <View style={styles.containerContact}>
                <Text style={[styles.text, styles.margins]}> Si tienes cualquier duda, por favor, contacta con nosotros ;) </Text>
            </View>
            <View style={styles.containerButton}>
                <TouchableOpacity
                    onPress={handleEmail}
                    style={[globalStyles.button, styles.buttonExit]}>
                    <View style={styles.containerIconButton}>
                        <MaterialCommunityIcons name="email-outline" size={25} color={'black'} />
                        <Text style={globalStyles.buttonText}> Contactar </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleURL}>
                <Text style={[styles.buttonText, styles.containerContact]}> Política de Privacidad </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logOut}>
                <Text style={[styles.buttonText, styles.containerContact, styles.ender]}> Salir </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <CustomHeader {...props} />
            <ScrollView style={styles.container}>
                {renderEditProfile()}
                {renderShowProfile()}
                {renderContactUs()}
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    containerItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    containerModal: {
        flex: 1,
        marginTop: 60,
        borderRadius: 5,
        paddingBottom: 100,
    },
    containerHeaderButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
    containerButton: {
        marginTop: 15,
        paddingBottom: 25,
        alignItems: 'center',
    },
    containerIconButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerInput: {
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange'
    },
    containerChange: {
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
    },
    containerContact: {
        padding: 10,
        borderTopWidth: 0.3,
        borderColor: 'orange'
    },
    buttonExit: {
        width: 150,
        alignItems: 'center',
    },
    buttonEdit: {
        margin: 15,
        alignItems: 'flex-end',
    },
    buttonText: {
        fontSize: 17,
        color: Cons.COLORS.BLUE,
    },
    textBold: {
        fontWeight: 'bold'
    },
    margins: {
        marginLeft: 25,
        marginRight: 25,
        textAlign: 'center'
    },
    image: {
        flex: 1,
        width: 130,
        height: 130,
        resizeMode: 'contain'
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: 'hidden',
        marginBottom: 5,
    },
    textHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    text: {
        fontFamily: 'HelveticaNeue',
        color: '#525775',
        fontSize: 16,
    },
    italic: {
        fontStyle: 'italic',
        fontSize: 14,
    },
    inputTextAndroid: {
        fontSize: 18,
        marginBottom: -10,
    },
    inputTextIOS: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 18,
    },
    icon: {
        marginLeft: 15,
        marginRight: 10,
        color: 'grey',
    },
    ender: {
        paddingBottom: 10,
        marginBottom: 30,
        borderBottomWidth: 0.3,
        borderColor: 'orange'
    }
});

export default profile;