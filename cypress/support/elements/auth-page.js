// cypress/page-objects/auth-page.js

class AuthPage {
    // --- Login Form Elements ---

    // Email field
    // Select by name attribute, which is very stable for form inputs.
    getUsernameOrEmailField() {
        return cy.get('input[name="email"]');
    }

    // Password field
    // Select by name attribute.
    getPasswordField() {
        return cy.get('input[name="password"]');
    }

    // Login button
    // Select by type="submit" within the form, or by text content.
    getLoginButton() {
        return cy.get('[data-at="submit-login"]');
        // Alternative: return cy.contains('button', 'Acceder');
    }

    // Login Error Message (e.g., for invalid credentials)
    // Uses a data-at attribute, which is ideal for test automation.
    getLoginErrorMessage() {
        return cy.get('[data-at="validation-errors"]');
    }

    // --- Registration Form Elements (if applicable on this page or linked from it) ---
    // If there's a direct link to register on the login page:
    getRegisterLinkOnLoginPage() {
        return cy.contains('a', 'Registrarse'); // Assuming "Registrarse" text on link
    }

    getCerrarsesionLink() {
        return cy.contains('a', 'Cerrar Sesión');
    }
     getMicuentaLink() {
        return cy.contains('a', 'Mi Cuenta');
    }

    // Add other registration fields as needed if you also test registration from this page.
    // E.g., if there's a separate "Registrarse" button on a registration form:
    // getRegisterButton() { return cy.contains('button', 'Registrarse'); }
    // getConfirmPasswordField() { return cy.get('input[name="password_confirmation"]'); }
    
    //Elements for the Error modal message 
    getSweetAlertModal() {
        // This targets the main SweetAlert2 modal container.
        // '.swal2-popup' is a very specific class for SweetAlert2.
        return cy.get('div.swal2-popup');
    }

    getSweetAlertErrorTitle() {
        // Targets the title within the modal (e.g., "Error").
        return this.getSweetAlertModal().find('h2.swal2-title');
    }

    getSweetAlertErrorMessageContent() {
        // Targets the main HTML content area where the detailed message is displayed.
        return this.getSweetAlertModal().find('div.swal2-html-container');
    }

    getSweetAlertConfirmButton() {
        // Targets the primary confirmation button (e.g., "Volver").
        return this.getSweetAlertModal().find('button.swal2-confirm');
    }
    // --- NEW: Registration Form Elements ---
    getNameField() {
        return cy.get('input[name="name"]');
    }

    getConfirmPasswordField() {
        return cy.get('input[name="repeatPassword"]');
    }

    // The registration submit button (on the signup page)
    getRegisterSubmitButton() {
        return cy.get('[data-at="submit-signup"]'); // Assuming it's the only submit button on this page
        // Alternative if you need more specificity:
        // return cy.contains('button', 'Registrarse');
    }
    getSweetAlertGoToLoginButton() {
        // This targets the primary confirmation button specific to the success modal.
        return this.getSweetAlertModal().find('button.swal2-confirm');
        // If there's another button with 'swal2-confirm' in a different context,
        // you might want to be more specific, e.g., by text:
        // return this.getSweetAlertModal().contains('button', 'Ir al login');
    }

    // --- NEW: Inline Validation Error Messages (for individual fields) ---
    // These appear directly below a field.
    // Example: getEmailInlineError() { return cy.get('input[name="email"] + div.text-red-500'); }
    // You might need a more generic way or specific getters for each field if needed.
    // This example gets the div immediately following the password field that is red text
    getPasswordInlineError() {
        return cy.get('input[name="password"] + div.text-red-500');
    }

    getConfirmPasswordInlineError() {
        return cy.get('input[name="password_confirmation"] + div.text-red-500');
    }

}

export default new AuthPage();