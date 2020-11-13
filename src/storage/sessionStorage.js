const setSessionItem = (key, value) => {
    window.sessionStorage.setItem(key, value);
}

const getSessionItem = (key) => {
    return window.sessionStorage.getItem(key);
}

const removeSessionItem = (key) => {
    window.sessionStorage.removeItem(key);
}

const hasSessionKey = (key) => {
    let has = false;
    if (key !== undefined && window.sessionStorage.getItem(key) !== null) {
        has = true;
    }
    return has;
}

const setSerializableItem = (key, value) => {
    let serializedValue = null;

    if (value !== undefined) {
        serializedValue = JSON.stringify(value);
    }

    sessionStorage.setItem(key, serializedValue);
}

const getSerializableItem = (key) => {
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
