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
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { useTypedSelector } from '../../store/reducers/reducer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { httpUrl } from '../../../urlServer';
import Cons from '../../shared/Constants';
import globalStyles from '../../UI/Style';
import ActivityIndicator from '../../UI/ActivityIndicator';
import { updateData, setToken } from '../../store/actions/pharmacy';

const Profile = () => {

    const dispatch = useDispatch();
    const pharmacy = useTypedSelector(state => state.pharmacy);
    const [name, setName] = useState(pharmacy.pharmacy_desc);
    const [phone, setPhone] = useState(pharmacy.phone);
    const [email, setEmail] = useState(pharmacy.email);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoding] = useState(false);

    const logOut = () => {
        Alert.alert(
            '¿Do you want to sign out?', '',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        await AsyncStorage.clear();
                        dispatch(setToken(null));
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const toggleIsModalOpen = () => {
        const prev = isModalOpen;
        setIsModalOpen(!prev);
    };

    // Close Modal and undo field updates
    const closeProfile = () => {
        toggleIsModalOpen();
        setName(pharmacy.pharmacy_desc);
        setPhone(pharmacy.phone);
        setEmail(pharmacy.email);
    };

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
                        Alert.alert('Please insert a valid email address');
                        resolve(false);
                    }

                    // Check if email already exists in DB
                    axios.get(`${httpUrl}/pharmacy/check/email`, {
                        params: { user_id: pharmacy.pharmacy_id, email: emailChecked },
                        headers: { authorization: pharmacy.token },
                    })
                        .then(response => {
                            if ((response.data.length > 0) && (response.data[0].count > 0)) {
                                Alert.alert('An account already exists with this email');
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        })
                        .catch(err => {
                            console.log('Error in Profile.tsx -> checkTextInput() :', err);
                            resolve(false);
                        });
                } else {resolve(true);}
            } else {resolve(false);}
        });
    };

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
            if (await saveProfileToDB()) {
                toggleIsModalOpen();
            }
            setIsLoding(false);
        } else {
            Alert.alert('Can\'t check email');
        }
    };

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
                    },
                }, {
                    headers: {
                        authorization: pharmacy.token,
                        pharmacy_id: pharmacy.pharmacy_id,
                    },
                })
                    .then((response) => {
                        if (response.status === 202) {
                            Alert.alert('Error saving profile');
                            resolve(false);
                        } else {
                            resolve(true);
                        }

                    })
                    .catch(err => {
                        Alert.alert('Error saving profile');
                        console.log('Error in Profile.tsx -> saveProfileToDB() :', err);
                        resolve(false);
                    });
            } else {
                console.log('Warning in Profile.tsx -> saveProfileToDB(): No Pharmacy to save Profile');
                resolve(false);
            }
        });
    };

    // Send an email to the given address
    const handleEmail = () => {
        let sendEmail: string;
        (Platform.OS === 'ios')
            ? sendEmail = `mailto:support@doctormax.es&subject=Consulta de ${pharmacy.pharmacy_desc} [${pharmacy.pharmacy_id}]`
            : sendEmail = `mailto:support@doctormax.es?subject=Consulta de ${pharmacy.pharmacy_desc} [${pharmacy.pharmacy_id}]`;
        Linking.canOpenURL(sendEmail)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(sendEmail);
                } else {
                    Alert.alert('Can\'t open mail');
                }
            })
            .catch(err => {
                Alert.alert('Error sending email');
                console.log('Error in Profile.tsx -> handleEmail(): ', err);
            });
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
                console.log('Error in Profile.tsx -> handleURL(): ', err);
            });
    };

    const renderEditProfile = () => (
        <Modal visible={isModalOpen} animationType="slide">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                enabled
                keyboardVerticalOffset={10}
            >
                <ScrollView>
                    <View style={styles.containerModal}>
                        <View style={styles.containerHeaderButtons}>
                            <TouchableOpacity
                                // style={styles.button}
                                onPress={closeProfile}>
                                <Text style={styles.buttonText}> Close </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                // style={styles.button}
                                onPress={saveProfile}>
                                <Text style={[styles.buttonText, styles.textBold]}> Save </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <ActivityIndicator isLoading={isLoading} />
                        </View>

                        <View style={styles.containerInput}>
                            <Text style={styles.text}>Pharmacy name </Text>
                            <TextInput
                                style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                maxLength={254}
                                onChangeText={value => setName(value)}
                                value={name}
                            />
                        </View>
                        <View style={styles.containerInput}>
                            <Text style={styles.text}>Phone</Text>
                            <TextInput
                                style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                maxLength={20}
                                onChangeText={value => { setPhone(value); }}
                                value={phone}
                            />
                        </View>
                        <View style={styles.containerInput}>
                            <Text style={styles.text}>Email </Text>
                            <TextInput
                                style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                maxLength={254}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                onChangeText={value => { setEmail(value); }}
                                value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.margins}>
                        <Text style={[styles.text, styles.italic]}>Please contact us if you want to apply further updates in your pharmacy </Text>
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
                <Text style={styles.buttonText}> Edit </Text>
            </TouchableOpacity>

            <View style={styles.containerHeader}>
                <Text style={[styles.text, styles.textHeader]}> Pharmacy {pharmacy.pharmacy_desc} </Text>
                <Text style={styles.text}>{pharmacy.pharmacy_code}</Text>
                <QRCode
                    //value={user.eth_address}
                    value="jandddeeerrlskdjflkdsjflkdsj"
                    color={'black'}
                    backgroundColor={'white'}
                    size={125}
                    logoMargin={2}
                    logoSize={30}
                    logoBorderRadius={10}
                    logoBackgroundColor={'transparent'}
                />
            </View>

            <View style={[styles.containerItems/*, { marginLeft: 6 }*/]}>
                <Ionicons name="ios-phone-portrait" size={30} style={styles.icon} />
                <Text style={styles.text}>{pharmacy.phone}</Text>
            </View>
            <View style={styles.containerItems}>
                <AntDesign name="user" size={25} style={styles.icon} />
                <Text style={styles.text}>{pharmacy.owner_name}</Text>
            </View>
            <View style={[styles.containerItems/*, { marginLeft: 3 }*/]}>
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
                    <Text style={styles.text}> Not filled </Text>
                }
            </View>
        </View>
    );


    const renderContactUs = () => (
        <View>
            <View style={styles.containerContact}>
                <Text style={[styles.text, styles.margins]}> Please contact us if you have any doubt ;) </Text>
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
                <Text style={[styles.buttonText, styles.containerContact]}> Privacy Policy </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logOut}>
                <Text style={[styles.buttonText, styles.containerContact, styles.ender]}> Sign Out </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                {renderEditProfile()}
                {renderShowProfile()}
                {renderContactUs()}
            </ScrollView>
        </View>
    );
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
        alignItems: 'center',
    },
    containerInput: {
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
    },
    containerChange: {
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
    },
    containerContact: {
        padding: 10,
        borderTopWidth: 0.3,
        borderColor: 'orange',
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
        fontWeight: 'bold',
    },
    margins: {
        marginLeft: 25,
        marginRight: 25,
        textAlign: 'center',
    },
    image: {
        flex: 1,
        width: 130,
        height: 130,
        resizeMode: 'contain',
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
        borderColor: 'orange',
    },
});

export default Profile;
