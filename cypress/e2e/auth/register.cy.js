import SignupPage from '../../support/pages/SignupPage';
import LoginPage from '../../support/pages/LoginPage';
//import AlertPage from '../pages/AlertPage'; // AlertPage remains similar as it's small
const { faker } = require('@faker-js/faker');

describe('User Registration Process', () => {

    beforeEach(() => {
        SignupPage.actions.visitSignupPage(); // Use the action to visit the page
    });
    

     // --- Test Case 1: Validate Successful Signup ---
    it('validate successful signup with valid input fields', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        // Ensure the password meets criteria if your app has them (e.g., length, uppercase)
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertSignupSuccess(); // Abstracted success validation
    });

    // --- Test Case 2: Validate Signup with Already Registered Email ---
    it('validate signup fails with an email that is already registered', () => {
        const email = 'usertotest4@gmail.com'; // Use a known existing email
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });

        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertEmailAlreadyRegisteredError(); // Abstracted error validation
    });

    // --- Test Case 3: Validate Signup with Mismatched Passwords ---
    it('validate signup fails with different passwords', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10, pattern: /[A-Z]/ });
        const repeatPassword = faker.internet.password({ length: 10, pattern: /[A-Z]/ }); // Ensure different

        SignupPage.actions.fillSignupForm(email, name, password, repeatPassword);
        
        // Assert the inline error message for password mismatch directly
        SignupPage.actions.assertPasswordMismatchError();
        
        // Attempt to submit, then assert no success modal appears
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertNoSuccessModalAppears();
    });

    // --- Test Case 4: Validate Signup with Wrong Password Format (e.g., too short) ---
    it('validate signup fails with wrong password format', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = '123'; // Invalid password (too short)
        const repeatPassword = faker.internet.password({ length: 10, pattern: /[A-Z]/ }); // A valid repeat for mismatch

        SignupPage.actions.fillSignupForm(email, name, password, repeatPassword);
        
        // Assert the inline error message for password length
        SignupPage.actions.assertPasswordFormatError();
        
        // Assert the inline error message for password mismatch (if repeatPassword is different)
        SignupPage.actions.assertPasswordMismatchError();

        // Attempt to submit, then assert no success modal appears
        SignupPage.actions.submitSignupForm();
        SignupPage.actions.assertNoSuccessModalAppears();
    });

    // --- Test Case 5: Validate Navigation to Login and Login from Signup Page ---
    it('validate navigation to login page and successful login from signup page', () => {
        SignupPage.actions.clickLoginLink();

        // Replace cy.wait with assertion for element visibility on the login page
        LoginPage.elements.emailInput().should('be.visible'); // Ensure the login form is loaded
        cy.wait(200)
        // Proceed with login using LoginPage actions
        LoginPage.actions.fillLoginForm('huge.test@gmail.com', 'Huge2025.');
        LoginPage.actions.submitLoginForm();
        LoginPage.actions.assertLoginSuccess(); // Assert successful login
    });


/*
    it('validate input fields successful signup', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password();

        SignupPage.elements.emailInput().should('be.visible'); // Assert element visibility
        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        cy.wait(2000)
        cy.get('.swal2-success-ring').should('be.visible')
        cy.get('.swal2-confirm').should('be.visible')
        .click()

    });

    it('validate input fields email already registered', () => {
        const email = 'usertotest4@gmail.com'; // Use a known existing email
        const name = faker.person.fullName();
        const password = faker.internet.password();

        SignupPage.elements.emailInput().should('be.visible');
        SignupPage.actions.fillSignupForm(email, name, password, password);
        SignupPage.actions.submitSignupForm();
        cy.get('.swal2-x-mark').should('be.visible')
        cy.get('.swal2-confirm').should('be.visible')
        .click()

    });

    it('validate input fields different passwords', () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password();
        const repeatPassword = faker.internet.password();

        SignupPage.elements.emailInput().should('be.visible');
        SignupPage.actions.fillSignupForm(email, name, password, repeatPassword);
        
        SignupPage.elements.passwordMismatchError().should('be.visible'); // Assert the error directly
        SignupPage.actions.submitSignupForm(); // Click submit even if fields are invalid to confirm no submission
    });

    it('validate input fields wrong password format', () => {
        const name = faker.person.fullName();
        const password = '123'; // Invalid password
        const repeatPassword = faker.internet.password();

        SignupPage.elements.nameInput().should('be.visible');
        SignupPage.elements.nameInput().type(name); // Type name first
        SignupPage.elements.passwordInput().type(password); // Type invalid password

        SignupPage.elements.passwordLengthError().should('be.visible'); // Assert the length error
        
        SignupPage.elements.repeatPasswordInput().type(repeatPassword);
        SignupPage.elements.passwordMismatchError().should('be.visible'); // Assert password mismatch after typing repeat

        SignupPage.actions.submitSignupForm(); // Attempt to submit with invalid data
    });

    it('validate the login process from the signup page', () => {
        SignupPage.actions.clickLoginLink();
        cy.wait(2000); // Consider using cy.intercept or waiting for an element instead of fixed wait

        LoginPage.elements.emailInput().should('be.visible');
        LoginPage.actions.fillLoginForm('huge.test@gmail.com', 'Huge2025.');
        LoginPage.actions.submitLoginForm();

        LoginPage.elements.logoutLink().should('be.visible'); // Assert that the logout link is visible after login
    });*/
});