import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { setToken } from '../store/actions/pharmacy';
import { LoginStackScreen } from './StackNavigator';
import { AppTabScreens } from './BottomTabNavigator';

const appNavigator = () => {

    const dispatch = useDispatch();
    const pharmacy = useSelector(state => state.pharmacy);

    useEffect(() => {
        const getToken = async () => dispatch(setToken(await AsyncStorage.getItem('token')));
        getToken();
    }, [])

    return (
        <NavigationContainer>
            {(pharmacy.token == null)
                ? <LoginStackScreen />
                : <AppTabScreens />
            }
        </NavigationContainer>
    )
};

export default appNavigator;
