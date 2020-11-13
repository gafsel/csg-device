import {createSnapshot, handleError} from "./cameraHelpers";
import {addCameraShot} from "./cameraStorage";

jest.mock('./cameraHelpers');
jest.mock('./cameraStorage');

test('open works', async () => {
    const cameraFeatures = require('./cameraFeatures');
    const {requestCameras, getAsBestResolution} = require('./cameraHelpers');

    const camerasCallback = jest.fn();
    const errorCallback = jest.fn();

    const mockCameras = {front: {}};

    requestCameras.mockImplementation((callback) => {
        expect(callback).toBe(errorCallback);
        return new Promise(resolve => resolve(mockCameras));
    });

    getAsBestResolution.mockImplementation((camera, callback) => {
       expect(camera).toBe(mockCameras.front);
       expect(callback).toBe(errorCallback);
       return new Promise(resolve => resolve({stream: 'image'}));
    });

    camerasCallback.mockImplementation((cameras) => {
       expect(cameras).toBe(mockCameras);
    });

    await cameraFeatures.default.open(camerasCallback, errorCallback);

    expect(errorCallback).toBeCalledTimes(0);
    expect(requestCameras).toBeCalledTimes(1);
    expect(getAsBestResolution).toBeCalledTimes(1);
    expect(camerasCallback).toBeCalledTimes(1);
});

test('open fails', async () => {
    const cameraFeatures = require('./cameraFeatures');
    const {requestCameras, getAsBestResolution, handleError} = require('./cameraHelpers');

    const camerasCallback = jest.fn();
    const errorCallback = jest.fn();

    requestCameras.mockImplementation((callback) => {
        return new Promise((_, reject) => reject(new Error()));
    });

    await cameraFeatures.default.open(camerasCallback, errorCallback);

    expect(handleError).toBeCalledTimes(1);
    expect(requestCameras).toBeCalledTimes(1);
    expect(getAsBestResolution).toBeCalledTimes(0);
    expect(camerasCallback).toBeCalledTimes(0);
});

test('close works', async () => {
    const cameraFeatures = require('./cameraFeatures');
    const {getVideoElement} = require('./cameraHelpers');

    const tracks = [
        {
            stop: jest.fn(),
        },
        {
            stop: jest.fn(),
        },
        {
            stop: jest.fn(),
        }
    ];
    const video = {
        srcObject: {
            getTracks: () => tracks
        }
    };

    getVideoElement.mockImplementation((callback) => {
        return video;
    });

    await cameraFeatures.default.close();

    expect(video.srcObject).toBeUndefined();
    for (const track of tracks) {
        expect(track.stop).toBeCalledTimes(1);
    }
});

test('takeShot works', async () => {
    const cameraFeatures = require('./cameraFeatures');
    const {createSnapshot} = require('./cameraHelpers');
    const {addCameraShot} = require('./cameraStorage');

    const testId = Math.random().toString();
    const testCaseSnapshot = 'snapshotTestCase' + Math.random();
    const successCallback = jest.fn();
    const errorCallback = jest.fn();

    createSnapshot.mockImplementation((callback) => {
        return testCaseSnapshot;
    });

    addCameraShot.mockImplementation((id, snapshot, success, error) => {
        expect(id).toBe(testId);
        expect(snapshot).toBe(testCaseSnapshot);
        expect(success).toBe(successCallback);
        expect(error).toBe(errorCallback);
    });

    cameraFeatures.default.takeShot(testId, successCallback, errorCallback);

    expect(errorCallback).toBeCalledTimes(0);
    expect(createSnapshot).toBeCalledTimes(1);
    expect(addCameraShot).toBeCalledTimes(1);
});

test('takeShot fails', async () => {
    const cameraFeatures = require('./cameraFeatures');
    const {createSnapshot, handleError} = require('./cameraHelpers');
    const {addCameraShot} = require('./cameraStorage');

    const testId = Math.random().toString();
    const successCallback = jest.fn();
    const errorCallback = jest.fn();

    createSnapshot.mockImplementation((callback) => {
        throw new Error();
    });

    cameraFeatures.default.takeShot(testId, successCallback, errorCallback);

    expect(handleError).toBeCalledTimes(1);
    expect(createSnapshot).toBeCalledTimes(1);
    expect(addCameraShot).toBeCalledTimes(0);
});
