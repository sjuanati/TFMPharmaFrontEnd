import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../store/reducers/reducer';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { setToken } from '../store/actions/pharmacy';
import { LoginStackScreen } from './StackNavigator';
import { AppTabScreens } from './BottomTabNavigator';

const AppNavigator = () => {

    const dispatch = useDispatch();
    const pharmacy = useTypedSelector(state => state.pharmacy);

    useEffect(() => {
        const getToken = async () =>
            dispatch(setToken(await AsyncStorage.getItem('token')));
        getToken();
    }, [dispatch]);

    return (
        <NavigationContainer>
            {pharmacy.token == null ? <LoginStackScreen /> : <AppTabScreens />}
        </NavigationContainer>
    );
};

export default AppNavigator;
