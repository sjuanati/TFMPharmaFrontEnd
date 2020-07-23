import React from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
//import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from '../screens/Home/Home';
import Orders from '../screens/Order/GetOrders';
import OrderDetail from '../screens/Order/GetOrderDetail';
import Profile from '../screens/Profile/Profile';
//import CustomHeader from '../../screenComponents/CustomHeader';
import FullScreenImage from '../screens/Order/getOrderImage';

const homeOrange = require('../assets/images/bottomBar/yellow/home-orange.png');
const homeGrey = require('../assets/images/bottomBar/grey/home-grey.png');
const ordersOrange = require('../assets/images/bottomBar/yellow/list-orange.png');
const ordersGrey = require('../assets/images/bottomBar/grey/list-grey.png');
const profileOrange = require('../assets/images/bottomBar/yellow/user-orange.png');
const profileGrey = require('../assets/images/bottomBar/grey/user-grey.png');


const HomeStack = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
        }
    },
});

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => {
        return focused ?
            <Image
                style={styles.iconHome}
                source={homeOrange} /> :
            <Image
                style={styles.iconHome}
                source={homeGrey} />
    }
};

const OrdersStack = createStackNavigator({
    Orders: {
        screen: Orders,
        navigationOptions: {
            headerShown: false,
        }
    },
    OrderDetail: {
        screen: OrderDetail,
        navigationOptions: {
            headerShown: false,
        }
    },
    FullScreenImage: {
        screen: FullScreenImage,
        navigationOptions: {
            headerShown: false
        }
    }
},
);

OrdersStack.navigationOptions = {
    tabBarLabel: 'Pedidos',
    tabBarIcon: ({ focused }) => {
        return focused ?
            <Image
                style={styles.iconHome}
                source={ordersOrange} /> :
            <Image
                style={styles.iconHome}
                source={ordersGrey} />
    }
};

const ProfileStack = createStackNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: {
            headerShown: false
        }
    }
},
);

ProfileStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ focused, color, size }) => {
        return focused ?
            <Image
                style={styles.iconHome}
                source={profileOrange} /> :
            <Image
                style={styles.iconHome}
                source={profileGrey} />
    }
};

const MainTabNavigator = createBottomTabNavigator({
    HomeStack,
    OrdersStack,
    ProfileStack,
},
    {
        defaultNavigationOptions: {
            // header: props => <CustomHeader {...props} />
        },
        tabBarOptions: {
            activeTintColor: '#F4B13E',
            activeBackgroundColor: '#f0f0f0',
            inactiveTintColor: 'black',
            inactiveBackgroundColor: '#F0F0F0',
            showLabel: false,
            style: {
                height: 60,
                backgroundColor: '#F0F0F0',
                paddingBottom: 5
            }
        }
    }
);

const styles = StyleSheet.create({
    iconHome: {
        width: 30,
        height: 30
    }
});

// const DrawerNavigator = createDrawerNavigator({
//     Home:{
//       screen: MainTabNavigator
//     },
//     Profile: Profile
//   }, {
//     initialRouteName: 'Home',
//     // contentComponent: props => <SideBar {...props} />,
//   }
// );

const DrawerNavigator = createStackNavigator({
    Home: {
        screen: MainTabNavigator
    },
    Profile: Profile
}, {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
        headerShown: false
    }
}
);

export default StackNavigator = createStackNavigator({
    DrawerNavigator: {
        screen: DrawerNavigator
    }
},
    {
        defaultNavigationOptions: {
            headerShown: false
        }
    }
);
