import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home/Home';
import Orders from '../screens/Order/GetOrders';
import OrderDetail from '../screens/Order/GetOrderDetail';
import OrderTrace from '../screens/Order/GetOrderTrace';
import ProductDetail from '../screens/Order/ProductDetail';
import Tokens from '../screens/Tokens/Token';
import Profile from '../screens/Profile/Profile';
import SignIn from '../screens/Login/SignIn';
import SignUp from '../screens/Login/SignUp';

import BackIcon from '../UI/HeaderBackIcon';
import HeaderLogo from '../UI/HeaderLogo';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <HomeStack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: true }} />
    </HomeStack.Navigator>
);

const OrderStack = createStackNavigator();

const OrderStackScreen = () => (
    <OrderStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <OrderStack.Screen
            name="Orders"
            component={Orders}
            options={{ headerShown: true }} />
        <OrderStack.Screen
            name="OrderDetail"
            component={OrderDetail}
            options={{ headerShown: true }} />
        <OrderStack.Screen
            name="OrderTrace"
            component={OrderTrace}
            options={{ headerShown: true }} />
        <OrderStack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{ headerShown: true }} />
    </OrderStack.Navigator>
);

const TokenStack = createStackNavigator();

const TokenStackScreen = () => (
    <TokenStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <TokenStack.Screen
            name="Tokens"
            component={Tokens}
            options={{ headerShown: true }} />
    </TokenStack.Navigator>
);

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: true }} />
    </ProfileStack.Navigator>
);

const LoginStack = createStackNavigator();

const LoginStackScreen = () => (
    <LoginStack.Navigator>
        <LoginStack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }} />
        <LoginStack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }} />
    </LoginStack.Navigator>
);

export {
    HomeStackScreen,
    OrderStackScreen,
    TokenStackScreen,
    ProfileStackScreen,
    LoginStackScreen
}