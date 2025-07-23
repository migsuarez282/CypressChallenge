import LoginPageElements from '../elements/LoginPageElements';

class LoginPageActions {
    visitLoginPage() {
        cy.visit('auth/login');
    }

    fillLoginForm(email, password) {
        LoginPageElements.emailInput().type(email);
        LoginPageElements.passwordInput().type(password);
    }

    submitLoginForm() {
        LoginPageElements.loginButton().should('be.visible').click();
    }
     clickSignupLink() {
        LoginPageElements.signupLink().should('be.visible').click();
    }

    clickLogoutLink() {
        LoginPageElements.logoutLink().should('be.visible').click();
    }
    // Validation Actions
    assertLoginSuccess() {
        LoginPageElements.logoutLink().should('be.visible'); // Assert logout link implies success
    }

    assertWrongCredentialsError() {
        LoginPageElements.swal2XMark().should('be.visible'); // Error X mark
        LoginPageElements.swal2ConfirmButton().should('be.visible').click(); // Click OK button
    }

    assertLoggedOut() {
        LoginPageElements.loginLinkAfterLogout().should('be.visible'); // Assert login link reappears
    }

     // --- Custom commands for API login/signup ---
    apiLogin(email, password) {
        return cy.request({
            method: 'POST',
            url: 'https://api.laboratoriodetesting.com/api/v1/auth/login',
            body: { email, password }
        });
    }

     apiSignup(name, email, password) {
        return cy.request({
            method: 'POST',
            url: 'https://api.laboratoriodetesting.com/api/v1/auth/signup',
            body: { name, email, password }
        });
    }

      apiActivateAccount(token, email) {
        const activationUrl = `https://www.laboratoriodetesting.com/auth/confirm-account?token=RpdSbIGhZz5o0yqKOSuNhXcw5vqT4b&email=${email}`;
        return cy.request({
            method: 'GET',
            url: activationUrl
        });
    }

}

export default new LoginPageActions();