import LoginPage from '../../support/pages/LoginPage';
import HomeProductsPage from '../../support/pages/HomeProductsPage';
import SignupPage from '../../support/pages/SignupPage';

const { faker } = require('@faker-js/faker');

describe('User Login Process using the ui', () => {
    let userCredentials; // Declare a variable to hold your fixture data

    before(() => {
        // Load the fixture data ONCE before all tests in this describe block
        cy.fixture('login').then((data) => {
            // Assign the entire data object directly, as email and password are root properties
            userCredentials = data;
        });
    });

    beforeEach(() => {
        LoginPage.actions.visitLoginPage();
    });

    // --- Test Case 1: Basic Login process --- ✅
    it('validate successful login', () => {
        // Use the loaded credentials
        LoginPage.actions.fillLoginForm(userCredentials.email, userCredentials.password);
        LoginPage.actions.submitLoginForm();
        HomeProductsPage.actions.visitHomePage();
        cy.wait(2000);
        //LoginPage.actions.assertLoginSuccess();
    });

    // --- Test Case 2: Login wrong credentials process --- ✅
    it('validate wrong login credentials', () => {
        LoginPage.actions.fillLoginForm(faker.internet.email(), faker.internet.password());
        LoginPage.actions.submitLoginForm();
        LoginPage.actions.assertWrongCredentialsError();
    });

    // --- Test Case 3: Sign up process, from the login page --- ✅
    it('validate the sign up process from the login page', () => {
        LoginPage.actions.clickSignupLink();
        cy.wait(200);
        SignupPage.elements.emailInput().should('be.visible');

        const uniqueEmail = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({
            length: 10,
            pattern: /[A-Z]/
        });

        SignupPage.actions.fillSignupForm(uniqueEmail, name, password, password);
        SignupPage.actions.submitSignupForm();
        cy.wait(500);
        SignupPage.actions.assertSignupSuccess();
    });

    // --- Test Case 4: Basic logout process --- ✅
    it('validate the logout option', () => {
        // Use the loaded credentials
        LoginPage.actions.fillLoginForm(userCredentials.email, userCredentials.password);
        LoginPage.actions.submitLoginForm();
        LoginPage.actions.assertLoginSuccess();

        LoginPage.actions.clickLogoutLink();
        LoginPage.actions.assertLoggedOut();
    });
});