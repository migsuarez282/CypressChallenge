import HomePage from '../../support/pages/HomeProductsPage'; // For adding product.
import CartPage from '../../support/pages/CartPage'; //For cart interaction.
import ProductDetailPage from '../../support/pages/ProductDetailPage'; // Specific to Product Detail Page-PDP interactions.
import CheckoutPage from '../../support/pages/CheckoutPage'; // Checkout POM.
import TEST_CARD_DATA from '../../fixtures/test_card_data'; // Test card data.
import products from '../../fixtures/products'; // To define the list of products.
import {
    faker
} from '@faker-js/faker';
import LoginPageActions from '../../support/commands/LoginPageActions';


describe('End-to-End Checkout Process, pdp all products initial login', () => {

    // Global setup for checkout tests: Login user, add product, navigate to checkout form
    /*beforeEach(() => {
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {

                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
        // Phase 2: Add all products to the cart
        cy.then(() => { 
            const allProducts = products.allProductsForCheckout;
            allProducts.forEach(product => {
                cy.visit(`/products/${product.slug}`, {
                    timeout: 60000,
                    onBeforeLoad(win) {
                        Object.defineProperty(win.navigator, 'onLine', {
                            value: true
                        });
                        win.fetch = null;
                    }
                });
                ProductDetailPage.actions.clickAddToCart(1);
                });
        });
    });*/

    beforeEach(() => {
    cy.fixture('login').then((user) => {
        LoginPageActions.apiLogin(user.email, user.password).then((response) => {
            window.localStorage.setItem('token', response.body.token);
            cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
        });
    });

    // Guardar info de productos agregados
    cy.then(() => {
        const allProducts = products.allProductsForCheckout;
        let expectedCartItems = {};
        let overallExpectedGrandTotal = 0;

        allProducts.forEach(product => {
            cy.visit(`/products/${product.slug}`);
            const productDescription = product.name.trim();
            const productPriceCleaned = Number(product.price);

            ProductDetailPage.actions.clickAddToCart(1);

            if (expectedCartItems[productDescription]) {
                expectedCartItems[productDescription].quantity += 1;
            } else {
                expectedCartItems[productDescription] = {
                    description: productDescription,
                    price: productPriceCleaned,
                    quantity: 1
                };
            }
            overallExpectedGrandTotal += productPriceCleaned;
        });

        // Guarda la info para los tests
        cy.wrap(expectedCartItems).as('expectedCartItems');
        cy.wrap(overallExpectedGrandTotal).as('overallExpectedGrandTotal');
    });
    });
    // --- Test Case 1: Successful Checkout with all PDP Products --- ✅
    it('login completes checkout successfully with all pdp products and a valid credit card', () => {
        const testCard = TEST_CARD_DATA.VISA_SUCCESS;

        HomePage.actions.openCartModal();
        CartPage.actions.goToCheckout();

        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });

        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: faker.person.fullName(),
            cardNumber: testCard.number,
            securityCode: testCard.cvv,
            expiryDate: testCard.ExpDate
        });

        CheckoutPage.actions.submitPayment();
        cy.get('#swal2-html-container')
        .should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');

        CheckoutPage.actions.assertOrderSuccess(); 
        });

    // --- Test Case 1': Successful Checkout with all PDP Products, grand total --- ✅
    it('📊 validate prices, success checkout all products from detail pages', function () {
    HomePage.actions.openCartModal();

    const expectedDescriptionsSet = new Set(Object.keys(this.expectedCartItems));
    CartPage.elements.getCartItemRows().each(($row) => {
        CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
            const actualDescription = descriptionCart.trim();
            const expectedItem = this.expectedCartItems[actualDescription];
            expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;
            expectedDescriptionsSet.delete(actualDescription);
            CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
            CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
        });
    }).then(() => {
        expect(expectedDescriptionsSet.size, `Missing expected unique products in cart: ${Array.from(expectedDescriptionsSet).join(', ')}`).to.eq(0);
        CartPage.actions.validateGrandTotal(this.overallExpectedGrandTotal);

        // Proceso de checkout...
        CartPage.actions.goToCheckout();
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: faker.person.fullName(),
            cardNumber: TEST_CARD_DATA.VISA_SUCCESS.number,
            securityCode: TEST_CARD_DATA.VISA_SUCCESS.cvv,
            expiryDate: TEST_CARD_DATA.VISA_SUCCESS.ExpDate
        });
        CheckoutPage.actions.submitPayment();
        cy.get('#swal2-html-container')
            .should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');
        CheckoutPage.actions.assertOrderSuccess();
    });
    });

    // --- Test Case 2: Checkout with all PDP Products, invalid Credit Card --- ✅
    it('login completes checkout no successfully with all pdp products and a invalid credit card', () => {
        const testCard = TEST_CARD_DATA.VISA_INVALID_NUMBER;

         HomePage.actions.openCartModal();
        CartPage.actions.goToCheckout();

        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });

        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: 'Invalid Card',
            cardNumber: testCard.number, 
            securityCode: testCard.cvv
        });

        CheckoutPage.actions.submitPayment();

        CheckoutPage.actions.assertOrderFailure();
        cy.get('#swal2-html-container')
        .should('have.text', 'Tarjeta inválida');
    });

    // --- Test Case 3: Checkout with all PDP Products, Credit Card without funds --- ✅
    it('login completes checkout with all pdp products and a credit card without funds', () => {
        const testCard = TEST_CARD_DATA.NOTFOUND_CC;

         HomePage.actions.openCartModal();
        CartPage.actions.goToCheckout();

        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });

        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: 'Invalid Card',
            cardNumber: testCard.number,
            securityCode: testCard.cvv,
            expiryDate: testCard.ExpDate

        });

        CheckoutPage.actions.submitPayment();
        CheckoutPage.actions.assertOrderFailure();
        cy.get('#swal2-html-container')
        .should('have.text', 'Fondos Insuficientes');

    });

    

});