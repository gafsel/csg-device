import { addCameraShot } from './cameraStorage';
import {
  handleError,
  handleSuccess,
  getVideoElement,
  createSnapshot,
  getAsBestResolution,
  requestCameras,
} from './cameraHelpers';

const applyCamera = async (camera, errorCallback, successCallback) => {
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
};

const openCamera = async (camerasCallback, errorCallback) => {
  try {
    const cameras = await requestCameras(errorCallback);
    if (cameras.front) {
      camerasCallback(cameras);
      await applyCamera(cameras.front, errorCallback);
    }
  } catch (error) {
    handleError(error, errorCallback);
  }
};

const closeCamera = () => {
  const video = getVideoElement();
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(function(track) {
      track.stop();
    });
    video.srcObject = undefined;
  }
};

const takeCameraShot = (shotId, successCallback, errorCallback) => {
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
};

const cameraFeatures = {
  open: openCamera,
  close: closeCamera,
  takeShot: takeCameraShot,
  change: applyCamera,
};

export default cameraFeatures;
