// cypress/support/pages/checkout/CheckoutPageElements.js

import utilities from '../utilities';

class CheckoutPageElements {
    // --- Buyer Information Section ---
    nameInput() {
        return utilities.getByName('name'); // <input name="name">
    }

    lastNameInput() {
        return utilities.getByName('lastname'); // <input name="lastname">
    }

    emailInput() {
        return utilities.getByName('email'); // <input name="email">
    }

    addressInput() {
        return utilities.getByName('address'); // <input name="address">
    }

    countrySelect() {
        return utilities.getById('country'); // <select id="country" name="country">
    }

    // --- Payment Information Section ---
    nameHolderInput() {
        return utilities.getByName('nameHolder'); // <input name="nameHolder">
    }

    cardNumberInput() {
        return utilities.getByName('cardNumber'); // <input name="cardNumber">
    }

    expiryDateInput() {
        return utilities.getByName('expiryDate'); // <input name="expiryDate" type="month">
    }

    securityCodeInput() {
        return utilities.getByName('securityCode'); // <input name="securityCode">
    }

    // --- Submission Button ---
    completePaymentButton() {
        // The button starts disabled, so its classes are important for selection.
        // It does not have a name or data-at in the provided HTML.
        return cy.contains('button', 'Completar Pago').click(); 
        //cy.get('button.bg-primaryColor.text-white.p-3.rounded-lg.w-full.primary-cta-hover');
        // You could also refine it by its text if unique: 
        
    }
     completePaymentButton2() {
        // The button starts disabled, so its classes are important for selection.
        // It does not have a name or data-at in the provided HTML.
        return cy.contains('button', 'Reintentar').click(); 
        //cy.get('button.bg-primaryColor.text-white.p-3.rounded-lg.w-full.primary-cta-hover');
        // You could also refine it by its text if unique: 
        
    }

    // --- Order Summary Section (for validation, read-only) ---
    orderSummaryTotalPrice() {
        // This selector targets the total price in the order summary section.
        // It uses a combination of parent structure and last-child for robustness.
        return cy.get('article.shadow-md.h-fit p.font-bold.text-lg:last-child');
        // A simpler way if text is unique: cy.contains('article.shadow-md', 'Total').next('p');
    }

    // --- SweetAlert (swal2) Messages (assuming common patterns from previous tests) ---
    swal2SuccessMessage() { // Success message/icon
        return cy.get('.swal2-success-ring');
    }

    swal2ErrorMessage() { // Generic error message/icon
        return cy.get('.swal2-x-mark');
    }

    swal2ConfirmButton() { // Confirm button within SweetAlert
        //return cy.get('.swal2-confirm');
        return cy.contains('button', 'Ir a mi cuenta').click(); 
        
    }
      swal2ConfirmButton2() { // Confirm button within SweetAlert
        //return cy.get('.swal2-confirm');
        return cy.contains('button', 'Reintentar').click(); 
        
    }
}

export default new CheckoutPageElements();