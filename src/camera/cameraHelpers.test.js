import {
    createSnapshot,
    getAsBestResolution,
    getVideoElement,
    handleError,
    handleSuccess,
    requestCameras,
} from './cameraHelpers';
import CAMERA_ERRORS from "./cameraErrors";


function mockMediaDevices(devices, config = {}) {

    const enumerateDevices = jest.fn();
    const getUserMedia = jest.fn();

    getUserMedia.mockImplementation((constraints) => {
        return new Promise((resolve) => resolve(
            devices.find(device => constraints.video.deviceId.exact === device.deviceId)
        ));
    });

    enumerateDevices.mockImplementation(() => {
        return new Promise((resolve) => resolve(devices));
    });

    navigator.mediaDevices = {getUserMedia, enumerateDevices};

    return {getUserMedia, enumerateDevices};
}

test('getVideoElemento is woring', () => {
    expect(getVideoElement()).toBeNull();

    const video = window.document.createElement('video');

    window.document.body.appendChild(video);

    expect(getVideoElement()).toBe(video);

    video.remove();

    expect(getVideoElement()).toBeNull();
});

test('requestCameras when no media/devices', () => {
    const errorCallback = jest.fn();

    const result = requestCameras(errorCallback);

    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.noDeviceAvailable);

    expect(result.front).toBeUndefined();

    expect(result.back).toBeUndefined();
});

test('requestCameras with front camera', async () => {
    const cameraFront = {
        kind: 'videoinput'
    };

    mockMediaDevices([
        cameraFront
    ]);

    const errorCallback = jest.fn();

    const result = await requestCameras(errorCallback);

    expect(errorCallback).toBeCalledTimes(0);

    expect(navigator.mediaDevices.enumerateDevices).toBeCalledTimes(1);

    expect(result.front).toBe(cameraFront);

    expect(result.back).toBeUndefined();
});

test('requestCameras with front and back camera', async () => {
    const cameraFront = {
        kind: 'videoinput'
    };

    const cameraBack = {
        kind: 'videoinput'
    };

    mockMediaDevices([
        cameraFront, cameraBack
    ]);

    const errorCallback = jest.fn();

    const result = await requestCameras(errorCallback);

    expect(errorCallback).toBeCalledTimes(0);

    expect(navigator.mediaDevices.enumerateDevices).toBeCalledTimes(1);

    expect(result.front).toBe(cameraFront);

    expect(result.back).toBe(cameraBack);
});

test('getAsBestResolution is returning the media stream', async () => {
    const cameraFront = {
        deviceId: '1',
        kind: 'videoinput'
    };

    mockMediaDevices([
        cameraFront, {deviceId: '2', kind: 'videioinput'}
    ]);

    const errorCallback = jest.fn();

    const result = await getAsBestResolution(cameraFront, errorCallback);

    expect(navigator.mediaDevices.getUserMedia).toBeCalledTimes(1);

    expect(errorCallback).toBeCalledTimes(0);

    expect(result.stream).toBe(cameraFront);
});

test('getAsBestResolution second attempt', async () => {
    const cameraFront = {
        deviceId: '1',
        kind: 'videoinput'
    };

    const mocks = mockMediaDevices([
        cameraFront, {deviceId: '2', kind: 'videioinput'}
    ]);

    mocks.getUserMedia.mockImplementation((constraints) => {
        return new Promise((_, reject) => {
            reject({name: "QuotaExceededError"});

            mocks.getUserMedia.mockImplementation((constraints) => {
                return new Promise((resolve) => resolve(cameraFront));
            });
        });
    });

    const errorCallback = jest.fn();

    const result = await getAsBestResolution(cameraFront, errorCallback);

    expect(mocks.getUserMedia).toBeCalledTimes(2);

    expect(errorCallback).toBeCalledTimes(0);

    expect(result.stream).toBe(cameraFront);
});

test('getAsBestResolution fail after second attempt', async () => {
    const cameraFront = {
        deviceId: '1',
        kind: 'videoinput'
    };

    const mocks = mockMediaDevices([
        cameraFront, {deviceId: '2', kind: 'videioinput'}
    ]);

    mocks.getUserMedia.mockImplementation((constraints) => {
        return new Promise((_, reject) => {
            reject({name: "QuotaExceededError"});
        });
    });

    const errorCallback = jest.fn();

    const result = await getAsBestResolution(cameraFront, errorCallback);

    expect(mocks.getUserMedia).toBeCalledTimes(2);

    expect(errorCallback).toBeCalledTimes(1);

    expect(result.stream).toBeUndefined();

    expect(result.error).toBeDefined();
});

test('getAsBestResolution permission defined', async () => {
    const cameraFront = {
        deviceId: '1',
        kind: 'videoinput'
    };

    const mocks = mockMediaDevices([
        cameraFront, {deviceId: '2', kind: 'videioinput'}
    ]);

    mocks.getUserMedia.mockImplementation((constraints) => {
        return new Promise((_, reject) => {
            reject({name: "PermissionDeniedError"});
        });
    });

    const errorCallback = jest.fn();

    const result = await getAsBestResolution(cameraFront, errorCallback);

    expect(mocks.getUserMedia).toBeCalledTimes(1);

    expect(errorCallback).toBeCalledTimes(0);

    expect(result.stream).toBeUndefined();

    expect(result.error).toBeDefined();
});


test('handlerErrors works', async () => {
    const errorCallback = jest.fn();
    let result;

    result = handleError({name: 'OverconstrainedError'}, errorCallback);
    expect(result).toBe(CAMERA_ERRORS.constraintNotSatisfied);
    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.constraintNotSatisfied);

    result = handleError({name: 'ConstraintNotSatisfiedError'}, errorCallback);
    expect(result).toBe(CAMERA_ERRORS.constraintNotSatisfied);
    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.constraintNotSatisfied);

    result = handleError({name: 'NotAllowedError'}, errorCallback);
    expect(result).toBe(CAMERA_ERRORS.permissionDenied);
    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.permissionDenied);

    result = handleError({name: 'PermissionDeniedError'}, errorCallback);
    expect(result).toBe(CAMERA_ERRORS.permissionDenied);
    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.permissionDenied);

    result = handleError({name: 'QuotaExceededError'}, errorCallback);
    expect(result).toBe(CAMERA_ERRORS.quotaExceededError);
    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.quotaExceededError);

    result = handleError({name: 'other'}, errorCallback);
    expect(result).toBeUndefined();
    expect(errorCallback).toBeCalledTimes(5);
});

test('handleSuccess works', async () => {
    const blob = new Blob([]);

    const video = window.document.createElement('video');

    window.document.body.appendChild(video);

    handleSuccess(blob);

    expect(video.srcObject).toBe(blob);

    video.remove();
});

test('createSnapshot works', async () => {
    window.HTMLCanvasElement.prototype.getContext = () => ({
        drawImage: () => {
        }
    });
    window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/jpeg;base64,testcase';

    const blob = new Blob([]);

    const video = window.document.createElement('video');
    video.srcObject = blob;

    window.document.body.appendChild(video);

    const errorCallback = jest.fn();

    errorCallback.mockImplementation((error) => {
        console.log(error);
    })

    const snapshot = createSnapshot(errorCallback);

    expect(errorCallback).toBeCalledTimes(0);

    expect(snapshot).toBe('testcase');

    video.remove();
});

test('createSnapshot with error', async () => {
    window.HTMLCanvasElement.prototype.getContext = () => ({
        drawImage: () => {
            throw new Error();
        }
    });

    const blob = new Blob([]);

    const video = window.document.createElement('video');
    video.srcObject = blob;

    window.document.body.appendChild(video);

    const errorCallback = jest.fn();

    errorCallback.mockImplementation((error) => {
        console.log(error);
    })

    const snapshot = createSnapshot(errorCallback);

    expect(errorCallback).toBeCalledTimes(1);

    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.failToCreateSnapshot);

    expect(snapshot).toBeUndefined();

    video.remove();
});

test('createSnapshot resizing', async () => {
    window.HTMLCanvasElement.prototype.getContext = () => ({
        drawImage: () => {
        }
    });
    const bytes = [];
    for (let i=0;i<1024001;i++) {
        bytes.push(i);
    }

    window.HTMLCanvasElement.prototype.toDataURL = () => {
        window.HTMLCanvasElement.prototype.toDataURL = () => {
            return 'data:image/jpeg;base64,resized';
        };

        return 'data:image/jpeg;base64,' + btoa(bytes);
    };

    const blob = new Blob([]);

    const video = window.document.createElement('video');
    video.srcObject = blob;

    window.document.body.appendChild(video);

    const errorCallback = jest.fn();

    errorCallback.mockImplementation((error) => {
        console.log(error);
    })

    const snapshot = createSnapshot(errorCallback);

    expect(errorCallback).toBeCalledTimes(0);

    expect(snapshot).toBe('resized');

    video.remove();
});

test('createSnapshot resizing fail', async () => {
    window.HTMLCanvasElement.prototype.getContext = () => ({
        drawImage: () => {
        }
    });
    const bytes = [];
    for (let i=0;i<1024001;i++) {
        bytes.push(i);
    }

    window.HTMLCanvasElement.prototype.toDataURL = () => {
        window.HTMLCanvasElement.prototype.toDataURL = () => {
            throw new Error()
        };

        return 'data:image/jpeg;base64,' + btoa(bytes);
    };

    const blob = new Blob([]);

    const video = window.document.createElement('video');
    video.srcObject = blob;

    window.document.body.appendChild(video);

    const errorCallback = jest.fn();

    errorCallback.mockImplementation((error) => {
        console.log(error);
    })

    const snapshot = createSnapshot(errorCallback);

    expect(errorCallback).toBeCalledTimes(1);

    expect(errorCallback).toBeCalledWith(CAMERA_ERRORS.failToCreateSnapshot);

    expect(snapshot).toBeUndefined();

    video.remove();
});
