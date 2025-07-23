// cypress/support/auth-actions.js

import authPage from '../elements/auth-page';
import mainNavigationPage from '../elements/auth-page'; // Import the new AuthPage object
import mainNavigationActions from '../commands/main-navigation-commands'; // To click Acceder/Registrarse links

class AuthActions {
    /**
     * Navigates directly to the login page URL.
     */
    visitLoginPage() {
        cy.visit('https://www.laboratoriodetesting.com/auth/login');
        // Optional: Add a simple assertion to ensure the login form is present,
        // like waiting for the email field.
        authPage.getUsernameOrEmailField().should('be.visible');
    }

    /**
     * Navigates to the registration page by clicking the 'Registrarse' link in the main navigation.
     * Asserts navigation to '/auth/signup'. (This method remains unchanged as it's not "forced".)
     */
    visitRegisterPage() {
        mainNavigationPage.getRegistrarseLink()
                    .should('be.visible')
                    .and('have.attr', 'href', '/auth/signup')
                    .click(); // Assert the correct href value
        
        //mainNavigationActions.getRegistrarseLink().click();
        //cy.url().should('include', '/auth/signup');
    }

    /**
     * Performs a user login with provided credentials.
     * It now implicitly uses the direct navigation from visitLoginPage().
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     */
    login(email, password) {
        this.visitLoginPage(); // This now directly visits the login URL

        authPage.getUsernameOrEmailField().type(email);
        authPage.getPasswordField().type(password);
        authPage.getLoginButton().click();

        // Add assertions for successful login based on your application's behavior.
        //cy.url().should('not.include', '/auth/login');
        // Example: cy.contains('Bienvenido al Dashboard').should('be.visible');
    }
 assertLoginErrorMessage1(message) {
        authPage.getLoginErrorMessage()
            .should('be.visible')
            .and('contain', 'No pudimos iniciar sesión con estas credenciales. Intenta de nuevo.'); // Check if the error message contains the expected text
    }
    // ... (rest of your methods like assertLoginErrorMessage, register) ...
    validateCerrarsesionLink() {
            authPage.getCerrarsesionLink()
                .should('be.visible')
                .and('have.attr', 'href', '/auth/logout'); // Assert the correct href value
        }
    
        validateMicuentaLink() {
            authPage.getMicuentaLink()
                .should('be.visible')
                .and('have.attr', 'href', '/my-account'); // Assert the correct href value
        }

        //Error modal actions
/**  
 * * @param {string} expectedMessage - The full expected text content of the error message.
   * @param {string} expectedTitle - The expected title of the error modal (defaults to 'Error').
     */
   
    assertLoginErrorMessage(expectedMessage, expectedTitle = 'Error') {
        // 1. Assert the modal itself is visible
        authPage.getSweetAlertModal().should('be.visible');

        // 2. Assert the title of the error modal
        authPage.getSweetAlertErrorTitle()
            .should('be.visible')
            .and('have.text', expectedTitle); // Should be "Error"

        // 3. Assert the main error message content
        authPage.getSweetAlertErrorMessageContent()
            .should('be.visible')
            .and('have.text', expectedMessage); // Your detailed error message

        // 4. Click the 'Volver' button to close the modal
        authPage.getSweetAlertConfirmButton()
            .should('be.visible')
            .and('have.text', 'Volver') // Ensure the button text is "Volver"
            .click();

        // 5. Optional: Assert the modal is no longer visible after clicking the button
        
        authPage.getLoginButton().should('be.visible');
      
       
    }
    visitRegisterPage() {

        cy.visit('https://www.laboratoriodetesting.com/auth/signup');
       
        //mainNavigationActions.validateRegistrarseLink();
        //mainNavigationActions.getRegistrarseLink().click();
        //cy.url().should('include', '/auth/signup');
        // Ensure the registration form elements are visible
        //authPage.getNameField().should('be.visible');
    }

    /**
     * Performs user registration with provided data.
     * @param {object} userData - An object containing all necessary registration data
     * (e.g., { name, email, password, password_confirmation }).
     */
    register(userData) {
        this.visitRegisterPage(); // Navigate to the registration page

        authPage.getNameField().type(userData.name);
        authPage.getUsernameOrEmailField().type(userData.email); // Reusing for email
        authPage.getPasswordField().type(userData.password);
        authPage.getConfirmPasswordField().type(userData.password_confirmation);
        authPage.getRegisterSubmitButton().click();

        // Add general assertions for successful registration here.
        // This is generic; adjust based on your application's behavior after registration.
        // It might automatically log the user in, or redirect to a success page.
        // For this site, it seems to redirect to the homepage and log in automatically:
        //cy.url().should('eq', 'https://www.laboratoriodetesting.com/');
        //mainNavigationActions.validateCerrarSesionLinkIsVisible(); // User is logged in
    }
    /**
     * Asserts that the SweetAlert2 success modal is visible and displays the correct message.
     * Clicks the 'Ir al login' button to close the modal.
     * @param {string} expectedMessage - The expected text content of the success message.
     * @param {string} expectedTitle - The expected title of the success modal (defaults to 'Operación Exitosa').
     */
    assertRegistrationSuccessModal(expectedMessage, expectedTitle = 'Operación Exitosa') {
        // Assert the modal itself is visible and is a success type
        authPage.getSweetAlertModal().should('be.visible').and('have.class', 'swal2-icon-success');

        // Assert the title
        authPage.getSweetAlertErrorTitle() // Reusing the title getter, as it's common
            .should('be.visible')
            .and('have.text', expectedTitle); // Should be "Operación Exitosa"

        // Assert the main success message content
        authPage.getSweetAlertErrorMessageContent() // Reusing the content getter
            .should('be.visible')
            .and('have.text', expectedMessage); // Your detailed success message

        // Click the 'Ir al login' button to close the modal
        authPage.getSweetAlertGoToLoginButton() // Using the new specific getter
            .should('be.visible')
            .and('have.text', 'Ir al login') // Ensure the button text is correct
            .click();

        // Optional: Assert the modal is no longer visible after clicking the button
        //authPage.getSweetAlertModal().should('not.be.visible');

        // After clicking "Ir al login", the page should navigate to the login page.
        cy.url().should('include', '/auth/login');
    }

    /**
     * Asserts that an inline validation error message for a field is visible and contains expected text.
     * @param {Cypress.Chainable} fieldErrorGetter - The getter for the specific inline error element.
     * @param {string} expectedText - The expected text of the inline error message.
     */
    assertInlineErrorIsVisible(fieldErrorGetter, expectedText) {
        fieldErrorGetter.should('be.visible').and('contain', expectedText);
    }
}
export default new AuthActions();