import {default as deviceInfo} from '../../src/device/deviceInfo';

test('device info is a Base64 encoded JSON', async () => {
    const base64 = await deviceInfo.buildDeviceInfo();

    const obj = JSON.parse(atob(base64));

    expect(typeof obj).toBe('object');

    expect(obj.userAgent).toBeDefined();

    expect(obj.screenResolution).toBeDefined();

    expect(obj.location).toBeDefined();

    expect(obj.language).toBeDefined();
});

test('custom info is serialized', async () => {
    deviceInfo.addDeviceInfo({
        customData: 'customData'
    });

    const base64 = await deviceInfo.buildDeviceInfo();

    const obj = JSON.parse(atob(base64));

    expect(typeof obj).toBe('object');

    expect(obj.userAgent).toBeDefined();

    expect(obj.screenResolution).toBeDefined();

    expect(obj.location).toBeDefined();

    expect(obj.language).toBeDefined();

    expect(obj.customData).toBeDefined();

    expect(obj.customData).toBe('customData');
});

test('get info with no location', async () => {
    const base64 = await deviceInfo.buildDeviceInfo({getLocation: false});

    const obj = JSON.parse(atob(base64));

    expect(typeof obj).toBe('object');

    expect(obj.userAgent).toBeDefined();

    expect(obj.screenResolution).toBeDefined();

    expect(obj.location).toBeUndefined();

    expect(obj.language).toBeDefined();
});
