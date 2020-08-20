/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    Col,
    Grid,
    Button,
    Spinner,
    ListItem,
    Container,
} from 'native-base';
import axios from 'axios';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { httpUrl } from '../../../urlServer';
import { useTypedSelector, RootState } from '../../store/reducers/reducer';
import showToast from '../../shared/Toast';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderStackParamList } from '../../navigation/StackNavigator';
import ActivityIndicator from '../../UI/ActivityIndicator';

type Props = {
    route: RouteProp<OrderStackParamList, 'OrderDetail'>,
    navigation: StackNavigationProp<OrderStackParamList, 'OrderDetail'>
};

type OrderBase = RootState['order'];
interface Order extends OrderBase {
    screen: string,
}

const GetOrderDetail = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [order, setOrder] = useState<Order>();
    const [orderTraceStatus, setOrderTraceStatus] = useState('PENDING');
    const pharma = useTypedSelector(state => state.pharmacy);

    useEffect(() => {
        startFunctions()
            .catch(error => {
                console.warn(JSON.stringify(error));
            });
    }, []);

    const startFunctions = async () => {
        try {
            const { order_id } = props.route.params;
            await getOrder(pharma.pharmacy_id, order_id, pharma.token);
            await fetchOrderTraceGlobal(order_id);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchOrderTraceGlobal = async (order_id: string) => {
        await axios.get(`${httpUrl}/trace/order/global`, {
            params: { order_id: order_id },
            headers: { authorization: pharma.token },
        }).then(res => {
            setOrderTraceStatus(res.data);
        }).catch(err => {
            console.log('Error in GetOrderDetail.js -> fetchOrderTraceGlobal() : ', err);
        });
    };

    const getOrder = async (pharmacy_id: number, order_id: string, token: string) => {
        axios.get(`${httpUrl}/order/get/item/pharmacy`, {
            params: {
                pharmacy_id: pharmacy_id,
                order_id: order_id,
            },
            headers: { authorization: token },
        }).then(async res => {
            if (res.status === 200 || res.status === 304) {
                let ord = res.data;
                //setOrder(ordr => [...ordr, ...ord]);
                setOrder(ord[0]);
                setLoading(false);
            } else {
                showToast('Error while retrieveing orders','warning');
            }
        }).catch(async err => {
            handleAxiosErrors(err);
            setLoading(false);
        });
    };

    const updateOrderStatus = async (status: number) => {
        Alert.alert(
            'Please confirm the Order update',
            '',
            [{
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    setLoading(true);
                    axios.post(`${httpUrl}/order/changeOrderStatus`, {
                        status: status,
                        order_id: order!.order_id,
                        pharmacy_id: order!.pharmacy_id,
                        user_id: order!.user_id,
                        eth_address: pharma.eth_address,
                    }, {
                        headers: { authorization: pharma.token },
                    }).then(async res => {
                        if (res.status === 200 && res.data.order) {
                            let ordr = res.data.order;
                            setOrder(ordr[0]);
                        } else {
                            showToast('Error during Order status change','warning');
                        }
                    }).catch(async err => {
                        handleAxiosErrors(err);
                    }).finally(() => {
                        setLoading(false);
                    });
                },
            }],
            { cancelable: false }
        );
    };

    const StatusOrder = (status: number) => {
        if (status === 0) {
            return (<Text style={styles.statusGrey}>DRAFT</Text>);
        } else if (status === 1) {
            return (<Text style={styles.statusGrey}>REQUESTED</Text>);
        } else if (status === 2) {
            return (<Text style={styles.statusYellow}>CONFIRMED</Text>);
        } else if (status === 3) {
            return (<Text style={styles.statusGrey}>PICK UP READY</Text>);
        } else if (status === 4) {
            return (<Text style={styles.statusYellow}>IN TRANSIT</Text>);
        } else if (status === 5) {
            return (<Text style={styles.statusGreen}>DELIVERED</Text>);
        } else if (status === 6) {
            return (<Text style={styles.statusRed}>CANCELLED</Text>);
        } else {
            return (<Text />);
        }
    };

    const RenderActionButtons = () => {
        if (order!.status === 1) {
            return (
                <View style={styles.container}>
                    <Grid>
                        <Col style={styles.colButton}>
                            <Button block bordered rounded danger
                                style={styles.buttonCanceled}
                                onPress={() => updateOrderStatus(6)}>
                                <Text numberOfLines={1}
                                    style={styles.smallFont}>
                                    Cancel Order
                                </Text>
                            </Button>
                        </Col>
                        <Col style={styles.colButton}>
                            <Button block bordered rounded warning
                                style={styles.buttonDelivered}
                                onPress={() => updateOrderStatus(2)}>
                                <Text numberOfLines={1}
                                    style={styles.smallFont}>
                                    Confirm Order
                                </Text>
                            </Button>
                        </Col>
                    </Grid>
                </View>);
        } else if (order!.status === 2) {
            return (
                <View>
                    <Grid>
                        <Col style={styles.colButton}>
                            <Button block bordered rounded danger
                                style={styles.buttonCanceled}
                                onPress={() => updateOrderStatus(6)}>
                                <Text numberOfLines={1}
                                    style={styles.smallFont}>
                                    Cancel Order
                                </Text>
                            </Button>
                        </Col>
                        <Col style={styles.colButton}>
                            <Button block bordered rounded warning
                                style={styles.buttonReady}
                                onPress={() => updateOrderStatus(4)}>
                                <Text numberOfLines={2}
                                    style={styles.smallFont}>
                                    Pick Up Ready
                                </Text>
                            </Button>
                        </Col>
                        <Col style={styles.colButton}>
                            <Button block bordered rounded warning
                                style={styles.buttonDeliveredAlone}
                                onPress={() => updateOrderStatus(3)}>
                                <Text numberOfLines={1}
                                    style={styles.smallFont}>
                                    Ship Order
                                </Text>
                            </Button>
                        </Col>
                    </Grid>
                </View>);
        } else if (order!.status === 3 || order!.status === 4) {
            return (
                <View>
                    <Grid>
                        <Col style={styles.colButton}>
                            <Button block bordered rounded danger
                                style={styles.buttonCanceled}
                                onPress={() => updateOrderStatus(6)}>
                                <Text numberOfLines={1}
                                    style={styles.smallFont}>
                                    Cancel Order
                                </Text>
                            </Button>
                        </Col>
                        <Col style={styles.colButton}>
                            <Button block bordered rounded success
                                style={styles.buttonDelivered}
                                onPress={() => updateOrderStatus(5)}>
                                <Text numberOfLines={1}
                                    style={styles.smallFont}>
                                    Deliver Order
                                </Text>
                            </Button>
                        </Col>
                    </Grid>
                </View>);
        } else {
            return null;
        }
    };

    const renderItem = ({ item, index }: {item: Order, index: number}) => {
        item.screen = 'GetOrderDetail';
        return (
            <ListItem
                id={item.order_item}
                onPress={() => props.navigation.navigate('ProductDetail', item)}
                bottomDivider
                chevron>
                <View style={styles.item}>
                    <View style={styles.leftColumn}>
                        <Text>{index + 1} - {item.product_desc}</Text>
                    </View>
                    <View style={styles.rightColumn}>
                        <Text>{item.price} € </Text>
                    </View>
                </View>
            </ListItem>
        );
    };

    const RenderList = () => {
        return (
            <FlatList
                data={order}
                renderItem={renderItem}
                keyExtractor={(item: Order) => item.order_item.toString()}/>
        );
    };

    const openTrace = (order_id: string) => {
        props.navigation.navigate('OrderTrace', {
            order_id: order_id,
        });
    };

    const showOrderTraceStatus = () => {
        switch (orderTraceStatus) {
            case 'PENDING':
                return (
                    <Ionicons
                        name="ios-ellipsis-horizontal-circle-outline"
                        size={25}
                        color="orange"
                    />);
            case 'OK':
                return (
                    <Ionicons
                        name="ios-checkmark-circle-outline"
                        size={25}
                        color="green"
                    />);
            case 'NOK':
                return (
                    <Ionicons
                        name="close-circle-outline"
                        size={25}
                        color="red"
                    />);
            default:
                return (
                    <Ionicons
                        name="alert-circle-outline"
                        size={25}
                        color="red"
                    />);
        }
    };

    const RenderPage = () => (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}> Order </Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Reference: </Text>
                    <Text style={styles.rowValue}> #{order!.order_id_app} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Date: </Text>
                    <Text style={styles.rowValue}> {moment(order!.creation_date).format('Do MMMM YY - HH:mm:ss')} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> User: </Text>
                    <Text style={styles.rowValue}> {order!.name} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Status: </Text>
                    <Text style={styles.rowValue}> {StatusOrder(order!.status)} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Price: </Text>
                    <Text style={styles.rowValue}> {order!.total_price} € </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Trace: </Text>
                    {showOrderTraceStatus()}

                    <TouchableOpacity
                        style={styles.buttonDetails}
                        onPress={() => openTrace(order!.order_id)}
                    >
                        <Text style={[styles.rowValue, styles.buttonText]}> Details </Text>
                    </TouchableOpacity>
                </View>
                <RenderList />
            </View>
            {RenderActionButtons()}
            <ActivityIndicator isLoading={loading} />
        </View>
    );

    return (
        <Container>
            {(/*loading ||*/ !order)
                ? <Spinner color="#F4B13E" />
                : RenderPage()
            }
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftColumn: {
        flex: 0.8,
    },
    rightColumn: {
        justifyContent: 'center',
        marginLeft: 10,
    },
    headerContainer: {
        margin: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
    },
    sectionContainer: {
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
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white',
    },
    buttonDetails: {
        backgroundColor: '#00A591',
        marginLeft: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        justifyContent: 'center',
    },
    button: {
        marginTop: '2%',
        backgroundColor: '#F4B13E',
    },
    buttonCanceled: {
        marginTop: '2%',
    },
    buttonDelivered: {
        marginTop: '2%',
    },
    buttonDeliveredAlone: {
        marginTop: '2%',
    },
    buttonReady: {
        marginTop: '2%',
    },
    smallFont: {
        fontSize: 12,
        textAlign: 'center',
    },
    colButton: {
        paddingHorizontal: '2%',
        marginTop: '2%',
    },
    statusGrey: {
        color: 'grey',
        fontSize: 15,
    },
    statusYellow: {
        color: '#f0ad4e',
        fontSize: 15,
    },
    statusGreen: {
        color: '#5cb85c',
        fontSize: 15,
    },
    statusRed: {
        color: '#d9534f',
        fontSize: 15,
    },
});

export default GetOrderDetail;
