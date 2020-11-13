import {getDeviceId} from "./deviceStorage";

test('device id is uuid v4', async () => {
    expect(getDeviceId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});

test('device id is stored on localStorage', async () => {
    const deviceId = getDeviceId();

    expect(localStorage.getItem('gcs_al_device')).toEqual(deviceId);
});
