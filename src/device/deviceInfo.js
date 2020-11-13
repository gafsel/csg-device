const device = {
  data: {},
};

export default function addDeviceInfo(info) {
  const data = device.data;
  device.data = {
    ...data,
    ...info,
  };
}

export async function buildDeviceInfo() {
  const data = device.data;
  const defaultDeviceInfo = await getDefaultDeviceInfo();
  const deviceInfo = {
    ...defaultDeviceInfo,
    ...data,
  };
  device.data = {};
  return btoa(JSON.stringify(deviceInfo));
}

async function getDefaultDeviceInfo() {
  const userAgent = getUserAgent();
  const screenResolution = getScreenResolution();
  const location = await getLocation();
  const language = getLanguage();
  return {
    userAgent,
    screenResolution,
    location,
    language,
  };
}

function getLanguage() {
  return `${navigator.language || navigator.userLanguage}`;
}

function getScreenResolution() {
  return `${window.screen.width},${window.screen.height}`;
}

function getUserAgent() {
  return navigator.userAgent;
}

function getLocation() {
  return new Promise(function(resolve) {
    if ('geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve(`${position.coords.latitude},${position.coords.longitude}`);
          },
          err => {
            resolve(null);
          }
        );
      } catch (ex) {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
}
