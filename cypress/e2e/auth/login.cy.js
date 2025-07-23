import LoginPage from '../../support/pages/LoginPage';

import HomeProductsPage from '../../support/pages/HomeProductsPage';
import SignupPage from '../../support/pages/SignupPage'; // Reuse from previous refactoring

const { faker } = require('@faker-js/faker');

// It's generally better to define test data within or near the tests that use it,
// or in a fixtures file if it's static and shared across many tests.
// For dynamic data like emails, generating it in the test is best.
// const users = require('../../fixtures/challenge.json'); // Keep if you use it for other tests

describe('User Login Process', () => {

    beforeEach(() => {
        LoginPage.actions.visitLoginPage(); // Use action to visit login page
    });
    
     // --- Test Case 1: Basic Login process --- ✅
it.only('validate successful login', () => {
    // Phase 1: Fill out the login form
    // Input a valid email and password into the respective fields.
    LoginPage.actions.fillLoginForm('huge.test@gmail.com', 'Huge2025.');

    // Phase 2: Submit the form
    // Click the login button to attempt authentication.
    //LoginPage.actions.submitLoginForm();
    HomeProductsPage.actions.visitHomePage(); 

    // Phase 3: Validate successful login
    // Assert that the user is successfully logged in, typically by verifying the presence of a logout link or dashboard element.
    LoginPage.actions.assertLoginSuccess();
});

// --- Test Case 2: Login wrong credentials process --- ✅
it('validate wrong login credentials', () => {
    // Phase 1: Fill out the login form with invalid data
    // Use Faker.js to generate random, non-existent email and password to ensure invalid credentials.
    LoginPage.actions.fillLoginForm(faker.internet.email(), faker.internet.password());

    // Phase 2: Submit the form
    // Click the login button to attempt authentication with incorrect details.
    LoginPage.actions.submitLoginForm();

    // Phase 3: Validate error message
    // Assert that an error message (e.g., a SweetAlert modal) is displayed, indicating failed login,
    // and then dismiss it.
    LoginPage.actions.assertWrongCredentialsError();
});

// --- Test Case 3: Sign up process, from the login page --- ✅
it('validate the sign up process from the login page', () => {
    // Phase 1: Navigate to the signup page
    // Click the "Sign Up" link on the login page to transition to the registration form.
    LoginPage.actions.clickSignupLink();

    // Add a small wait to allow for navigation or initial rendering of the signup page.
    // Ideally, replace this with an assertion for a specific element's visibility on the signup page.
    cy.wait(200);

    // Phase 2: Prepare and fill out the signup form
    // Assert that the email input field on the signup page is visible, confirming readiness.
    SignupPage.elements.emailInput().should('be.visible');

    // Generate unique user data for registration to avoid conflicts and ensure test isolation.
    const uniqueEmail = faker.internet.email();
    const name = faker.person.fullName();
    // Generate a strong password that meets common criteria (e.g., length, uppercase)
    const password = faker.internet.password({
        length: 10,
        pattern: /[A-Z]/
    });

    // Fill all required fields in the signup form.
    SignupPage.actions.fillSignupForm(uniqueEmail, name, password, password);

    // Phase 3: Submit the signup form
    // Click the signup button to attempt user registration.
    SignupPage.actions.submitSignupForm();

    // Phase 4: Validate successful signup
    // Assert that a success message (e.g., a SweetAlert modal) is displayed,
    // confirming the new user account has been created, and then dismiss it.
     cy.wait(500);
    SignupPage.actions.assertSignupSuccess();
});

// --- Test Case 4: Basic logout process --- ✅
it('validate the logout option', () => {
    // Phase 1: Log in as a prerequisite for logout
    // Fill out the login form with valid credentials.
    LoginPage.actions.fillLoginForm('huge.test@gmail.com', 'Huge2025.');
    // Submit the login form.
    LoginPage.actions.submitLoginForm();
    // Confirm that the login was successful (e.g., by checking for the logout link).
    LoginPage.actions.assertLoginSuccess();

    // Phase 2: Perform logout
    // Click the logout link to sign out of the application.
    LoginPage.actions.clickLogoutLink();

    // Phase 3: Validate successful logout
    // Assert that the user is successfully logged out, typically by verifying the reappearance
    // of the login link or a similar element indicating a non-authenticated state.
    LoginPage.actions.assertLoggedOut();
});


/*
    it('validate successful login', () => {
        LoginPage.elements.emailInput().should('be.visible');
        LoginPage.actions.fillLoginForm('huge.test@gmail.com', 'Huge2025.');
        LoginPage.actions.submitLoginForm();

        LoginPage.elements.logoutLink().should('be.visible'); // Assert that logout link appears
    });

    it('validate wrong login credentials', () => {
        LoginPage.elements.emailInput().should('be.visible');
        LoginPage.actions.fillLoginForm(faker.internet.email(), faker.internet.password());//randon user and password
        LoginPage.actions.submitLoginForm();

        cy.get('.swal2-x-mark').should('be.visible')
        cy.get('.swal2-confirm').should('be.visible')
        .click()
    });

    it('validate the sign up process from the login page', () => {
        LoginPage.elements.signupLink().should('be.visible');
        LoginPage.actions.clickSignupLink(); // Click link to navigate to signup page

        cy.wait(2000); // Consider replacing fixed waits with a specific element to be visible on the signup page, e.g., SignupPage.elements.emailInput().should('be.visible')

        const uniqueEmail = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password()

        SignupPage.elements.emailInput().should('be.visible'); // Assert element on signup page
        SignupPage.actions.fillSignupForm(uniqueEmail, name, password, password);
        SignupPage.actions.submitSignupForm();

        cy.wait(2000)
        cy.get('.swal2-success-ring').should('be.visible')
        cy.get('.swal2-confirm').should('be.visible')
        .click()
    });

    it('validate the logout option', () => {
        // First, log in to be able to log out
        LoginPage.elements.emailInput().should('be.visible');
        LoginPage.actions.fillLoginForm('huge.test@gmail.com', 'Huge2025.');
        LoginPage.actions.submitLoginForm();

        // Now, perform logout
        LoginPage.elements.logoutLink().should('be.visible');
        LoginPage.actions.clickLogoutLink();
        cy.wait(2000); // Consider replacing fixed waits with a specific element to be visible, e.g., LoginPage.elements.loginLinkAfterLogout().should('be.visible')

        LoginPage.elements.loginLinkAfterLogout().should('be.visible'); // Assert that the login link is visible after logout
    });*/
});