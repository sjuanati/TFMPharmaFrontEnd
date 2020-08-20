import { Alert, ErrorHandlerCallback } from 'react-native';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/actions/pharmacy';
import AsyncStorage from '@react-native-community/async-storage';
import { AxiosError } from 'axios';

const HandleAxiosErrors = async (err: AxiosError) => {

    const dispatch = useDispatch();

    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        Alert.alert('Please sign in again');
        await AsyncStorage.clear();
        dispatch(setToken(null));
    } else if (err.response && err.response.status === 400) {
        Alert.alert('Error found');
    } else {
        Alert.alert('Connection not available');
    }
};

export default HandleAxiosErrors;
