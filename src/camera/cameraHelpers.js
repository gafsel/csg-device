import CAMERA_ERRORS from './cameraErrors';

const IMAGE_MAX_SIZE = Math.floor(1024 * 1000 * 1);
const IMAGE_QUALITY = 0.98;
const IMAGE_TYPE = 'image/jpeg';
const CONTEXT_TYPE = '2d';

const hdConstraints = {
  video: { width: { min: 1280 }, height: { min: 720 } },
  audio: false,
};

const vgaConstraints = {
  video: { width: { exact: 640 }, height: { exact: 480 } },
  audio: false,
};

export async function getAsBestResolution(camera, errorCallback) {
  let result = undefined;
  try {
    result = await startByConstraints(
      undefined,
      createConstraint(hdConstraints, camera)
    );
    if (result.error && !CAMERA_ERRORS.isPermissionDenied(result.error.code)) {
      result = await startByConstraints(
        errorCallback,
        createConstraint(vgaConstraints, camera)
      );
    }
  } catch (error) {
    handleError(error, errorCallback);
  }
  return result;
}

export async function requestCameras(errorCallback) {
  const cameras = {
    front: undefined,
    back: undefined,
  };
  try {
    if (hasGetUserMedia()) {
      await navigator.mediaDevices
        .enumerateDevices()
        .then(medias => {
          const videoCams = medias.filter(media => {
            return media.kind === 'videoinput';
          });
          if (videoCams.length === 1) {
            cameras.front = videoCams[0];
          } else if (videoCams.length >= 2) {
            cameras.front = videoCams[0];
            cameras.back = videoCams[1];
          }
        })
        .catch(error => {
          handleError(error, errorCallback);
        });
    } else {
      errorCallback(CAMERA_ERRORS.noDeviceAvailable);
    }
  } catch (error) {
    handleError(error, errorCallback);
  }
  return cameras;
}

export function handleSuccess(stream) {
  getVideoElement().srcObject = stream;
}

export function handleError(error, errorCallback) {
  let cameraError = undefined;
  switch (error.name) {
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      cameraError = CAMERA_ERRORS.constraintNotSatisfied;
      break;
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      cameraError = CAMERA_ERRORS.permissionDenied;
      break;
    case 'QuotaExceededError':
      cameraError = CAMERA_ERRORS.quotaExceededError;
      break;
  }

  executeSafeErrorCallback(errorCallback, cameraError);

  return cameraError;
}

export function getVideoElement() {
  return document.querySelector('video');
}

export function createSnapshot(errorCallback) {
  let snapshot = undefined;
  try {
    const videoElement = getVideoElement();
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext(CONTEXT_TYPE).drawImage(videoElement, 0, 0);
    snapshot = getImage(canvas);
    if (snapshot) {
      snapshot = clearSnapshot(snapshot);
      if (isResizeRequired(snapshot)) {
        snapshot = resizeSnapshot(canvas, snapshot, errorCallback);
      }
    }
  } catch (error) {
    errorCallback(CAMERA_ERRORS.failToCreateSnapshot);
  }
  return snapshot;
}

function executeSafeErrorCallback(errorCallback, cameraError) {
  if (typeof errorCallback === 'function' && cameraError) {
    errorCallback(cameraError);
  }
}

function getImage(canvas) {
    return canvas.toDataURL(IMAGE_TYPE, IMAGE_QUALITY);
}

function createConstraint(baseConstraint, camera) {
  let constraint = {
    ...baseConstraint,
  };
  constraint.video.deviceId = { exact: camera.deviceId };
  return constraint;
}

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

async function startByConstraints(
  errorCallback,
  constraint = { video: true, audio: false }
) {
  const result = {};
  try {
    result.stream = await navigator.mediaDevices.getUserMedia(constraint);
  } catch (error) {
    result.error = handleError(error, errorCallback);
  }
  return result;
}

function isResizeRequired(snapshot) {
  return byteCount(snapshot) > IMAGE_MAX_SIZE;
}

function resizeSnapshot(canvas, snapshot, errorCallback) {
  let newSnapshot = undefined;
  try {
    const realSize = byteCount(snapshot);
    const newCanvas = document.createElement('canvas');

    const percentResize = IMAGE_MAX_SIZE / realSize;

    newCanvas.width = canvas.width * percentResize;
    newCanvas.height = canvas.height * percentResize;

    const newCanvasCtx = newCanvas.getContext(CONTEXT_TYPE);

    newCanvasCtx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    newSnapshot = getImage(newCanvas);

    if (newSnapshot) {
      newSnapshot = clearSnapshot(newSnapshot);
    }
  } catch (error) {
    errorCallback(CAMERA_ERRORS.failToCreateSnapshot);
  }
  return newSnapshot;
}

function byteCount(snapshot) {
  return snapshot.split(/%..|./).length - 1;
}

function clearSnapshot(snapshot) {
  return snapshot.replace(`data:${IMAGE_TYPE};base64,`, '');
}
