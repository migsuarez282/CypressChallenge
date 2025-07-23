import utilities from '../utilities';

class LoginPageElements {
    emailInput() {
        return utilities.getByName('email');
    }

    passwordInput() {
        return utilities.getByName('password');
    }

    loginButton() {
        return utilities.getByCssSelector('submit-login');
    }
     signupLink() {
        return cy.get('.text-md.underline');
    }

    logoutLink() {
        return cy.get("ul.hidden a[href='/auth/logout']");
    }
    loginLinkAfterLogout() {
        return cy.get("a[href='/auth/login']");
    }
     // SweetAlert (swal2) elements for success/error messages
    swal2XMark() {
        return cy.get('.swal2-x-mark');
    }

    swal2ConfirmButton() {
        return cy.get('.swal2-confirm');
    }

    swal2SuccessRing() {
        return cy.get('.swal2-success-ring');
    }
    
}

export default new LoginPageElements();