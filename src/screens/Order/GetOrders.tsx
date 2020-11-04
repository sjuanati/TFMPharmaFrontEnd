/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Badge,
    Spinner,
    Header,
    Item,
    Text,
    Container,
    ListItem,
    Right,
    Body,
    Left,
    Icon,
    Input,
} from 'native-base';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import showToast from '../../shared/Toast';
import { httpUrl } from '../../../urlServer';
import { useDispatch } from 'react-redux';
import { useTypedSelector, RootState } from '../../store/reducers/reducer';
import { setModifiedOrder, setOrdersPage } from '../../store/actions/order';
//import handleAxiosErrors from '../../shared/HandleAxiosErrors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderStackParamList } from '../../navigation/StackNavigator';
import { Filter } from '../../shared/Interfaces';

type Props = {
    route: RouteProp<OrderStackParamList, 'Orders'>,
    navigation: StackNavigationProp<OrderStackParamList, 'Orders'>
};
type OrderBase = RootState['order'];

interface Order extends OrderBase {
    header: boolean
}


const GetOrders = (props: Props) => {

    const dispatch = useDispatch();
    const modifiedOrder = useTypedSelector(state => state.order.modifiedOrder);
    const ordersPage = useTypedSelector(state => state.order.ordersPage);
    const pharmacy = useTypedSelector(state => state.pharmacy);
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [originalOrders, setOriginalOrders] = useState<Order[]>([]);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const [filters, setFilters] = useState<Filter>({
        grey: true,
        red: true,
        yellow: true,
        green: true,
    });

    useEffect(() => {
        dispatch(setOrdersPage(true));
    }, []);

    useEffect(() => {
        if (ordersPage) {
            startFunctions()
                .catch(error => {
                    console.warn(JSON.stringify(error));
                });
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [ordersPage]);

    useEffect(() => {
        if (modifiedOrder) {
            startFunctions()
                .catch(error => {
                    console.warn(JSON.stringify(error));
                });
            dispatch(setModifiedOrder(false));
        }
    }, [modifiedOrder]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (!isActive) {
            clearInterval(interval);
        } else {
            interval = setInterval(() => {
                startFunctions()
                    .catch(error => {
                        console.warn(JSON.stringify(error));
                    });
            }, 60000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const startFunctions = async () => {
        try {
            await getOrders();
        } catch (error) {
            throw error;
        }
    };

    const findOrder = (text: string, arrayOrders: Order[], modFilters: Filter) => {
        return new Promise<Order[]>(async (resolve) => {
            if (text !== '') {
                let ordersToFilter = await applyFilter(modFilters, arrayOrders);
                let res = ordersToFilter.filter((ordr) => {
                    let condition = new RegExp(text);
                    return condition.test(ordr.name);
                });
                let initialOrder = { order_id: 0, header: true };
                res.unshift(initialOrder);
                setOrders(res);
                resolve(res);
            } else {
                let ordersList = await applyFilter(modFilters, arrayOrders);
                setOrders(() => ordersList);
                resolve(ordersList);
            }
        });
    };

    const applyFilter = async (filter: Filter, arrayOrders: Order[]) => {
        return new Promise<Order[]>((resolve) => {

            let finalArray: Order[] = [];
            if (filter.grey && filter.red && filter.yellow && filter.green) {
                finalArray = arrayOrders;
            } else if (!filter.grey && !filter.red && filter.yellow && !filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 2 || ordr.status === 4);
            } else if (!filter.grey && !filter.red && !filter.yellow && filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 5);
            } else if (!filter.grey && filter.red && !filter.yellow && !filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 6);
            } else if (filter.grey && !filter.red && !filter.yellow && !filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 1 || ordr.status === 3);
            } else if (!filter.grey && !filter.red && !filter.yellow && !filter.green) {
                finalArray = [];
            }

            let initialItem = finalArray.find((item: Order) => item.order_id === 0);
            if (!initialItem) {
                finalArray.unshift({ order_id: 0, header: true });
            }
            resolve(finalArray);
        });
    };

    const getOrders = async () => {
        return new Promise((resolve) => {

            axios.get(`${httpUrl}/order/get/pharmacy`, {
                params: { pharmacy_id: pharmacy.pharmacy_id },
                headers: { authorization: pharmacy.token },
            }).then(async res => {
                if (res.status === 200 || res.status === 304) {
                    let ordrs = res.data;
                    let initialOrder = [{ order_id: 0, header: true }];
                    setOriginalOrders(() => [...initialOrder, ...ordrs]);
                    await findOrder(searchText, [...initialOrder, ...ordrs], filters);
                    setLoading(false);
                    resolve();
                } else {
                    showToast('There was an error', 'warning');
                }
            }).catch(async err => {
                //handleAxiosErrors(err);
                console.log(err);
                setLoading(false);
            });
        });
    };

    const openOrder = async (item: Order) => {
        if (item) {
            dispatch(setOrdersPage(false));
            props.navigation.navigate('OrderDetail', {
                order_id: item.order_id,
            });
        } else {
            console.log('Error opening Order');
        }
    };

    const renderItem = ({ item }: { item: Order }) => {
        return (
            <View>
                {(item.header) ?
                    <ListItem
                        itemDivider
                        //style={{ marginLeft: 0 }}
                        id={item.order_id.toString()}>
                        <Left style={styles.flex06}>
                            <Text>Order</Text>
                        </Left>
                        <Body style={styles.flex04}>
                            <Text>Status</Text>
                        </Body>
                    </ListItem>
                    :
                    <ListItem
                        //style={{ marginLeft: 0 }}
                        id={item.order_id.toString()}>
                        <Body style={[styles.flex06, styles.paddingLeft5]}>
                            <TouchableOpacity onPress={() => openOrder(item)}>
                                <Text>#{item.order_id_app} - {item.name}</Text>
                                {(item.total_price)
                                    ? <Text note numberOfLines={1}>
                                        {item.total_price} € - <RenderDate date={new Date(item.creation_date)} />
                                    </Text>
                                    : <RenderDate date={new Date(item.creation_date)} />
                                }
                            </TouchableOpacity>
                        </Body>
                        <Body style={styles.flex04}>
                            <TouchableOpacity onPress={() => openOrder(item)}>
                                <StatusOrder status={item.status} />
                            </TouchableOpacity>
                        </Body>
                    </ListItem>
                }
            </View>
        );
    };

    const RenderDate = ({ date }: { date: Date }) => {
        return (
            <Text note>
                {('0' + date.getHours()).slice(-2)}:{('0' + date.getMinutes()).slice(-2)}
                {('0' + date.getDate()).slice(-2)}/{('0' + (date.getMonth() + 1).toString()).slice(-2)}/{(date.getFullYear())}
            </Text>
        );
    };

    const StatusOrder = ({ status }: { status: number }) => {
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

    const onRefresh = () => {
        setIsActive(false);
        setTimeout(async () => {
            setIsActive(true);
            await getOrders();
        }, 400);
    };

    const RenderOrders = () => {
        return (
            <Container>
                {(orders && (orders.length === 0 || orders.length === 1))
                    ? <View style={styles.viewContent}>
                        <Text style={styles.noItems}>
                            No Orders found
                        </Text>
                    </View>
                    : <View style={styles.viewContent}>
                        <FlatList data={orders}
                            initialNumToRender={orders.length}
                            renderItem={renderItem}
                            keyExtractor={item => item.order_id.toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={onRefresh} />
                            } />
                    </View>
                }
            </Container>
        );
    };

    return (
        <Container>
            <Header noShadow style={styles.headerTitle}>
                <Left style={styles.left}>
                    <Text style={styles.titlePage}>
                        Orders
          </Text>
                </Left>
                <Right />
            </Header>
            <Header noShadow searchBar rounded
                style={styles.header}>
                <Item>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Find User"
                            value={searchText}
                            onChangeText={(text) => {
                                setSearchText(text);
                                findOrder(text, originalOrders, filters);
                            }} />
                    </Item>
                </Item>
                {
                    (filters.grey)
                        ? <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.yellow = false;
                                modFilters.green = false;
                                modFilters.red = false;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            }
                        }}>
                            <Badge style={styles.filter}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.grey = true;
                            setFilters(modFilters);
                            const ord = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ord);
                        }}>
                            <Badge style={[styles.filter, styles.opacity]}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                }
                {
                    (filters.yellow)
                        ? <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.grey = false;
                                modFilters.green = false;
                                modFilters.red = false;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            }
                        }}>
                            <Badge warning style={styles.filterBadge}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = true;
                            modFilters.green = false;
                            modFilters.red = false;
                            modFilters.grey = false;
                            setFilters(modFilters);
                            const ord = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ord);
                        }}>
                            <Badge warning style={styles.filterBadgeNonSelected}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                }
                {
                    (filters.green)
                        ? <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.grey = false;
                                modFilters.yellow = false;
                                modFilters.red = false;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            }
                        }}>
                            <Badge success style={styles.filterBadge}>
                                <Icon name="checkmark" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = false;
                            modFilters.green = true;
                            modFilters.red = false;
                            modFilters.grey = false;
                            setFilters(modFilters);
                            const ord = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ord);
                        }}>
                            <Badge success style={styles.filterBadgeNonSelected}>
                                <Icon name="checkmark" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                }
                {
                    (filters.red)
                        ? <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.grey = false;
                                modFilters.yellow = false;
                                modFilters.green = false;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;
                                setFilters(modFilters);
                                const ord = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ord);
                            }
                        }}>
                            <Badge danger style={styles.filterBadge}>
                                <Icon name="close" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = false;
                            modFilters.green = false;
                            modFilters.red = true;
                            modFilters.grey = false;
                            setFilters(modFilters);
                            let ord = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ord);
                        }}>
                            <Badge danger style={styles.filterBadgeNonSelected}>
                                <Icon name="close" style={styles.badge} />
                            </Badge>
                        </TouchableOpacity>
                }
            </Header>
            {(loading)
                ? <Spinner color="#F4B13E" />
                : <RenderOrders />
            }
        </Container>
    );
};

const styles = StyleSheet.create({
    body: {
        height: 80,
        justifyContent: 'center',
    },
    right: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    left: {
        flex: 1,
        justifyContent: 'center',
    },
    searchIcon: {
        fontSize: 25,
    },
    searchButton: {
        backgroundColor: 'white',
    },
    header: {
        marginStart: 5,
        backgroundColor: 'white',
        borderWidth: 0,
    },
    headerTitle: {
        marginStart: 5,
        // marginTop: 5,
        backgroundColor: 'white',
        borderWidth: 0,
        // height: 35,
        height: 80,
        alignItems: 'flex-start',
    },
    titlePage: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    viewContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    noItems: {
        marginTop: 20,
        color: 'gray',
        fontSize: 18,
        textAlign: 'center',
    },
    filterBadge: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15,
    },
    filterBadgeNonSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15,
        opacity: 0.3,
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
    badge: {
        fontSize: 14,
        color: '#fff',
    },
    filter: {
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15,
    },
    opacity: {
        opacity: 0.5,
    },
    flex04: {
        flex: 0.4,
    },
    flex06: {
        flex: 0.6,
    },
    paddingLeft5: {
        paddingLeft: 5,
    },
});

export default GetOrders;
