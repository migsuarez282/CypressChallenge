import SignupPageElements from '../elements/SignupPageElements';

class SignupPageActions {
    visitSignupPage() {
        cy.visit('auth/signup');
    }

    fillSignupForm(email, name, password, repeatPassword) {
        SignupPageElements.emailInput().should('be.visible').type(email);
        SignupPageElements.nameInput().should('be.visible').type(name);
        SignupPageElements.passwordInput().should('be.visible').type(password);
        SignupPageElements.repeatPasswordInput().should('be.visible').type(repeatPassword);
    }

    submitSignupForm() {
        SignupPageElements.signupButton().should('be.visible').click();
    }

    clickLoginLink() {
        SignupPageElements.loginLink().click();
    }
    // Validation Action
    assertSignupSuccess() {
        SignupPageElements.swal2SuccessRing().should('be.visible'); // Assert success icon
        SignupPageElements.swal2ConfirmButton().should('be.visible').click(); // Click OK button
    }
    assertEmailAlreadyRegisteredError() {
        // For SweetAlert error (e.g., email already registered)
        SignupPageElements.swal2XMark().should('be.visible');
        SignupPageElements.swal2ConfirmButton().should('be.visible').click();
    }

    assertPasswordMismatchError() {
        // For inline error message if passwords don't match
        SignupPageElements.passwordMismatchError().should('be.visible');
        // If submitting, you might assert no success modal appears, or a different error modal.
    }

    assertPasswordFormatError() {
        // For inline error message if password format is wrong (e.g., too short)
        SignupPageElements.passwordLengthError().should('be.visible');
    }

    // Generic assertion to confirm no immediate success modal appears if a form is invalid
    assertNoSuccessModalAppears() {
        SignupPageElements.swal2SuccessRing().should('not.exist');
        SignupPageElements.swal2XMark().should('not.exist'); // If no error modal either
    }
}

export default new SignupPageActions();