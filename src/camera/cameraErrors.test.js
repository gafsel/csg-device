import {default as CAMERA_ERRORS} from './cameraErrors';

test('CAMERA_ERROR.isNoDeviceAvailable', () => {
    expect(CAMERA_ERRORS.isNoDeviceAvailable(CAMERA_ERRORS.noDeviceAvailable.code)).toBe(true);

    expect(CAMERA_ERRORS.isNoDeviceAvailable(CAMERA_ERRORS.permissionDenied.code)).toBe(false);
    expect(CAMERA_ERRORS.isNoDeviceAvailable(CAMERA_ERRORS.quotaExceededError.code)).toBe(false);
});


test('CAMERA_ERROR.isPermissionDenied', () => {
    expect(CAMERA_ERRORS.isPermissionDenied(CAMERA_ERRORS.permissionDenied.code)).toBe(true);

    expect(CAMERA_ERRORS.isPermissionDenied(CAMERA_ERRORS.noDeviceAvailable.code)).toBe(false);
    expect(CAMERA_ERRORS.isPermissionDenied(CAMERA_ERRORS.constraintNotSatisfied.code)).toBe(false);
});


test('CAMERA_ERROR.isConstraintNotSatisfied', () => {
    expect(CAMERA_ERRORS.isConstraintNotSatisfied(CAMERA_ERRORS.constraintNotSatisfied.code)).toBe(true);

    expect(CAMERA_ERRORS.isConstraintNotSatisfied(CAMERA_ERRORS.permissionDenied.code)).toBe(false);
    expect(CAMERA_ERRORS.isConstraintNotSatisfied(CAMERA_ERRORS.failToCreateSnapshot.code)).toBe(false);
});


test('CAMERA_ERROR.isFailToCreateSnapshot', () => {
    expect(CAMERA_ERRORS.isFailToCreateSnapshot(CAMERA_ERRORS.failToCreateSnapshot.code)).toBe(true);

    expect(CAMERA_ERRORS.isFailToCreateSnapshot(CAMERA_ERRORS.constraintNotSatisfied.code)).toBe(false);
    expect(CAMERA_ERRORS.isFailToCreateSnapshot(CAMERA_ERRORS.quotaExceededError.code)).toBe(false);
});

test('CAMERA_ERROR.isQuotaExceededError', () => {
    expect(CAMERA_ERRORS.isQuotaExceededError(CAMERA_ERRORS.quotaExceededError.code)).toBe(true);

    expect(CAMERA_ERRORS.isQuotaExceededError(CAMERA_ERRORS.failToCreateSnapshot.code)).toBe(false);
    expect(CAMERA_ERRORS.isQuotaExceededError(CAMERA_ERRORS.noDeviceAvailable.code)).toBe(false);
});
