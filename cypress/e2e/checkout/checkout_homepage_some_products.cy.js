import HomePage from '../../support/pages/HomeProductsPage'; 
import CartPage from '../../support/pages/CartPage'; 
import CheckoutPage from '../../support/pages/CheckoutPage'; 
import TEST_CARD_DATA from '../../fixtures/test_card_data'; 
import { faker } from '@faker-js/faker';
import LoginPageActions from '../../support/commands/LoginPageActions';
import { cleanAndParsePrice } from '../../support/utils/helpers';

describe('End-to-End Checkout Process, single product initial login', () => {

    // Global setup for checkout tests: Login user, add product, navigate to checkout form
    beforeEach(() => {

        // Phase 1: Log in a valid user
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });

        
    });

    // --- Test Case 1: Successful Checkout single product --- ✅
    it('login completes checkout successfully, single product, with a valid credit card', () => {
        const testCard = TEST_CARD_DATA.VISA_SUCCESS; // Use a test card that should succeed
// Phase 2: Add from hoepage a product to the cart (as a prerequisite for checkout)
        HomePage.actions.visitHomePage(); 
        HomePage.actions.clickAddToCart(0); 
        // Phase 3: Navigate from Cart Modal to the Checkout Page
        HomePage.actions.openCartModal();
        CartPage.actions.goToCheckout(); 
        // Wait for the checkout form to fully load and its first input to be visible
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
        cy.get('#swal2-html-container')
        .should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');

        // Phase 4: Validate Order Completion
        CheckoutPage.actions.assertOrderSuccess(); // Assert success message/redirect

    });

    // --- Test Case 2: Checkout Failure with Invalid Credit Card Number --- ✅
    it('login displays error for an invalid credit card number', () => {
        const testCard = TEST_CARD_DATA.VISA_INVALID_NUMBER; 
        // Use a card number designed to be invalid
// Phase 2: Add from hoepage a product to the cart (as a prerequisite for checkout)
        HomePage.actions.visitHomePage(); 
        HomePage.actions.clickAddToCart(0); 
        // Phase 3: Navigate from Cart Modal to the Checkout Page
        HomePage.actions.openCartModal();
        CartPage.actions.goToCheckout(); 
        // Wait for the checkout form to fully load and its first input to be visible
        CheckoutPage.elements.nameInput().should('be.visible');
        
        // Fill buyer information (can be minimal or full, as needed for your app's validation)
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia' // Example country
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
        cy.get('#swal2-html-container')
        .should('have.text', 'Tarjeta inválida');

        // Optional: Add assertion for specific error message if displayed (e.g., 'Número de tarjeta inválido')
    });

    // --- Test Case 3: Checkout Failure with Credit Card without funds --- ✅
    it('login displays error for a credit card without funds', () => {
        const testCard = TEST_CARD_DATA.NOTFOUND_CC; // Use a card number designed to be invalid
// Phase 2: Add from hoepage a product to the cart (as a prerequisite for checkout)
        HomePage.actions.visitHomePage(); 
        HomePage.actions.clickAddToCart(0); 
        // Phase 3: Navigate from Cart Modal to the Checkout Page
        HomePage.actions.openCartModal();
        CartPage.actions.goToCheckout(); 
        // Wait for the checkout form to fully load and its first input to be visible
        CheckoutPage.elements.nameInput().should('be.visible');

        // Fill buyer information (can be minimal or full, as needed for your app's validation)
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia' // Example country
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

    // --- Test Case 4: Successful Checkout some products from homepage--- ✅
   
    it('📊 validate prices, login, completes checkout successfully, some products from homepage with a valid credit card', () => {
    const testCard = TEST_CARD_DATA.VISA_SUCCESS;
    HomePage.actions.visitHomePage();

    // Indices de productos seleccionados
    const selectedIndices = [1, 3, 5, 7, 9];
    let expectedCartItems = {};
    let overallExpectedGrandTotal = 0;

    // Agregar productos y construir objeto esperado
    cy.wrap(selectedIndices).each((index) => {
        HomePage.elements.getProductCard(index).then(($productCard) => {
            HomePage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                const productDescription = descriptionText.trim();
                HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                    const productCleanedPrice = cleanAndParsePrice(priceText);

                    if (expectedCartItems[productDescription]) {
                        expectedCartItems[productDescription].quantity += 1;
                    } else {
                        expectedCartItems[productDescription] = {
                            description: productDescription,
                            price: productCleanedPrice,
                            quantity: 1
                        };
                    }
                    overallExpectedGrandTotal += productCleanedPrice;

                    HomePage.actions.clickAddToCart(index);
                    cy.wait(100);
                });
            });
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

        // Buyer info
        CheckoutPage.actions.fillBuyerInformation({
            name: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(true),
            country: 'Colombia'
        });

        // Payment info
        CheckoutPage.actions.fillPaymentInformation({
            nameHolder: faker.person.fullName(),
            cardNumber: testCard.number,
            securityCode: testCard.cvv,
            expiryDate: testCard.ExpDate
        });

        CheckoutPage.actions.submitPayment();
        cy.get('#swal2-html-container').
            should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');
        CheckoutPage.actions.assertOrderSuccess();
    });
    });

    // --- Test Case 5: Successful Checkout with a products selected multiple times from homepage --- ✅
    
});