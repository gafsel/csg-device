import { getDeviceId } from './deviceStorage';
import deviceInfo from './deviceInfo';

export const DEVICE_ID_HEADER_NAME = 'X-GCS-ALG-DEVICE-ID';
export const DEVICE_INFO_HEADER_NAME = 'X-GCS-ALG-DEVICE-INF';

const getDeviceHeaders = async () => {
    return {
        [DEVICE_ID_HEADER_NAME]: getDeviceId(),
        [DEVICE_INFO_HEADER_NAME]: await deviceInfo.buildDeviceInfo(),
    };
};

export default {
    getDeviceHeaders: getDeviceHeaders
}
