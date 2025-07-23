import LoginPage from '../../support/pages/LoginPage';
import HomeProductsPage from '../../support/pages/HomeProductsPage';
import SignupPage from '../../support/pages/SignupPage';

const {
    faker
} = require('@faker-js/faker');

describe('User Registration and Login Process using the ui', () => {

    // --- Test Case 1: Validate Successful Signup and account activation, login--- ✅
    it('validate successful signup with valid input fields, account activation.login', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.visitSignupPage();
        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertSignupSuccess();

        const activationUrl = `https://www.laboratoriodetesting.com/auth/confirm-account?token=RpdSbIGhZz5o0yqKOSuNhXcw5vqT4b&email=${email}`;
        cy.visit(activationUrl);
        cy.wait(1500);

        LoginPage.actions.visitLoginPage();
        LoginPage.actions.fillLoginForm(email, password);
        LoginPage.actions.submitLoginForm();
        HomeProductsPage.actions.visitHomePage();
        cy.wait(5000);
    });
});