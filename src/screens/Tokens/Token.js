import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import globalStyles from '../../UI/Style';
import Cons from '../../shared/Constants';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import visaLogo from '../../assets/images/global/visa.png'


const token = (props) => {

    const pharmacy = useSelector(state => state.pharmacy);
    const [balance, setBalance] = useState(-1);
    const [amount, setAmount] = useState('0');

    useEffect(() => {
        fetchTokenBalance();
    }, []);

    // Load <balance> every time the screen is shown (in focus)
    useEffect(() => {
        const focusListener = props.navigation.addListener("didFocus", () => {
            fetchTokenBalance();
        });
        return () => focusListener.remove();
    }, []);

    const fetchTokenBalance = async () => {
        await axios.get(`${httpUrl}/token/get/balance`, {
            params: { recipient: pharmacy.eth_address },
            headers: { authorization: pharmacy.token }
        }).then(res => {
            // Convert string into Float of 2 decimals
            const amount = Math.round(parseFloat(res.data) * 100) / 100;
            setBalance(amount);
        }).catch(err => {
            console.log('Error in Token.js -> fetchTokenBalance(): ', err);
            setBalance(-2);
        });
    }

    // Add number (controlling that only one comma is possible / only 2 decimals)
    const handleAddNumber = (num) => {
        if (!amount.includes(',') || (amount.includes(',') && num !== ',')) {
            if (amount === '0') setAmount(num);
            else if (amount.charAt(amount.length - 3) !== ',') setAmount(amount + num);
        }
    }

    // Remove number (if a number has a preceding comma, it deletes number & comma)
    const handleRemoveNumber = () => {
        if (amount.length > 1) {
            if (amount.charAt(amount.length - 2) === ',') setAmount(amount.slice(0, -2));
            else setAmount(amount.slice(0, -1));
        } else if (amount.length === 1) setAmount('0');
    }

    const handlePurchase = () => {
        try {
            // Convert amount into 2-decimal integer
            let parsedAmount = Math.round(parseFloat(amount.replace(',', '.')) * 100) / 100;
            console.log(parsedAmount);

            Alert.alert(
                "Please confirm the purchase",
                null,
                [{
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        console.log('Purchased!')
                    }
                }],
                { cancelable: false }
            );



        } catch (err) {
            console.log('Error on Token.js -> handlePurchase(): ', err);
        }
    }

    const renderKeypad = () => (
        <View style={styles.keyboardContainer}>
            <View style={styles.keypadRows}>
                <TouchableOpacity
                    onPress={() => handleAddNumber('1')}
                    style={styles.key}>
                    <Text style={styles.keyText}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddNumber('2')}
                    style={styles.key}>
                    <Text style={styles.keyText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddNumber('3')}
                    style={styles.key}>
                    <Text style={styles.keyText}>3</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.keypadRows}>
                <TouchableOpacity
                    onPress={() => handleAddNumber('4')}
                    style={styles.key}>
                    <Text style={styles.keyText}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddNumber('5')}
                    style={styles.key}>
                    <Text style={styles.keyText}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddNumber('6')}
                    style={styles.key}>
                    <Text style={styles.keyText}>6</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.keypadRows}>
                <TouchableOpacity
                    onPress={() => handleAddNumber('7')}
                    style={styles.key}>
                    <Text style={styles.keyText}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddNumber('8')}
                    style={styles.key}>
                    <Text style={styles.keyText}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddNumber('9')}
                    style={styles.key}>
                    <Text style={styles.keyText}>9</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.keypadRows}>
                <TouchableOpacity
                    onPress={() => handleAddNumber(',')}
                    style={styles.key}>
                    <Text style={styles.keyText}>,</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddNumber('0')}
                    style={styles.key}>
                    <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleRemoveNumber()}
                    style={styles.key}>
                    <Text style={styles.keyText}>
                        <Ionicons
                            name='arrow-back-sharp'
                            size={25}
                        />
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPaymentMethod = () => (
        <View style={styles.itemContainer}>
            <Image
                style={styles.logoVISA}
                source={visaLogo} />
            <Text style={styles.itemText}> 4548 **** **** 3005 </Text>
            <Text style={styles.itemSmallText}> 08/24</Text>
        </View>
    )

    const renderPurchaseButton = () => (
        <View style={styles.container_bottom}>
            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => handlePurchase()}>
                <Text style={styles.buttonText}> Buy Now </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>            
            <ScrollView>
                <View style={styles.balanceContainer}>
                    <Text style={styles.text}> Current Balance :
                    <Text style={styles.bold}>
                            {(balance === -1) ? ' ...' : (balance === -2) ? ' ?' : ` ${balance}`}
                        </Text>
                        <Text style={styles.textGrey}> PCTs</Text>
                    </Text>
                </View>
                <View style={styles.balanceContainer}>
                    <Text style={styles.inputContainer}>{amount} €</Text>
                </View>
                {renderKeypad()}
                {renderPaymentMethod()}
            </ScrollView>
            {renderPurchaseButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    balanceContainer: {
        marginTop: 35,
        alignItems: 'center',
    },
    inputContainer: {
        justifyContent: 'center',
        fontSize: 36,
        color: Cons.COLORS.BLUE,
    },
    keyboardContainer: {
        marginTop: 15,
    },
    text: {
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    },
    textGrey: {
        color: 'grey',
    },
    keypadRows: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    key: {
        width: 50,
        height: 50,
        //backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyText: {
        fontSize: 26,
    },
    container_bottom: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignSelf: 'center',
        flexDirection: 'row',
        bottom: 35,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        margin: 20,
        paddingLeft: 20,
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 15,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '300',
        paddingLeft: 10,
    },
    itemSmallText: {
        fontSize: 14,
        color: 'grey',
        paddingLeft: 20
    },
    logoVISA: {
        resizeMode: 'contain',
        width: 50
    },
});

export default token;
