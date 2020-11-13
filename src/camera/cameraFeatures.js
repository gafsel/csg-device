import { addCameraShot } from './cameraStorage';
import {
  handleError,
  handleSuccess,
  getVideoElement,
  createSnapshot,
  getAsBestResolution,
  requestCameras,
} from './cameraHelpers';

async function applyCamera(camera, errorCallback, successCallback) {
  try {
    closeCamera();
    const result = await getAsBestResolution(camera, errorCallback);
    if (result.stream) {
      handleSuccess(result.stream);
      if (typeof successCallback === 'function') {
        successCallback(result.stream);
      }
    }
  } catch (error) {
    handleError(error, errorCallback);
  }
}

async function openCamera(camerasCallback, errorCallback) {
  try {
    const cameras = await requestCameras(errorCallback);
    if (cameras.front) {
      camerasCallback(cameras);
      await applyCamera(cameras.front, errorCallback);
    }
  } catch (error) {
    handleError(error, errorCallback);
  }
}

function closeCamera() {
  const video = getVideoElement();
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(function(track) {
      track.stop();
    });
    video.srcObject = undefined;
  }
}

function takeCameraShot(shotId, successCallback, errorCallback) {
  try {
    const snapshot = createSnapshot(errorCallback);
    if (snapshot) {
      addCameraShot(shotId, snapshot, { 
        successCallback,
        errorCallback
      });
    }
  } catch (error) {
    handleError(error, errorCallback);
  }
}

const cameraFeatures = {
  open: openCamera,
  close: closeCamera,
  takeShot: takeCameraShot,
  change: applyCamera,
};

export default cameraFeatures;
