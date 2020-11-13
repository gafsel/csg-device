class CameraErrors {
    constructor() {
        this.noDeviceAvailableMessage =
            'Para prosseguir, precisamos acessar sua câmera. Verifique seu dispositivo.';
        this.genericMessage =
            'Estamos com algum problema em nossos sistemas e não conseguimos continuar com essa solicitação. Por favor, tente de novo mais tarde.';
        this.noDeviceAvailable = {
            name: 'NoDeviceAvailable',
            code: 1,
            message: this.noDeviceAvailableMessage,
        };
        this.permissionDenied = {
            name: 'PermissionDenied',
            code: 2,
            message:
                'Para prosseguir, precisamos acessar sua câmera. Verifique suas configurações e autorize o acesso.',
        };
        this.constraintNotSatisfied = {
            name: 'ConstraintNotSatisfied',
            code: 3,
            message: this.noDeviceAvailableMessage,
        };
        this.failToCreateSnapshot = {
            name: 'failToCreateSnapshot',
            code: 4,
            message: 'Não foi possível tirar sua foto. Tente novamente',
        };
        this.quotaExceededError = {
            name: 'QuotaExceededError',
            code: 5,
            message: this.genericMessage,
        };
    }

    isNoDeviceAvailable(code) {
        return this.noDeviceAvailable.code === code;
    }

    isPermissionDenied(code) {
        return this.permissionDenied.code === code;
    }

    isConstraintNotSatisfied(code) {
        return this.constraintNotSatisfied.code === code;
    }

    isFailToCreateSnapshot(code) {
        return this.failToCreateSnapshot.code === code;
    }

    isQuotaExceededError(code) {
        return this.quotaExceededError.code === code;
    }
}

const CAMERA_ERRORS = new CameraErrors();

Object.freeze(CAMERA_ERRORS);

export default CAMERA_ERRORS;
