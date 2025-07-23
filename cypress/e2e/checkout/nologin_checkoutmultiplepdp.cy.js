import LoginPage from '../../support/pages/LoginPage'; // For logging in
import HomePage from '../../support/pages/HomeProductsPage'; // For adding product
import CartPage from '../../support/pages/CartPage';
import ProductDetailPage from '../../support/pages/ProductDetailPage'; // Specific to Product Detail Page interactions.// To navigate to checkout
import CheckoutPage from '../../support/pages/CheckoutPage'; // Checkout POM
import TEST_CARD_DATA from '../../fixtures/test_card_data'; // Test card data
import {
    faker
} from '@faker-js/faker';
import products from '../../fixtures/products'; // Ensure this import is there
import LoginPageActions from '../../support/commands/LoginPageActions';

describe('End-to-End Checkout Process, pdp multiple products no initial login', () => {

    // Global setup for checkout tests: Login user, add product, navigate to checkout form
    beforeEach(() => {

        // Phase 2: Add some products to the cart
        cy.then(() => { // Ensures previous commands (like login) complete before this block runs

            const allProducts = products.multipleProductsForCheckout;

            allProducts.forEach(product => {
                // Assuming each product is added with a quantity of 1 for simplicity.
                // If your application requires different quantities, adjust `addToCart(1)`
                ProductDetailPage.actions.visitProductDetailPage(product.slug);
                ProductDetailPage.actions.clickAddToCart(1); // Add each product with quantity 1

                //mainNavigationActions.closeCartModal(); // Close modal after each addition

            });
        });

    });

    // --- Test Case 1: Successful Checkout with pdp Products, then login --- ✅
    it('no login completes checkout successfully with some pdp products and a valid credit card', () => {
        const testCard = TEST_CARD_DATA.VISA_SUCCESS;
       
        //CartPage.actions.openCartModal(); // Open cart modal
        //CartPage.actions.goToCheckout(); // Click checkout button within modal

        // Phase 1: Log in a valid user
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
         HomePage.actions.openCartModal();

        CartPage.actions.goToCheckout();

        // Phase 1: Fill Buyer Information dynamically
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });

        // Phase 2: Fill Payment Information with valid card details
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: faker.person.fullName(),
            cardNumber: testCard.number,
            securityCode: testCard.cvv,
            expiryDate: testCard.ExpDate
        });

        // Phase 3: Submit Payment
        CheckoutPage.actions.submitPayment();

        cy.get('#swal2-html-container').
            should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');

        // Phase 4: Validate Order Completion
        CheckoutPage.actions.assertOrderSuccess(); // Assert success message/redirect
    });

    // --- Test Case 2: Checkout Failure with pdp Products, then login, Invalid Credit Card Number --- ✅
    it('no login completes checkout no successfully with some pdp products and a invalid credit card', () => {
        const testCard = TEST_CARD_DATA.VISA_INVALID_NUMBER;

        //CartPage.actions.openCartModal(); // Open cart modal
        //CartPage.actions.goToCheckout(); // Click checkout button within modal

        // Phase 1: Log in a valid user
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
         HomePage.actions.openCartModal();

        CartPage.actions.goToCheckout();

        // Phase 1: Fill Buyer Information dynamically
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });

        // Phase 2: Fill Payment Information with valid card details
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: 'Invalid Card',
            cardNumber: testCard.number, // Invalid number
            securityCode: testCard.cvv
        });

        // Phase 3: Submit Payment
        CheckoutPage.actions.submitPayment();

        // Phase 4: Validate Order Completion
        CheckoutPage.actions.assertOrderFailure();
        cy.get('#swal2-html-container').should('have.text', 'Tarjeta inválida');
    });

    // --- Test Case 3: Checkout Failure with pdp Products, then login, Credit Card without funds --- ✅
    it('no login completes checkout with some pdp products and a credit card without funds', () => {
        const testCard = TEST_CARD_DATA.NOTFOUND_CC;

        //CartPage.actions.openCartModal(); // Open cart modal
        //CartPage.actions.goToCheckout(); // Click checkout button within modal

        // Phase 1: Log in a valid user
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
         HomePage.actions.openCartModal();

        CartPage.actions.goToCheckout();

        // Phase 1: Fill Buyer Information dynamically
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });

        // Phase 2: Fill Payment Information with valid card details
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: 'Invalid Card',
            cardNumber: testCard.number, // Invalid number
            securityCode: testCard.cvv,
            expiryDate: testCard.ExpDate

        });

        // Phase 3: Submit Payment
        CheckoutPage.actions.submitPayment();

        // Phase 4: Validate Order Completion
        CheckoutPage.actions.assertOrderFailure();
        cy.get('#swal2-html-container').should('have.text', 'Fondos Insuficientes');

    });

});
