function setDurableItem(key, value) {
  window.localStorage.setItem(key, value);
}

function geDurableItem(key) {
  return window.localStorage.getItem(key);
}

function removeDurableItem(key) {
  window.localStorage.removeItem(key);
}

function hasDurableKey(key) {
  let has = false;
  if (key !== undefined && window.localStorage.getItem(key) !== null) {
    has = true;
  }

  return has;
}

export default {
  setItem: setDurableItem,
  getItem: geDurableItem,
  removeItem: removeDurableItem,
  hasKey: hasDurableKey,
};
