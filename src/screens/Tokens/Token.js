import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Keypad from '../../UI/Keypad';
import globalStyles from '../../UI/Style';
import Cons from '../../shared/Constants';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import { ScrollView } from 'react-native-gesture-handler';
import PaymentVISA from '../../UI/PaymentVISA';
import ActivityIndicator from '../../UI/ActivityIndicator';

const token = (props) => {

    const pharmacy = useSelector(state => state.pharmacy);
    const [balance, setBalance] = useState(-1);
    const [amount, setAmount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTokenBalance();
    }, []);

    // Load <balance> every time the screen is shown (in focus)
    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', () => {
            fetchTokenBalance();
        });
        return focusListener;
    }, [props.navigation]);

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

    const fetchBuyTokens = async (amount) => {
        setIsLoading(true);
        await axios.get(`${httpUrl}/token/buyTokens`, {
            params: {
                recipient: pharmacy.eth_address,
                amount: amount,
            },
            headers: { authorization: pharmacy.token }
        }).then(() => {
            fetchTokenBalance();
            setAmount('0');
            Alert.alert('Amount successfully transferred.');
        }).catch(err => {
            console.log('Error in Token.js -> buyTokens(): ', err);
        }).then(() => {
            setIsLoading(false)
        });
    }

    /**
     * @dev Add number to the total amount. 
     * - Only one comma for decimals is allowed
     * - Only two decimals are allowed
     * - Maximum length for the total amount is 9 digits
     * @param num New number to be added to the right of the total amount 
     */
    const addNumberHandler = (num) => {
        if ((!amount.includes(',') || (amount.includes(',') && num !== ',')) && amount.length < 9) {
            if (amount === '0') setAmount(num);
            else if (amount.charAt(amount.length - 3) !== ',') setAmount(amount + num);
        }
    }

    /**
     * @dev Remove number from the total amount. 
     * - If a number has a preceding comma, it deletes number & comma
     */
    const removeNumberHandler = () => {
        if (amount.length > 1) {
            if (amount.charAt(amount.length - 2) === ',') setAmount(amount.slice(0, -2));
            else setAmount(amount.slice(0, -1));
        } else if (amount.length === 1) setAmount('0');
    }

    const handlePurchase = () => {
        try {
            Alert.alert(
                "Please confirm the purchase",
                null,
                [{
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        // Convert amount from String into 2-decimal Integer
                        let parsedAmount = Math.round(parseFloat(amount.replace(',', '.')) * 100) / 100;
                        fetchBuyTokens(parsedAmount);
                    }
                }],
                { cancelable: false }
            );
        } catch (err) {
            console.log('Error on Token.js -> handlePurchase(): ', err);
        }
    }

    const renderPurchaseButton = () => (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={((amount !== '0') && (amount !== ','))
                    ? globalStyles.button
                    : globalStyles.buttonDisabled}
                disabled={((amount !== '0') && (amount !== ','))
                    ? false
                    : true}
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
                    <Text style={styles.amountContainer}>{amount.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €</Text>
                </View>
                <Keypad
                    onAddNumber={addNumberHandler}
                    onRemoveNumber={removeNumberHandler} />
                <PaymentVISA />
                <ActivityIndicator 
                    isLoading={isLoading} />
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
    amountContainer: {
        justifyContent: 'center',
        fontSize: 36,
        color: Cons.COLORS.BLUE,
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
    buttonContainer: {
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
});

export default token;
