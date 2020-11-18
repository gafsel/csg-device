import {default as headers, DEVICE_ID_HEADER_NAME, DEVICE_INFO_HEADER_NAME} from '../../src/device/deviceHeaders';
import {getDeviceId} from "../../src/device/deviceStorage";
import {default as deviceInfo} from '../../src/device/deviceInfo';

test('headers contains id and info', async () => {
    const h = await headers.getDeviceHeaders();

    expect(h[DEVICE_ID_HEADER_NAME]).toBe(getDeviceId());
    expect(h[DEVICE_INFO_HEADER_NAME]).toBe(await deviceInfo.buildDeviceInfo());
});
