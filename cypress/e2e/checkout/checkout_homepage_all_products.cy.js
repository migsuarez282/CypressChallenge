import HomePage from '../../support/pages/HomeProductsPage';
import CartPage from '../../support/pages/CartPage';
import CheckoutPage from '../../support/pages/CheckoutPage';
import TEST_CARD_DATA from '../../fixtures/test_card_data';
import { faker } from '@faker-js/faker';
import LoginPageActions from '../../support/commands/LoginPageActions';
import { cleanAndParsePrice } from '../../support/utils/helpers'; // Import helper

describe('End-to-End Checkout Process, single product initial login', () => {

    // Global setup for checkout tests: Login user, add product, navigate to checkout form
    beforeEach(() => {
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
    });

    // --- Test Case 1: Successful Checkout all homepage products --- ✅
    it('login, completes checkout successfully, all homepage products, with a valid credit card', () => {
        const testCard = TEST_CARD_DATA.VISA_SUCCESS;
        HomePage.actions.visitHomePage();
        cy.get('[data-at="product-card"]', { timeout: 10000 }).should('be.visible');

        CartPage.actions.addAllHomepageProductsToCart();
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
            cardNumber: TEST_CARD_DATA.VISA_SUCCESS.number,
            securityCode: TEST_CARD_DATA.VISA_SUCCESS.cvv,
            expiryDate: TEST_CARD_DATA.VISA_SUCCESS.ExpDate
        });

        CheckoutPage.actions.submitPayment();
        cy.get('#swal2-html-container')
            .should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');
        CheckoutPage.actions.assertOrderSuccess();
    });

    // --- Test Case 1': Successful Checkout all homepage products, grand total --- ✅
    // it('login completes checkout successfully, all homepage products, grand total 📊, with a valid credit card', () => {
    //     const testCard = TEST_CARD_DATA.VISA_SUCCESS;
    //     let expectedCartItems = {};
    //     let overallExpectedGrandTotal = 0;
    //     HomePage.actions.visitHomePage();
        
    //     cy.get('[data-at="product-card"]').then(($productCards) => {
    //         const numberOfProductsFoundOnHomepage = $productCards.length;
    //         const productIndices = Array.from({ length: numberOfProductsFoundOnHomepage }, (_, i) => i);

    //         cy.wrap(productIndices).each((productIndex) => {
    //             HomePage.elements.getProductCard(productIndex).then(($productCard) => {
    //                 HomePage.elements.getProductDescription($productCard).invoke('text').then((description) => {
    //                     const productDescription = description.trim();

    //                     HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
    //                         const productPriceCleaned = cleanAndParsePrice(priceText);
    //                         if (expectedCartItems[productDescription]) {
    //                             expectedCartItems[productDescription].quantity += 1;
    //                         } else {
    //                             expectedCartItems[productDescription] = {
    //                                 description: productDescription,
    //                                 price: productPriceCleaned,
    //                                 quantity: 1
    //                             };
    //                         }
    //                         overallExpectedGrandTotal += productPriceCleaned;

    //                         cy.get('.align-middle.select-none').eq(productIndex).click();
    //                         cy.wait(100);
    //                     });
    //                 });
    //             });
    //         }).then(() => {
    //             HomePage.actions.openCartModal(); // Use POM action to open the cart

    //             const expectedDescriptionsSet = new Set(Object.keys(expectedCartItems));
    //             CartPage.elements.getCartItemRows().each(($row) => {
    //                 CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
    //                     const actualDescription = descriptionCart.trim();
    //                     const expectedItem = expectedCartItems[actualDescription];
    //                     expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;
    //                     expectedDescriptionsSet.delete(actualDescription);
    //                     CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
    //                     CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
    //                 });
    //             }).then(() => {
    //                 expect(expectedDescriptionsSet.size, `Missing expected unique products in cart: ${Array.from(expectedDescriptionsSet).join(', ')}`).to.eq(0);
    //                 CartPage.actions.validateGrandTotal(overallExpectedGrandTotal); // Validate against the accumulated total

    //                 cy.wait(5000)
    //                 CartPage.actions.goToCheckout();

    //         CheckoutPage.actions.fillBuyerInformation({
    //             name: faker.person.firstName(),
    //             lastname: faker.person.lastName(),
    //             email: faker.internet.email(),
    //             address: faker.location.streetAddress(true),
    //             country: 'Colombia'
    //         });

    //         CheckoutPage.actions.fillPaymentInformation({
    //             nameHolder: faker.person.fullName(),
    //             cardNumber: testCard.number,
    //             securityCode: testCard.cvv,
    //             expiryDate: testCard.ExpDate
    //         });

    //         CheckoutPage.actions.submitPayment();
    //         cy.get('#swal2-html-container')
    //             .should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');
    //         CheckoutPage.actions.assertOrderSuccess();
     

    //             });
    //         });
    //     });
    // });
    it('📊 validate prices, login, completes checkout successfully, all homepage products, with a valid credit card', () => {
    const testCard = TEST_CARD_DATA.VISA_SUCCESS;
    let expectedCartItems = {};
    let overallExpectedGrandTotal = 0;

    HomePage.actions.visitHomePage();
    cy.get('[data-at="product-card"]', { timeout: 10000 }).should('be.visible');

    // --- Fase 1: Agregar todos los productos del homepage y construir el objeto esperado ---
    cy.get('[data-at="product-card"]').then(($productCards) => {
        const numberOfProductsFoundOnHomepage = $productCards.length;
        const productIndices = Array.from({ length: numberOfProductsFoundOnHomepage }, (_, i) => i);

        cy.wrap(productIndices).each((productIndex) => {
            HomePage.elements.getProductCard(productIndex).then(($productCard) => {
                HomePage.elements.getProductDescription($productCard).invoke('text').then((description) => {
                    const productDescription = description.trim();
                    HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        const productPriceCleaned = cleanAndParsePrice(priceText);
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

                        cy.get('.align-middle.select-none').eq(productIndex).click();
                        cy.wait(100);
                    });
                });
            });
        });
    }).then(() => {
        // --- Fase 2: Validar el carrito ---
        HomePage.actions.openCartModal();

        const expectedDescriptionsSet = new Set(Object.keys(expectedCartItems));
        CartPage.elements.getCartItemRows().each(($row) => {
            CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                const actualDescription = descriptionCart.trim();
                const expectedItem = expectedCartItems[actualDescription];
                expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;
                expectedDescriptionsSet.delete(actualDescription);

                // Validaciones adicionales
                CartPage.actions.validateItemDescription($row, expectedItem.description);
                CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
            });
        }).then(() => {
            expect(expectedDescriptionsSet.size, `Missing expected unique products in cart: ${Array.from(expectedDescriptionsSet).join(', ')}`).to.eq(0);
            CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
        });

        // --- Fase 3: Checkout ---
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

    // --- Test Case 2: Checkout Failure with Invalid Credit Card Number, all homepage products --- ✅
    // it('checkout successfully, all homepage product, with a invalid credit card', () => {
    //     const testCard = TEST_CARD_DATA.VISA_INVALID_NUMBER;
    //     HomePage.actions.visitHomePage();
    //     cy.get('[data-at="product-card"]', { timeout: 10000 }).should('be.visible');
    //     CartPage.actions.addAllHomepageProductsToCart();
    //     HomePage.actions.openCartModal();
    //     CartPage.actions.goToCheckout();

    //     CheckoutPage.actions.fillBuyerInformation({
    //         name: faker.person.firstName(),
    //         lastname: faker.person.lastName(),
    //         email: faker.internet.email(),
    //         address: faker.location.streetAddress(true),
    //         country: 'Colombia'
    //     });

    //     CheckoutPage.actions.fillPaymentInformation({
    //         nameHolder: 'Invalid Card',
    //         cardNumber: testCard.number,
    //         securityCode: testCard.cvv
    //     });

    //     CheckoutPage.actions.submitPayment();

    //     CheckoutPage.actions.assertOrderFailure();
    //     cy.get('#swal2-html-container')
    //         .should('have.text', 'Tarjeta inválida');
    // });
    it('📊 validate prices, login, invalid credit card, all homepage products', () => {
    const testCard = TEST_CARD_DATA.VISA_INVALID_NUMBER;
    let expectedCartItems = {};
    let overallExpectedGrandTotal = 0;

    HomePage.actions.visitHomePage();
    cy.get('[data-at="product-card"]', { timeout: 10000 }).should('be.visible');

    // --- Fase 1: Agregar todos los productos del homepage y construir el objeto esperado ---
    cy.get('[data-at="product-card"]').then(($productCards) => {
        const numberOfProductsFoundOnHomepage = $productCards.length;
        const productIndices = Array.from({ length: numberOfProductsFoundOnHomepage }, (_, i) => i);

        cy.wrap(productIndices).each((productIndex) => {
            HomePage.elements.getProductCard(productIndex).then(($productCard) => {
                HomePage.elements.getProductDescription($productCard).invoke('text').then((description) => {
                    const productDescription = description.trim();
                    HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        const productPriceCleaned = cleanAndParsePrice(priceText);
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

                        cy.get('.align-middle.select-none').eq(productIndex).click();
                        cy.wait(100);
                    });
                });
            });
        });
    }).then(() => {
        // --- Fase 2: Validar el carrito ---
        HomePage.actions.openCartModal();

        const expectedDescriptionsSet = new Set(Object.keys(expectedCartItems));
        CartPage.elements.getCartItemRows().each(($row) => {
            CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                const actualDescription = descriptionCart.trim();
                const expectedItem = expectedCartItems[actualDescription];
                expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;
                expectedDescriptionsSet.delete(actualDescription);

                // Validaciones adicionales
                CartPage.actions.validateItemDescription($row, expectedItem.description);
                CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
            });
        }).then(() => {
            expect(expectedDescriptionsSet.size, `Missing expected unique products in cart: ${Array.from(expectedDescriptionsSet).join(', ')}`).to.eq(0);
            CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
        });

        // --- Fase 3: Checkout ---
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
        cy.get('#swal2-html-container')
            .should('have.text', 'Tarjeta inválida');
    });
    });

    // --- Test Case 3: Checkout Failure with Credit Card without funds, all homepage products--- ✅
    it('login, no funds credit card, all homepage product', () => {
        const testCard = TEST_CARD_DATA.NOTFOUND_CC;
        HomePage.actions.visitHomePage();
        cy.get('[data-at="product-card"]', { timeout: 10000 }).should('be.visible');

        CartPage.actions.addAllHomepageProductsToCart();

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
        cy.get('#swal2-html-container').should('have.text', 'Fondos Insuficientes');

    });

});