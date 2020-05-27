import axios from 'axios';
import { Platform } from 'react-native';
import { httpUrl } from '../../urlServer';

const save = async (type, source, msg, pharmacy, extra) => {

    try {
        extra += ` pharmacy_id: ${pharmacy.pharmacy_id} platform: ${Platform.OS} ${Platform.Version}`;
        await axios.post(`${httpUrl}/log/save`, {
            type,
            source,
            msg,
            extra,
        }, {
            headers: {
                authorization: pharmacy.token,
            }
        })
            .then(response => {
                if (response.data !== '') {
                    const data = response.data;
                    console.log('log recorded: ', data);
                }
            })
            .catch(err => {
                console.log('Error on logRecorder.js -> save() : ', err);
            })
    } catch (err) {
        console.log('Error in logRecorder.js (Pharmacy):', err);
    }

}

export default save;
