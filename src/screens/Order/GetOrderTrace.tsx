/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { useTypedSelector, RootState } from '../../store/reducers/reducer';
import { httpUrl } from '../../../urlServer';
import { ListItem } from 'react-native-elements';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderStackParamList } from '../../navigation/StackNavigator';

type Props = {
    route: RouteProp<OrderStackParamList, 'OrderTrace'>,
    navigation: StackNavigationProp<OrderStackParamList, 'OrderTrace'>
};
type Checksum = 'OK' | 'NOK' | 'PENDING';
type OrderBase = RootState['order'];

interface Order extends OrderBase {
    trace_id: string,
    order_date: number,
    checksum: Checksum,
    error: string,
    db_hash: string,
    order_status: number
}

const GetOrderTrace = (props: Props) => {

    const { order_id } = props.route.params;
    const pharmacy = useTypedSelector(state => state.pharmacy);
    const [order, setOrder] = useState([]);

    useEffect(() => {
        fetchOrderTrace();
    }, []);

    const fetchOrderTrace = async () => {
        await axios.get(`${httpUrl}/trace/order`, {
            params: { order_id: order_id },
            headers: { authorization: pharmacy.token },
        }).then(res => {
            setOrder(res.data);
        }).catch(err => {
            console.log('Error in GetOrderTrace.js -> getOrderTrace() -> fetchOrderTrace(): ', err);
        });
    };

    const showTrimmedHash = (hash: string) => {
        return hash.slice(0, 25) + '...' + hash.slice(-5);
    };

    const showChecksum = (checksum: Checksum, error: string) => {
        switch (checksum) {
            case 'OK':
                return <Text style={styles.textValidated}>Validated </Text>;
            case 'NOK':
                return <Text style={styles.textNotValidated}>Not Validated  <Text style={styles.unbold}>({error})</Text></Text>;
            case 'PENDING':
                return <Text style={styles.textPending}>Pending </Text>;
            default:
                return <Text style={styles.textNotValidated}>Unknown </Text>;
        }
    };

    // Render list of Order items
    const renderOrderItems = ({ item }: { item: Order }) => (
        <ListItem
            title={<Text style={styles.textHeader}>{item.status_desc}</Text>}
            subtitle={
                <View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Date: </Text>
                        <Text style={styles.rowValue}>{moment.unix(item.order_date).format('DD-MM-YYYY H:mm:ss')} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Checksum: </Text>
                        <Text style={styles.rowValue}>{showChecksum(item.checksum, item.error)} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Hash: </Text>
                        <Text style={styles.rowValue}>{showTrimmedHash(item.db_hash)} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Signed by: </Text>
                        <Text style={styles.rowValue}>
                            {(item.order_status < 2) ? item.name : 'Pharmacy ' + item.pharmacy_desc}
                        </Text>
                    </View>
                </View>}
            bottomDivider
            children
        />
    );

    // Build list of Order items
    const renderOrderTrace = () => (
        <FlatList
            data={order}
            keyExtractor={(item: Order) => String(item.trace_id)}
            renderItem={renderOrderItems} />
    );

    return (
        <View style={styles.container}>
            {renderOrderTrace()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    rowHeader: {
        color: 'grey',
        width: 83,
    },
    rowValue: {
        width: 300,
    },
    textHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textValidated: {
        color: 'green',
        fontWeight: 'bold',
    },
    textNotValidated: {
        color: 'red',
        fontWeight: 'bold',
    },
    textPending: {
        color: 'orange',
        fontWeight: 'bold',
    },
    unbold: {
        fontWeight: 'normal',
    },
});

export default GetOrderTrace;
