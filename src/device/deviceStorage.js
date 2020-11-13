import * as uuid from 'uuid';
import { durableStorage } from '../storage/index';

const DEVICE_ID_KEY = 'gcs_al_device';
const DUMMY_ID = '0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a';

export function getDeviceId() {
  let deviceId = DUMMY_ID
  try {
    deviceId = durableStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = uuid.v4();
      durableStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
  } catch (err) { }
  return deviceId;
}
