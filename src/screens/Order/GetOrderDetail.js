import React, { useState, useEffect } from 'react';
import { Grid, Col, Spinner, Button, Icon, Form, Text, Container, Content, Toast, ListItem, Right, Body, Item, Input, Label } from "native-base";
import { View, StyleSheet, Alert, FlatList, Keyboard, TouchableWithoutFeedback, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { httpUrl } from '../../../urlServer';
import { useDispatch, useSelector } from 'react-redux';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';
import showToast from '../../shared/Toast';

const getOrderDetail = (props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState([]);
    const [pharmacy, setPharmacy] = useState({});
    const [token, setToken] = useState(async () => '');

    useEffect(() => {
        startFunctions()
            .catch(error => {
                console.warn(JSON.stringify(error));
            });
    }, []);

    const startFunctions = async () => {
        try {
            let usr = JSON.parse(await AsyncStorage.getItem('pharmacy'));
            setPharmacy(usr);
            let tkn = await AsyncStorage.getItem('token');
            setToken(tkn);

            let order_id = props.navigation.getParam('order');

            await getOrder(usr.pharmacy_id, order_id, tkn);
            setLoading(false);
        } catch (error) {
            throw error;
        }
    };

    const getOrder = async (pharmacy_id, order_id, token) => {
        axios.get(`${httpUrl}/order/get/item/pharmacy`, {
            params: {
                pharmacy_id: pharmacy_id,
                order_id: order_id,
            },
            headers: { authorization: token }
        }).then(async res => {
            console.log(res.status, res.data);
            if (res.status === 200 || res.status === 304) {
                let order = res.data;
                setOrder(ordr => [...ordr, ...order]);
                setLoading(false);
            } else {
                { showToast("Ha ocurrido un error") }
            }
        }).catch(async err => {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                { showToast("Por favor, vuelve a entrar") }
                await AsyncStorage.clear();
                props.navigation.navigate('StartScreen');
            } else if (err.response && err.response.status === 400) {
                { showToast("Ha ocurrido un error") }
            } else {
                { showToast("Ups... parece que no hay conexión") }
            }
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
                    }, {
                        headers: { authorization: token }
                    }).then(async res => {
                        if (res.status === 200 && res.data.order) {
                            let ordr = res.data.order;
                            setOrder(ordr);
                        } else {
                            showToast("Error during Order status change");
                        }
                    }).catch(async err => {
                        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                            { showToast("Please sign in again") }
                            await AsyncStorage.clear();
                            props.navigation.navigate('StartScreen');
                        } else if (err.response && err.response.status === 400) {
                            showToast("Error during Order status change");
                        } else {
                            showToast("No connection available");
                        }
                    });
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
                    <Text style={{ marginLeft: 5 }}>Change Status:</Text>
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
                    <Text style={{ marginLeft: 5 }}>Change Status:</Text>
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
                    <Text style={{ marginLeft: 5 }}>Change Status:</Text>
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
        return (
            <View>
                <ListItem style={{ marginLeft: 0 }}
                    // onPress={() => (item.photo && item.photo !== '') ?
                    //     openImage(item) : null}
                    id={item.order_item}
                    >
                    <Body style={{ flex: 0.8 }}>
                        <Text note>
                            Item {index + 1}:
                        </Text>
                        <Text>
                            {item.product_desc}
                        </Text>
                    </Body>
                    <Right style={{ flex: 0.2 }}>
                        {(item.photo && item.photo !== '') ?
                            <Icon name="ios-attach" color='gray' />
                            : null
                        }
                    </Right>
                </ListItem>
            </View>
        )
    };

    const RenderList = () => {
        return (
            <Container>
                <View style={styles.viewContent}>
                    <FlatList
                        data={order}
                        renderItem={renderItem}
                        keyExtractor={item => item.order_item.toString()}>
                    </FlatList>
                </View>
            </Container>
        );
    };

    const RenderPage = () => (
        <Container>
            <Content padder>
                <Grid>
                    <Col style={styles.startCols}>
                        <Text style={{ marginLeft: 5 }}>
                            {order[0].name}
                        </Text>
                        <RenderDate date={new Date(order[0].creation_date)} />
                    </Col>
                </Grid>
                <View style={{ alignItems: 'center', marginVertical: 15 }}>
                    {
                        (order[0].total_price) ?
                            <Text style={{ marginBottom: 5 }}>{order[0].total_price} € </Text>
                            : null
                    }
                    {StatusOrder(order[0].status)}
                </View>
                {RenderActionButtons()}
            </Content>
            <RenderList />
        </Container>
    );

    const openImage = (item) => {
        props.navigation.navigate('FullScreenImage', {
            order: item
        });
    };

    return (
        <Container>
            <CustomHeaderBack {...props} />
            {(loading || !order[0]) ?
                <Spinner color='#F4B13E' /> :
                RenderPage()
            }
        </Container>
    )
};

const styles = StyleSheet.create({
    container: {
    },
    startCols: {
        justifyContent: 'center',
        marginTop: 5
    },
    mainHeader: {
        backgroundColor: 'white',
        height: 60
    },
    body: {
        flex: 1,
        alignItems: 'center'
    },
    pharmacyName: {
        color: 'black'
    },
    left: {
        flex: 1
    },
    right: {
        flex: 1
    },
    headerTitle: {
        marginStart: 5,
        marginTop: 5,
        backgroundColor: 'white',
        borderWidth: 0,
        height: 35,
        alignItems: 'flex-start'
    },
    titlePage: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    button: {
        marginTop: '2%',
        backgroundColor: '#F4B13E'
    },
    buttonCanceled: {
        marginTop: '2%'
        // borderColor: 'red'
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
        fontSize: 13,
    },
    statusYellow: {
        color: '#f0ad4e',
        fontSize: 13,
    },
    statusGreen: {
        color: '#5cb85c',
        fontSize: 13,
    },
    statusRed: {
        color: '#d9534f',
        fontSize: 13,
    },
});

export default getOrderDetail;