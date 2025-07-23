// cypress/e2e/checkout.cy.js

import LoginPage from '../../support/pages/LoginPage'; // For logging in
import HomePage from '../../support/pages/HomeProductsPage'; // For adding product
import CartPage from '../../support/pages/CartPage'; // To navigate to checkout
import CheckoutPage from '../../support/pages/CheckoutPage'; // Checkout POM
import TEST_CARD_DATA from '../../fixtures/test_card_data'; // Test card data
import {
    faker
} from '@faker-js/faker'; // For dynamic user data
import LoginPageActions from '../../support/commands/LoginPageActions';

describe('End-to-End Checkout Process, single product no initial login', () => {

    // Global setup for checkout tests: Login user, add product, navigate to checkout form
    beforeEach(() => {

        // Phase 2: Add a product to the cart (as a prerequisite for checkout)
        HomePage.actions.visitHomePage(); // Ensure on homepage to add product
        HomePage.actions.clickAddToCart(1); // Add product at index 0 (single quantity)

    });

    // --- Test Case 1: Successful Checkout with single Product, then login --- ✅
    it('no login completes checkout successfully with a valid credit card, single product from homepage', () => {
        const testCard = TEST_CARD_DATA.VISA_SUCCESS; // Use a test card that should succeed

        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });

         HomePage.actions.openCartModal();
        //CartPage.actions.openCartModal(); // Open cart modal
        CartPage.actions.goToCheckout(); // Click checkout button within modal

        CheckoutPage.elements.nameInput().should('be.visible');
        // Phase 1: Fill Buyer Information dynamically
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia' // Ensure this matches an option's value in your select dropdown
        });

        // Phase 2: Fill Payment Information with valid card details
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: faker.person.fullName(), // Name on card can be different
            cardNumber: testCard.number,
            securityCode: testCard.cvv,
            expiryDate: testCard.ExpDate
            // Expiry date will be automatically generated as future date
        });

        // Phase 3: Submit Payment
        CheckoutPage.actions.submitPayment();
        cy.get('#swal2-html-container').
            should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');

        // Phase 4: Validate Order Completion
        CheckoutPage.actions.assertOrderSuccess(); // Assert success message/redirect

    });

    // --- Test Case 2: Checkout Failure with single Product, then login, Invalid Credit Card Number --- ✅
    it('no login displays error for an invalid credit card number, single products from homepage', () => {
        const testCard = TEST_CARD_DATA.VISA_INVALID_NUMBER; // Use a card number designed to be invalid
        HomePage.actions.clickAddToCart(0); // Add product at index 0 (single quantity)

        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });

         HomePage.actions.openCartModal();
        //CartPage.actions.openCartModal(); // Open cart modal
        CartPage.actions.goToCheckout(); // Click checkout button within modal

        CheckoutPage.elements.nameInput().should('be.visible');
        // Fill buyer information (can be minimal or full, as needed for your app's validation)
        CheckoutPage.actions.fillBuyerInformation({
            name: 'Invalid',
            lastname: 'User',
            email: 'invalid@example.com',
            address: '123 Fake St',
            country: 'Argentina' // Example country
        });

        // Fill payment information with the invalid card number
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: 'Invalid Card',
            cardNumber: testCard.number, // Invalid number
            securityCode: testCard.cvv
        });

        // Submit payment
        CheckoutPage.actions.submitPayment();

        // Assert payment failure (e.g., error modal appears)
        CheckoutPage.actions.assertOrderFailure();
        cy.get('#swal2-html-container').should('have.text', 'Tarjeta inválida');

        // Optional: Add assertion for specific error message if displayed (e.g., 'Número de tarjeta inválido')
    });

    // --- Test Case 3: Checkout Failure with single Product, then login, Credit Card without funds --- ✅
    it('no login displays error for a credit card without funds, single products from homepage', () => {
        const testCard = TEST_CARD_DATA.NOTFOUND_CC; // Use a card number designed to be invalid
        HomePage.actions.clickAddToCart(3); // Add product at index 0 (single quantity)
        HomePage.actions.clickAddToCart(6); // Add product at index 0 (single quantity)

        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });

         HomePage.actions.openCartModal();
        //CartPage.actions.openCartModal(); // Open cart modal
        CartPage.actions.goToCheckout(); // Click checkout button within modal

        CheckoutPage.elements.nameInput().should('be.visible');
        // Fill buyer information (can be minimal or full, as needed for your app's validation)
        CheckoutPage.actions.fillBuyerInformation({
            name: 'Invalid',
            lastname: 'User',
            email: 'invalid@example.com',
            address: '123 Fake St',
            country: 'Argentina' // Example country
        });

        // Fill payment information with the invalid card number
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: 'Invalid Card',
            cardNumber: testCard.number, // Invalid number
            securityCode: testCard.cvv,
            expiryDate: testCard.ExpDate
        });

        // Submit payment
        CheckoutPage.actions.submitPayment();

        // Assert payment failure (e.g., error modal appears)
        CheckoutPage.actions.assertOrderFailure();
        cy.get('#swal2-html-container').should('have.text', 'Fondos Insuficientes');

    });

    // --- Add More Checkout Test Cases Here ---
    // Example: Test with an expired card, missing required fields, card declined, etc.
});