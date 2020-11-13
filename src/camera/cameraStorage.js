import { sessionStorage } from '../storage/index';
import {
    handleError
} from './cameraHelpers';

const CAMERA_SHOTS_PREFIX = "al-camera-shot_";

export function addCameraShot(shotId, shot, { successCallback, errorCallback }) {
    try {
        sessionStorage.setItem(getCameraItemId(shotId), shot)
        if (typeof successCallback === 'function') {
            successCallback(shotId);
        }
    } catch (error) {
        if (typeof errorCallback === 'function') {
            handleError(error, errorCallback);
        }
    }
}

function getCameraShot(shotId) {
    return sessionStorage.getItem(getCameraItemId(shotId));
}

function clearCameraShot(shotId) {
    sessionStorage.removeItem(getCameraItemId(shotId));
}

function getCameraItemId(shotId) {
    return `${CAMERA_SHOTS_PREFIX}${shotId}`;
}

const cameraStorage = {
    getShot: getCameraShot,
    clearShot: clearCameraShot,
}

export default cameraStorage;
