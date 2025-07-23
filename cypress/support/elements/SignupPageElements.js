import utilities from '../utilities';

class SignupPageElements {
    emailInput() {
        return utilities.getByName('email');
    }

    nameInput() {
        return utilities.getByName('name');
    }

    passwordInput() {
        return utilities.getByName('password');
    }

    repeatPasswordInput() {
        return utilities.getByName('repeatPassword');
    }

    signupButton() {
        return utilities.getByCssSelector('submit-signup');
    }

    passwordMismatchError() {
        return cy.contains('Las contraseñas no coinciden');
    }

    passwordLengthError() {
        return cy.contains('La contraseña debe tener al menos 8 caracteres');
    }

    loginLink() {
        return cy.get('.text-md.underline');
    }
    // SweetAlert (swal2) elements
    swal2SuccessRing() {
        return cy.get('.swal2-success-ring');
    }

    swal2ConfirmButton() {
        return cy.get('.swal2-confirm');
    }
    swal2XMark() { // For general error pop-ups (e.g., email already registered)
        return cy.get('.swal2-x-mark');
    }
    emailAlreadyRegisteredError() {
        // This usually triggers a swal2, but if there's an inline error, add its selector
        return cy.get('[data-at="email-registered-error"], .error-message-email-registered');
    }
}

export default new SignupPageElements();