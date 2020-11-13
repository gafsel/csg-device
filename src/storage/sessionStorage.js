function setSessionItem(key, value) {
    window.sessionStorage.setItem(key, value);
}

function getSessionItem(key) {
    return window.sessionStorage.getItem(key);
}

function removeSessionItem(key) {
    window.sessionStorage.removeItem(key);
}

function hasSessionKey(key) {
    let has = false;
    if (key !== undefined && window.sessionStorage.getItem(key) !== null) {
        has = true;
    }
    return has;
}

function setSerializableItem(key, value) {
    let serializedValue = null;

    if (value !== undefined) {
        serializedValue = JSON.stringify(value);
    }

    sessionStorage.setItem(key, serializedValue);
}

function getSerializableItem(key) {
    let value = null;

    if (key !== undefined) {
        const serializedValue = sessionStorage.getItem(key);
        if (serializedValue !== null) {
            value = JSON.parse(serializedValue);
        }
    }

    return value;
}

export default {
    setItem: setSessionItem,
    getItem: getSessionItem,
    removeItem: removeSessionItem,
    hasKey: hasSessionKey,
    setSerializableItem: setSerializableItem,
    getSerializableItem: getSerializableItem,
    removeSeriazableItem: removeSessionItem,
    hasSeriazableKey: hasSessionKey,
};
