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
    });
   
    // --- Test Case 1: Add a single product from its detail page to the cart and validate --- ✅
    it('📊 validate prices, successful checkout, adds a single product from its detail page to the cart', () => {
        
        let expectedProductTitle;
        let expectedProductPriceNumeric;
        const desiredQuantity = 1;

        const TEST_PRODUCT_SLUG = 'mancuernas-recubiertas-de-neopreno';
        cy.visit(`/products/${TEST_PRODUCT_SLUG}`);

        ProductDetailPage.actions.getProductTitle().then((title) => {
            expectedProductTitle = title.trim();
        });

        ProductDetailPage.actions.getProductPrice().then((price) => {
            expectedProductPriceNumeric = price;
            const calculatedExpectedGrandTotal = expectedProductPriceNumeric * desiredQuantity;
            cy.wrap(calculatedExpectedGrandTotal).as('expectedGrandTotal');
        });

        cy.get('@expectedGrandTotal').then(() => {
            ProductDetailPage.actions.clickAddToCart({
                scrollBehavior: false
            });
        });

         HomePage.actions.openCartModal();
        cy.wait(5000);

        CartPage.elements.getCartItemRows().should('have.length', 1).then(($row) => {
            CartPage.actions.validateItemDescription($row, expectedProductTitle);
            CartPage.actions.validateItemQuantity($row, desiredQuantity);
            CartPage.actions.validateItemPrice($row, expectedProductPriceNumeric * desiredQuantity);
        });

        cy.get('@expectedGrandTotal').then((total) => {
            CartPage.actions.validateGrandTotal(total);
        });

        //Checkout process
        const testCard = TEST_CARD_DATA.VISA_SUCCESS;
       
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

    // --- Test Case 2: Add a single product from its detail page to the cart and validate --- ✅
    it('📊 validate prices, invalid credit card, adds a single product from its detail page to the cart', () => {
        const testCard = TEST_CARD_DATA.VISA_INVALID_NUMBER;

        let expectedProductTitle;
        let expectedProductPriceNumeric;
        const desiredQuantity = 1;

        const TEST_PRODUCT_SLUG = 'mancuernas-recubiertas-de-neopreno';
        cy.visit(`/products/${TEST_PRODUCT_SLUG}`);

        ProductDetailPage.actions.getProductTitle().then((title) => {
            expectedProductTitle = title.trim();
        });

        ProductDetailPage.actions.getProductPrice().then((price) => {
            expectedProductPriceNumeric = price;
            const calculatedExpectedGrandTotal = expectedProductPriceNumeric * desiredQuantity;
            cy.wrap(calculatedExpectedGrandTotal).as('expectedGrandTotal');
        });

        cy.get('@expectedGrandTotal').then(() => {
            ProductDetailPage.actions.clickAddToCart({
                scrollBehavior: false
            });
        });

         HomePage.actions.openCartModal();
        cy.wait(5000);

        CartPage.elements.getCartItemRows().should('have.length', 1).then(($row) => {
            CartPage.actions.validateItemDescription($row, expectedProductTitle);
            CartPage.actions.validateItemQuantity($row, desiredQuantity);
            CartPage.actions.validateItemPrice($row, expectedProductPriceNumeric * desiredQuantity);
        });

        cy.get('@expectedGrandTotal').then((total) => {
            CartPage.actions.validateGrandTotal(total);
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
                   nameHolder: 'Invalid Card',
                   cardNumber: testCard.number,
                   securityCode: testCard.cvv
               });
       
               CheckoutPage.actions.submitPayment();
       
               CheckoutPage.actions.assertOrderFailure();
               cy.get('#swal2-html-container')
                   .should('have.text', 'Tarjeta inválida');

    });

    // --- Test Case 3: Add a single product from its detail page to the cart and validate --- ✅
    it('📊 validate prices, no funds credit card, adds a single product from its detail page to the cart', () => {
        
        let expectedProductTitle;
        let expectedProductPriceNumeric;
        const desiredQuantity = 1;

        const TEST_PRODUCT_SLUG = 'mancuernas-recubiertas-de-neopreno';
        cy.visit(`/products/${TEST_PRODUCT_SLUG}`);

        ProductDetailPage.actions.getProductTitle().then((title) => {
            expectedProductTitle = title.trim();
        });

        ProductDetailPage.actions.getProductPrice().then((price) => {
            expectedProductPriceNumeric = price;
            const calculatedExpectedGrandTotal = expectedProductPriceNumeric * desiredQuantity;
            cy.wrap(calculatedExpectedGrandTotal).as('expectedGrandTotal');
        });

        cy.get('@expectedGrandTotal').then(() => {
            ProductDetailPage.actions.clickAddToCart({
                scrollBehavior: false
            });
        });

       HomePage.actions.openCartModal();
        cy.wait(5000);

        CartPage.elements.getCartItemRows().should('have.length', 1).then(($row) => {
            CartPage.actions.validateItemDescription($row, expectedProductTitle);
            CartPage.actions.validateItemQuantity($row, desiredQuantity);
            CartPage.actions.validateItemPrice($row, expectedProductPriceNumeric * desiredQuantity);
        });

        cy.get('@expectedGrandTotal').then((total) => {
            CartPage.actions.validateGrandTotal(total);
        });

        //Checkout process
        const testCard = TEST_CARD_DATA.NOTFOUND_CC;
        
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

    // --- Test Case 4: Successful Checkout with a PDP product, the same product multiple times, from pdp --- ✅
    it('📊 validate prices, adds product with incremented 10 quantity from PDP to the cart', () => {
            const testCard = TEST_CARD_DATA.VISA_SUCCESS;
            const initialQuantityOnPDP = 1;
            const finalDesiredQuantity = 10;
            let productTitle;
    
            const TEST_PRODUCT_SLUG = 'reloj-deportivo-gps';
            cy.visit(`/products/${TEST_PRODUCT_SLUG}`);
    
            ProductDetailPage.actions.getProductTitle().then((title) => {
                productTitle = title.trim();
            });
    
            ProductDetailPage.actions.getProductPrice().then((price) => {
                cy.wrap(price).as('unitPriceCleaned');
                const calculatedExpectedGrandTotal = price * finalDesiredQuantity;
                cy.wrap(calculatedExpectedGrandTotal).as('expectedGrandTotal');
    
                ProductDetailPage.elements.quantityDisplay().should('have.text', initialQuantityOnPDP.toString());
                ProductDetailPage.actions.clickIncrementQuantityPDP(finalDesiredQuantity, initialQuantityOnPDP);
                ProductDetailPage.actions.clickAddToCart();
    
                 HomePage.actions.openCartModal();
    
                CartPage.elements.getCartItemRows().should('have.length', 1).then(($row) => {
                    CartPage.actions.validateItemDescription($row, productTitle);
                    CartPage.actions.validateItemQuantity($row, finalDesiredQuantity);
    
                    cy.get('@unitPriceCleaned').then((unitPrice) => {
                        CartPage.actions.validateItemPrice($row, unitPrice * finalDesiredQuantity);
                    });
                });
    
                cy.get('@expectedGrandTotal').then((expectedTotal) => {
                    CartPage.actions.validateGrandTotal(expectedTotal);
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

    // --- Test Case 5: Successful Checkout with a PDP product, the same product multiple times, from pdp --- ✅
    it('📊 validate prices, no funds credit card, adds product with incremented 10 quantity from PDP to the cart', () => {
            
            const initialQuantityOnPDP = 1;
            const finalDesiredQuantity = 10;
            let productTitle;
    
            const TEST_PRODUCT_SLUG = 'reloj-deportivo-gps';
            cy.visit(`/products/${TEST_PRODUCT_SLUG}`);
    
            ProductDetailPage.actions.getProductTitle().then((title) => {
                productTitle = title.trim();
            });
    
            ProductDetailPage.actions.getProductPrice().then((price) => {
                cy.wrap(price).as('unitPriceCleaned');
                const calculatedExpectedGrandTotal = price * finalDesiredQuantity;
                cy.wrap(calculatedExpectedGrandTotal).as('expectedGrandTotal');
    
                ProductDetailPage.elements.quantityDisplay().should('have.text', initialQuantityOnPDP.toString());
                ProductDetailPage.actions.clickIncrementQuantityPDP(finalDesiredQuantity, initialQuantityOnPDP);
                ProductDetailPage.actions.clickAddToCart();
    
                 HomePage.actions.openCartModal();
    
                CartPage.elements.getCartItemRows().should('have.length', 1).then(($row) => {
                    CartPage.actions.validateItemDescription($row, productTitle);
                    CartPage.actions.validateItemQuantity($row, finalDesiredQuantity);
    
                    cy.get('@unitPriceCleaned').then((unitPrice) => {
                        CartPage.actions.validateItemPrice($row, unitPrice * finalDesiredQuantity);
                    });
                });
    
                cy.get('@expectedGrandTotal').then((expectedTotal) => {
                    CartPage.actions.validateGrandTotal(expectedTotal);
                });
                CartPage.actions.goToCheckout();

        const testCard = TEST_CARD_DATA.NOTFOUND_CC;
       
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
});