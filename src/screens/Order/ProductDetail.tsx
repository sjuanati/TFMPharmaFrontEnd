import React from 'react';
import {
    Text,
    View,
    Alert,
    Linking,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Cons from '../../shared/Constants';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderStackParamList } from '../../navigation/StackNavigator';

type Props = {
    route: RouteProp<OrderStackParamList, 'ProductDetail'>,
    navigation: StackNavigationProp<OrderStackParamList, 'ProductDetail'>
};

const ProductDetail = (props: Props) => {

    const {
        product_desc,
        dose_qty,
        dose_form,
        prescription,
        price,
        leaflet_url } = props.route.params;

    const handleURL = (url: string) => {

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Can\'t open browser');
                }
            })
            .catch(err => {
                console.warn('Error in ProductDetail.tsx -> handleURL(): ', err);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>{product_desc}</Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Dose: </Text>
                    <Text style={styles.rowValue}> {dose_qty} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Form: </Text>
                    <Text style={styles.rowValue}> {dose_form} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Price: </Text>
                    <Text style={styles.rowValue}> {price} €</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Prescription: </Text>
                    <Text style={styles.rowValue}> {(prescription) ? 'Yes' : 'No'} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Leaflet: </Text>
                    {(leaflet_url)
                        ? <TouchableOpacity
                            onPress={() => handleURL(leaflet_url)}>
                            <Text style={[styles.rowValue, styles.availableText]}> Available </Text>
                        </TouchableOpacity>
                        : <Text style={styles.rowValue}> Not available </Text>
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Cons.COLORS.WHITE,
    },
    containerButton: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        bottom: 15,
    },
    button: {
        width: 150,
        alignItems: 'center',
        margin: 15,
    },
    headerContainer: {
        margin: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
        paddingBottom: 10,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold',
    },
    availableText: {
        color: Cons.COLORS.BLUE,
    },
    sectionContainer: {
        marginLeft: 25,
        marginTop: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    rowHeader: {
        color: 'grey',
        width: 110,
        fontSize: 16,
    },
    rowValue: {
        fontSize: 16,
    },
});

export default ProductDetail;
