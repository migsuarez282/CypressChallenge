import SignupPage from '../../support/pages/SignupPage';
import LoginPage from '../../support/pages/LoginPage';
const { faker } = require('@faker-js/faker');
import LoginPageActions from '../../support/commands/LoginPageActions';

describe('User Registration Process, using th ui', () => {
    let testData;

    before(() => {
        cy.fixture('login').then((data) => {
            testData = data;
        });
    });

    beforeEach(() => {
        SignupPage.actions.visitSignupPage();
    });

    // --- Test Case 1: Validate Successful Signup --- ✅
    it('validate successful signup with valid input fields', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertSignupSuccess();
    });

    // --- Test Case 2: Validate Signup with Already Registered Email --- ✅
    it('validate signup fails with an email that is already registered', () => {
        const email = testData.existingUser.email;
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertEmailAlreadyRegisteredError();
    });

    // --- Test Case 3: Validate Signup with Mismatched Passwords --- ✅
    it('validate signup fails with different passwords', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });
        const repeatPassword = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.fillSignupForm(email, name, password, repeatPassword);
        SignupPage.actions.assertPasswordMismatchError();
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertNoSuccessModalAppears();
    });

    // --- Test Case 4: Validate Signup with Wrong Password Format (e.g., too short) --- ✅
    it('validate signup fails with wrong password format', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = '123';
        const repeatPassword = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.fillSignupForm(email, name, password, repeatPassword);
        SignupPage.actions.assertPasswordFormatError();
        SignupPage.actions.assertPasswordMismatchError();
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertNoSuccessModalAppears();
    });

    // --- Test Case 5: Validate Navigation to Login and Login from Signup Page --- ✅
    it('validate navigation to login page and successful login from signup page', () => {
        SignupPage.actions.clickLoginLink();
        LoginPage.elements.emailInput().should('be.visible');
        cy.wait(200);

        LoginPage.actions.fillLoginForm(testData.loginUser.email, testData.loginUser.password);
        LoginPage.actions.submitLoginForm();
        LoginPage.actions.assertLoginSuccess();
    });

    // --- Test Case 6: Validate Successful Signup and account activation--- ✅
    it('validate successful signup with valid input fields, account activation', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertSignupSuccess();


        const activationUrl = `https://www.laboratoriodetesting.com/auth/confirm-account?token=RpdSbIGhZz5o0yqKOSuNhXcw5vqT4b&email=${email}`;
        cy.log('Account activation URL:', activationUrl);

        cy.visit(activationUrl);
        cy.wait(1500);



    });
});