import {default as cameraStorage, addCameraShot} from './cameraStorage';

test('cameraStorage is valid', () => {
    const id = Math.random().toString();
    const data = Math.random().toString();

    expect(cameraStorage.getShot(id)).toBeNull();

    addCameraShot(id, data, {});

    expect(cameraStorage.getShot(id)).toBeDefined();

    expect(cameraStorage.getShot(id)).toBe(data);

    cameraStorage.clearShot(id);

    expect(cameraStorage.getShot(id)).toBeNull();

});

test('addCameraShot callbacks work', () => {
    const id = Math.random().toString();
    const data = Math.random().toString();

    const successCallback = jest.fn();

    addCameraShot(id, data, {successCallback});

    expect(successCallback).toBeCalledTimes(1);
});
