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
} from "native-base";
import axios from 'axios';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { httpUrl } from '../../../urlServer';
import { useDispatch, useSelector } from 'react-redux';
import showToast from '../../shared/Toast';
import handleAxiosErrors from '../../shared/handleAxiosErrors';

const getOrderDetail = (props) => {
    //const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState([]);
    const [orderTraceStatus, setOrderTraceStatus] = useState('PENDING');
    const pharma = useSelector(state => state.pharmacy);

    useEffect(() => {
        startFunctions()
            .catch(error => {
                console.warn(JSON.stringify(error));
            });
    }, []);

    const startFunctions = async () => {
        try {
            //const order_id = props.navigation.getParam('order');
            const { order_id } = props.route.params;
            await getOrder(pharma.pharmacy_id, order_id, pharma.token);
            await fetchOrderTraceGlobal(order_id);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchOrderTraceGlobal = async (order_id) => {
        await axios.get(`${httpUrl}/trace/order/global`, {
            params: { order_id: order_id },
            headers: { authorization: pharma.token }
        }).then(res => {
            setOrderTraceStatus(res.data);
        }).catch(err => {
            console.log('Error in GetOrderDetail.js -> fetchOrderTraceGlobal() : ', err);
        });
    }

    const getOrder = async (pharmacy_id, order_id, token) => {
        axios.get(`${httpUrl}/order/get/item/pharmacy`, {
            params: {
                pharmacy_id: pharmacy_id,
                order_id: order_id,
            },
            headers: { authorization: token }
        }).then(async res => {
            console.log('Eoooo', res.status, res.data);
            if (res.status === 200 || res.status === 304) {
                let order = res.data;
                setOrder(ordr => [...ordr, ...order]);
                setLoading(false);
            } else {
                showToast("Error while retrieveing orders");
            }
        }).catch(async err => {
            handleAxiosErrors(props, err);
            setLoading(false);
        });
    };

    const updateOrderStatus = async (status) => {
        Alert.alert(
            "Please confirm the Order update",
            null,
            [{
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "OK", onPress: () => {
                    axios.post(`${httpUrl}/order/changeOrderStatus`, {
                        status: status,
                        order_id: order[0].order_id,
                        pharmacy_id: order[0].pharmacy_id,
                        user_id: order[0].user_id,
                        eth_address: pharma.eth_address,
                    }, {
                        headers: { authorization: pharma.token }
                    }).then(async res => {
                        if (res.status === 200 && res.data.order) {
                            let ordr = res.data.order;
                            setOrder(ordr);
                        } else {
                            showToast("Error during Order status change");
                        }
                    }).catch(async err => {
                        handleAxiosErrors(props, err);
                    })
                }
            }],
            { cancelable: false }
        );
    };

    const RenderDate = ({ date }) => {
        return (
            <Text note style={{ marginLeft: 5 }}>
                {("0" + date.getHours()).slice(-2)}:{("0" + date.getMinutes()).slice(-2)} {("0" + date.getDate()).slice(-2)}/{("0" + (date.getMonth() + 1).toString()).slice(-2)}/{(date.getFullYear())}
            </Text>
        )
    };

    const StatusOrder = (status) => {
        if (status === 0) {
            return (<Text style={styles.statusGrey}>DRAFT</Text>)
        } else if (status === 1) {
            return (<Text style={styles.statusGrey}>REQUESTED</Text>)
        } else if (status === 2) {
            return (<Text style={styles.statusYellow}>CONFIRMED</Text>)
        } else if (status === 3) {
            return (<Text style={styles.statusGrey}>PICK UP READY</Text>)
        } else if (status === 4) {
            return (<Text style={styles.statusYellow}>IN TRANSIT</Text>)
        } else if (status === 5) {
            return (<Text style={styles.statusGreen}>DELIVERED</Text>)
        } else if (status === 6) {
            return (<Text style={styles.statusRed}>CANCELLED</Text>)
        } else {
            return (<Text />)
        }
    };

    const RenderActionButtons = () => {
        if (order[0].status === 1) {
            return (
                <View style={{ flex: 1 }}>
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
                </View>)
        } else if (order[0].status === 2) {
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
                </View>)
        } else if (order[0].status === 3 || order[0].status === 4) {
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
                </View>)
        } else {
            return null;
        }
    };

    const renderItem = ({ item, index }) => {
        item.screen = 'GetOrderDetail'
        return (
            <ListItem
                id={item.order_item}
                onPress={() => props.navigation.navigate('ProductDetail', item)}
                bottomDivider
                chevron
            >
                {/* <View>
                        <Text>{index + 1} - {item.product_desc}</Text>
                        <Text>{item.price} € </Text>
                    </View> */}
                <View style={styles.test}>
                    <View style={styles.leftColumn}>
                        <Text>{index + 1} - {item.product_desc}</Text>
                    </View>
                    <View style={styles.rightColumn}>
                        <Text>{item.price} € </Text>
                    </View>
                </View>
            </ListItem>
        )
    };

    const RenderList = () => {
        return (
            <FlatList
                data={order}
                renderItem={renderItem}
                keyExtractor={item => item.order_item.toString()}>
            </FlatList>
        );
    };

    const openTrace = (item) => {
        props.navigation.navigate('OrderTrace', {
            order_id: item
        });
    }

    const showOrderTraceStatus = () => {
        switch (orderTraceStatus) {
            case 'PENDING':
                return (
                    <Ionicons
                        name='ios-ellipsis-horizontal-circle-outline'
                        size={25}
                        color='orange'
                    />)
            case 'OK':
                return (
                    <Ionicons
                        name='ios-checkmark-circle-outline'
                        size={25}
                        color='green'
                    />)
            case 'NOK':
                return (
                    <Ionicons
                        name='close-circle-outline'
                        size={25}
                        color='red'
                    />)
            default:
                return (
                    <Ionicons
                        name='alert-circle-outline'
                        size={25}
                        color='red'
                    />)
        }
    }

    const RenderPage = () => (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}> Order </Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Reference: </Text>
                    <Text style={styles.rowValue}> #{order[0].order_id_app} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Date: </Text>
                    <Text style={styles.rowValue}> {moment(order[0].creation_date).format('Do MMMM YY - HH:mm:ss')} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> User: </Text>
                    <Text style={styles.rowValue}> {order[0].name} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Status: </Text>
                    <Text style={styles.rowValue}> {StatusOrder(order[0].status)} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Price: </Text>
                    <Text style={styles.rowValue}> {order[0].total_price} € </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Trace: </Text>
                    {showOrderTraceStatus()}

                    <TouchableOpacity
                        style={styles.buttonDetails}
                        onPress={() => openTrace(order[0].order_id)}
                    >
                        <Text style={[styles.rowValue, styles.buttonText]}> Details </Text>
                    </TouchableOpacity>
                </View>
                <RenderList />
            </View>
            {RenderActionButtons()}
        </View>
    );

    return (
        <Container>
            {(loading || !order[0])
                ? <Spinner color='#F4B13E' />
                : RenderPage()
            }
        </Container>
    )
};

const styles = StyleSheet.create({
    test: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftColumn: {
        flex: 0.8
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
        color: 'white'
    },
    buttonDetails: {
        backgroundColor: '#00A591',
        marginLeft: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        justifyContent: 'center'
    },
    // circleContainer: {
    //     width: 20,
    //     height: 20,
    //     borderRadius: 20 / 2,
    //     backgroundColor: 'orange',
    //     borderColor: 'black',
    //     borderWidth: 1
    //   },
    // container_bottom: {
    //     position: 'absolute',
    //     alignSelf: 'center',
    //     flexDirection: 'row',
    //     bottom: 15,
    // },
    button: {
        marginTop: '2%',
        backgroundColor: '#F4B13E'
    },
    buttonCanceled: {
        marginTop: '2%'
    },
    buttonDelivered: {
        marginTop: '2%'
    },
    buttonDeliveredAlone: {
        marginTop: '2%'
    },
    buttonReady: {
        marginTop: '2%'
    },
    smallFont: {
        fontSize: 12,
        textAlign: 'center'
    },
    colButton: {
        paddingHorizontal: '2%',
        marginTop: '2%'
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

export default getOrderDetail;