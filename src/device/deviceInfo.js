const device = {
    data: {},
};

const addDeviceInfo = (info) => {
    const data = device.data;
    device.data = {
        ...data,
        ...info,
    };
};

/**
 *
 * @param config {getLocation: boolean}
 * @returns {Promise<string>}
 */
const buildDeviceInfo = async (config = {getLocation: true}) => {
    const data = device.data;
    const defaultDeviceInfo = await getDefaultDeviceInfo(config);
    const deviceInfo = {
        ...defaultDeviceInfo,
        ...data,
    };
    device.data = {};
    return btoa(JSON.stringify(deviceInfo));
};

const getDefaultDeviceInfo = async (config = {getLocation: true}) => {
    const userAgent = getUserAgent();
    const screenResolution = getScreenResolution();
    const location = config.getLocation ? await getLocation() : undefined;
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
    return new Promise(function (resolve) {
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

export default {
    addDeviceInfo: addDeviceInfo,
    buildDeviceInfo: buildDeviceInfo,
}
