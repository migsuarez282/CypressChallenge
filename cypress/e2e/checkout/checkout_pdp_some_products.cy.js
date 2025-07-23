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
import { cleanAndParsePrice } from '../../support/utils/helpers'; // Import helper


describe('End-to-End Checkout Process, pdp multiple products initial login', () => {

    
    // Global setup for checkout tests: Login user, add product, navigate to checkout form
    beforeEach(() => {
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {

                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
        cy.then(() => { 
            const allProducts = products.multipleProductsForCheckout;

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
                 ProductDetailPage.actions.clickAddToCart(3);
                  });
        });
    });

    // --- Test Case 1: Successful Checkout with some PDP Products --- ✅
    // it('login completes checkout successfully with some pdp products and a valid credit card', () => {
    //     const testCard = TEST_CARD_DATA.VISA_SUCCESS;

    //     //ProductDetailPage.actions.addAllProductsFromPDPFixtureToCart(products.multipleProductsForCheckout);
    //      HomePage.actions.openCartModal();
    //     CartPage.actions.goToCheckout();

    //     CheckoutPage.actions.fillBuyerInformation({
    //         name: faker.person.firstName(),
    //         lastname: faker.person.lastName(),
    //         email: faker.internet.email(),
    //         address: faker.location.streetAddress(true),
    //         country: 'Colombia'
    //     });

    //     CheckoutPage.actions.fillPaymentInformation({
    //         nameHolder: faker.person.fullName(),
    //         cardNumber: testCard.number,
    //         securityCode: testCard.cvv,
    //         expiryDate: testCard.ExpDate
    //     });

    //     CheckoutPage.actions.submitPayment();

    //     cy.get('#swal2-html-container')
    //         .should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');

    //     CheckoutPage.actions.assertOrderSuccess();
    // });
    it('📊 validate prices, login,  completes checkout successfully with some pdp products in the cart', () => {
    const testCard = TEST_CARD_DATA.VISA_SUCCESS;
    const allProducts = products.multipleProductsForCheckout;
    let expectedCartItems = {};
    let overallExpectedGrandTotal = 0;

    // Construir el objeto esperado y agregar productos
    cy.wrap(allProducts).each((product) => {
        cy.visit(`/products/${product.slug}`, { timeout: 60000 });
        ProductDetailPage.actions.getProductTitle().then((title) => {
            const productTitle = title.trim();
            const productPrice = Number(product.price);

            if (expectedCartItems[productTitle]) {
                expectedCartItems[productTitle].quantity += 1;
            } else {
                expectedCartItems[productTitle] = {
                    description: productTitle,
                    price: productPrice,
                    quantity: 1
                };
            }
            overallExpectedGrandTotal += productPrice;

            //ProductDetailPage.actions.clickAddToCart(1);
            cy.wait(100);
        });
    }).then(() => {
        HomePage.actions.openCartModal();

        // Validar productos en el carrito
        const itemsToFindForValidation = { ...expectedCartItems };
        CartPage.elements.getCartItemRows().each(($row) => {
            CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                const actualDescription = descriptionCart.trim();
                const expectedItem = itemsToFindForValidation[actualDescription];
                expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;
                CartPage.actions.validateItemDescription($row, expectedItem.description);
                CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
                delete itemsToFindForValidation[actualDescription];
            });
        }).then(() => {
            expect(Object.keys(itemsToFindForValidation).length,
                `Missing expected unique products in cart: ${Object.keys(itemsToFindForValidation).join(', ')}`)
                .to.eq(0);
            CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
        });

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
    });

    // --- Test Case 2: Checkout with some PDP Products, Invalid Credit Card --- ✅
    it('login completes checkout no successfully with some pdp products and a invalid credit card', () => {
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

    // --- Test Case 3: Checkout with some PDP Products, Credit Card without funds --- ✅
    it('login completes checkout with some pdp products and a credit card without funds', () => {
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