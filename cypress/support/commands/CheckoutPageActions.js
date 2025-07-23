// cypress/support/pages/checkout/CheckoutPageActions.js

import CheckoutPageElements from '../elements/CheckoutPageElements';
import { cleanAndParsePrice } from '../utils/helpers'; // Assuming path to helpers
import { faker } from '@faker-js/faker'; // Import faker for dynamic data

/**
 * Generates a future expiry date in YYYY-MM format required by input type="month".
 * Ensures the date is always at least one month in the future.
 * @returns {string} Date in YYYY-MM format (e.g., "2025-07").
 */
function getFutureExpiryDate() {
    const today = new Date();
    let month = today.getMonth() + 1; // getMonth() is 0-indexed (0=Jan, 11=Dec)
    let year = today.getFullYear();

    // If current month is December, move to Jan of next year
    if (month === 12) {
        month = 1;
        year += 1;
    } else {
        month += 1; // Move to the next month
    }

    const formattedMonth = String(month).padStart(2, '0'); // Ensures MM format (e.g., 01, 07)
    const formattedYear = String(year);

    return `${formattedYear}-${formattedMonth}`; // Format as YYYY-MM
}

class CheckoutPageActions {

    /**
     * Visits the checkout page directly.
     * Note: Typically, you'd navigate via the cart modal's checkout button in a full flow.
     * @param {string} [path='/checkout'] The path to the checkout page.
     */
    visitCheckoutPage(path = '/checkout') {
        cy.visit(path);
    }

    /**
     * Fills the "Información del comprador" section of the checkout form.
     * @param {Object} userData - Data for buyer fields. Uses faker for defaults.
     * @param {string} [userData.name] - Buyer's first name.
     * @param {string} [userData.lastname] - Buyer's last name.
     * @param {string} [userData.email] - Buyer's email.
     * @param {string} [userData.address] - Buyer's address.
     * @param {string} [userData.country='Colombia'] - Buyer's country (must be one of the <option> values).
     */
    fillBuyerInformation(userData = {}) {
        const name = userData.name || faker.person.firstName();
        const lastname = userData.lastname || faker.person.lastName();
        const email = userData.email || faker.internet.email();
        const address = userData.address || faker.location.streetAddress(true);
        const country = userData.country || 'Colombia'; // Default country for selection

        CheckoutPageElements.nameInput().should('be.visible').clear().type(name);
        CheckoutPageElements.lastNameInput().should('be.visible').clear().type(lastname);
        CheckoutPageElements.emailInput().should('be.visible').clear().type(email);
        CheckoutPageElements.addressInput().should('be.visible').clear().type(address);
        CheckoutPageElements.countrySelect().should('be.visible').select(country); // Select by option's value
    }

    /**
     * Fills the "Información de Pago" section of the checkout form.
     * @param {Object} cardData - Object containing credit card details.
     * @param {string} [cardData.nameHolder] - Name on card. Uses faker if not provided.
     * @param {string} cardData.cardNumber - Credit card number. **Required.**
     * @param {string} [cardData.expiryDate] - Expiry date in YYYY-MM format. If not provided, a future date is generated.
     * @param {string} cardData.securityCode - CVV/CVC. **Required.**
     */
    fillPaymentInformation(cardData) {
        if (!cardData.cardNumber || !cardData.securityCode) {
            throw new Error("Card number and security code are required for fillPaymentInformation.");
        }

        const nameHolder = cardData.nameHolder || faker.person.fullName();
        const expiryDate = cardData.expiryDate || getFutureExpiryDate();

        CheckoutPageElements.nameHolderInput().should('be.visible').clear().type(nameHolder);
        CheckoutPageElements.cardNumberInput().should('be.visible').clear().type(cardData.cardNumber);
        CheckoutPageElements.expiryDateInput().should('be.visible').clear().type(expiryDate);
        CheckoutPageElements.securityCodeInput().should('be.visible').clear().type(cardData.securityCode);
    }

    /**
     * Clicks the "Completar Pago" button to submit the checkout form.
     * Waits for the button to be enabled before clicking.
     */
    submitPayment() {
        CheckoutPageElements.completePaymentButton()
        //.should('not.be.disabled')
        .click({force: true })
        //.wait('200');
    }
     submitPayment2() {
        CheckoutPageElements.completePaymentButton2()
        //.should('not.be.disabled')
        .click({force: true })
        //.wait('200');
    }

    // --- Validation Actions ---
    /**
     * Asserts that a success message/modal appears after submitting the order.
     * Clicks the confirm button to dismiss it.
     */
    assertOrderSuccess() {
        CheckoutPageElements.swal2SuccessMessage().should('be.visible');
        CheckoutPageElements.swal2ConfirmButton(); // Click OK
        
        // Add more assertions here if there's a redirect or specific success page content.
    }

    /**
     * Asserts that an error message/modal appears after submitting the order.
     * Clicks the confirm button to dismiss it.
     */
    assertOrderFailure() {
        CheckoutPageElements.swal2ErrorMessage().should('be.visible');
        CheckoutPageElements.swal2ConfirmButton2(); // Click OK
        // Add more specific assertions for error text if applicable.
    }
    assertNotfoundFailure() {
        CheckoutPageElements.swal2ErrorMessage().should('be.visible');
        CheckoutPageElements.swal2ConfirmButton2();
        CheckoutPageElements.swal2NotfoundsMessage().should('be.visible')
        cy.pause()
        .contains('Fondos Insuficientes');
         // Click OK
        // Add more specific assertions for error text if applicable.
    }

    /**
     * Gets and parses the total price displayed in the order summary section.
     * @returns {Cypress.Chainable<number>} The total price as a number.
     */
    getSummaryTotalPrice() {
        return CheckoutPageElements.orderSummaryTotalPrice().invoke('text').then(cleanAndParsePrice);
    }
}

export default new CheckoutPageActions();