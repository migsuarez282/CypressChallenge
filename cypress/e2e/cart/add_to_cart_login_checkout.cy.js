import HomeProductsPage from '../../support/pages/HomeProductsPage';
import CartPage from '../../support/pages/CartPage';
import LoginPageActions from '../../support/pages/LoginPage';
import ProductDetailPage from '../../support/pages/ProductDetailPage'; // Specific to Product Detail Page-PDP interactions.
import CheckoutPage from '../../support/pages/CheckoutPage';
import { cleanAndParsePrice2 } from '../../support/utils/helpers';
import { cleanAndParsePrice } from '../../support/utils/helpers';

import TEST_CARD_DATA from '../../fixtures/test_card_data'; // Test card data.
import {
    faker
} from '@faker-js/faker';

describe('Add to cart before and after login, then checkout', () => {
    
    it('adds single product before login, logs in, adds another product, validates cart and completes checkout', () => {
        const firstProductIndex = 2;
        const secondProductIndex = 5;
        let expectedCartItems = {};
        let overallExpectedGrandTotal = 0;

        // Paso 1: Agregar producto sin login
        HomeProductsPage.actions.visitHomePage();
        HomeProductsPage.actions.getProductDescription(firstProductIndex).then((desc) => {
            const description = desc.trim();
            HomeProductsPage.actions.getProductPrice(firstProductIndex).then((priceText) => {
                const price = cleanAndParsePrice(priceText);
                expectedCartItems[description] = {
                    description,
                    price,
                    quantity: 1
                };
                overallExpectedGrandTotal += price;
                HomeProductsPage.actions.clickAddToCart(firstProductIndex);
            });
        });

        // Paso 2: Login
        cy.fixture('login').then((user) => {
            LoginPageActions.actions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });

        // Paso 3: Agregar otro producto después de login
        HomeProductsPage.actions.getProductDescription(secondProductIndex).then((desc) => {
            const description = desc.trim();
            HomeProductsPage.actions.getProductPrice(secondProductIndex).then((priceText) => {
                const price = cleanAndParsePrice(priceText);
                expectedCartItems[description] = {
                    description,
                    price,
                    quantity: 1
                };
                overallExpectedGrandTotal += price;
                HomeProductsPage.actions.clickAddToCart(secondProductIndex);
            });
        });

        // Paso 4: Validar carrito y hacer checkout
        cy.then(() => {
            HomeProductsPage.actions.openCartModal();

            const itemsToFind = { ...expectedCartItems };
            CartPage.elements.getCartItemRows().should('have.length', Object.keys(expectedCartItems).length).each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((actualDescription) => {
                    const trimmedActualDescription = actualDescription.trim();
                    const expectedItem = itemsToFind[trimmedActualDescription];
                    expect(expectedItem, `Product "${trimmedActualDescription}" found in cart but was not expected`).to.exist;
                    CartPage.actions.validateItemDescription($row, expectedItem.description);
                    CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                    CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
                    delete itemsToFind[trimmedActualDescription];
                });
            }).then(() => {
                expect(Object.keys(itemsToFind).length, `Missing expected unique products in cart: ${Object.keys(itemsToFind).join(', ')}`).to.eq(0);
                CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
            });

            CartPage.actions.goToCheckout();

            const testCard = TEST_CARD_DATA.VISA_SUCCESS;

            CheckoutPage.actions.fillBuyerInformation({
                            name: faker.person.firstName(),
                            lastname: faker.person.lastName(),
                            email: faker.internet.email(),
                            address: faker.location.streetAddress(true),
                            country: 'Colombia' // Or use faker.location.country()
                        });


           CheckoutPage.actions.fillPaymentInformation({
                           nameHolder: faker.person.fullName(),
                           cardNumber: testCard.number,
                           securityCode: testCard.cvv,
                           expiryDate: testCard.ExpDate
                       });
           
                       // Submit Payment and Assert Success
                       CheckoutPage.actions.submitPayment();
                       cy.get('#swal2-html-container').should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');
                       CheckoutPage.actions.assertOrderSuccess();
                       cy.log('Checkout completed successfully with mixed products.');
                    });
    });

    it('adds multiple products from homepage and PDPs before and after login, validates cart and completes checkout', () => {
        // Productos a agregar SIN login
        const homepageIndicesBeforeLogin = [1, 3, 5];
        const pdpProductsBeforeLogin = [
            { slug: 'reloj-deportivo-gps', quantity: 3 },
            { slug: 'bandas-elasticas-de-resistencia', quantity: 1 }
        ];

        // Productos a agregar DESPUÉS de login
        const homepageIndicesAfterLogin = [2, 4];
        const pdpProductsAfterLogin = [
            { slug: 'camiseta-de-licra-deportiva-para-hombre', quantity: 3 },
            { slug: 'tapete-de-yoga-antideslizante', quantity: 1 }
        ];

        let expectedCartItems = {};
        let overallExpectedGrandTotal = 0;

        // --- Paso 1: Agregar productos del homepage SIN login ---
        HomeProductsPage.actions.visitHomePage();
        cy.wrap(homepageIndicesBeforeLogin).each((index) => {
            HomeProductsPage.actions.getProductDescription(index).then((desc) => {
                const description = desc.trim();
                HomeProductsPage.actions.getProductPrice(index).then((priceText) => {
                    const price = cleanAndParsePrice(priceText);
                    if (expectedCartItems[description]) {
                        expectedCartItems[description].quantity += 1;
                    } else {
                        expectedCartItems[description] = {
                            description,
                            price,
                            quantity: 1
                        };
                    }
                    overallExpectedGrandTotal += price;
                    HomeProductsPage.actions.clickAddToCart(index);
                });
            });
        });

        // --- Paso 2: Agregar productos desde PDPs SIN login ---
        cy.wrap(pdpProductsBeforeLogin).each((product) => {
            ProductDetailPage.actions.visitProductDetailPage(product.slug);
            ProductDetailPage.actions.getProductTitle().then((title) => {
                const description = title.trim();
                ProductDetailPage.actions.getProductPrice().then((price) => {
                     const priceStr = typeof price === 'string' ? price : String(price);
                    const unitPrice = cleanAndParsePrice2(priceStr);
                    cy.log('Precio PDP:', priceStr, 'Parseado:', unitPrice);
   
                    //const unitPrice = cleanAndParsePrice2(price);
                    if (expectedCartItems[description]) {
                        expectedCartItems[description].quantity += product.quantity;
                    } else {
                        expectedCartItems[description] = {
                            description,
                            price: unitPrice,
                            quantity: product.quantity
                        };
                    }
                    overallExpectedGrandTotal += unitPrice * product.quantity;
                    ProductDetailPage.actions.clickIncrementQuantityPDP(product.quantity, 1);
                    ProductDetailPage.actions.clickAddToCart();
                });
            });
        });

        // --- Paso 3: Login ---
        cy.fixture('login').then((user) => {
            LoginPageActions.actions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });

        // --- Paso 4: Agregar productos del homepage DESPUÉS de login ---
        cy.wrap(homepageIndicesAfterLogin).each((index) => {
            HomeProductsPage.actions.getProductDescription(index).then((desc) => {
                const description = desc.trim();
                HomeProductsPage.actions.getProductPrice(index).then((priceText) => {
                    const price = cleanAndParsePrice(priceText);
                    if (expectedCartItems[description]) {
                        expectedCartItems[description].quantity += 1;
                    } else {
                        expectedCartItems[description] = {
                            description,
                            price,
                            quantity: 1
                        };
                    }
                    overallExpectedGrandTotal += price;
                    HomeProductsPage.actions.clickAddToCart(index);
                });
            });
        });

        // --- Paso 5: Agregar productos desde PDPs DESPUÉS de login ---
        cy.wrap(pdpProductsAfterLogin).each((product) => {
            ProductDetailPage.actions.visitProductDetailPage(product.slug);
            ProductDetailPage.actions.getProductTitle().then((title) => {
                const description = title.trim();
                ProductDetailPage.actions.getProductPrice().then((price) => {
                    const unitPrice = cleanAndParsePrice2(price);
                    if (expectedCartItems[description]) {
                        expectedCartItems[description].quantity += product.quantity;
                    } else {
                        expectedCartItems[description] = {
                            description,
                            price: unitPrice,
                            quantity: product.quantity
                        };
                    }
                    overallExpectedGrandTotal += unitPrice * product.quantity;
                    ProductDetailPage.actions.clickIncrementQuantityPDP(product.quantity, 1);
                    ProductDetailPage.actions.clickAddToCart();
                });
            });
        });

        // --- Paso 6: Validar carrito y hacer checkout ---
        cy.then(() => {
            HomeProductsPage.actions.openCartModal();

            const itemsToFind = { ...expectedCartItems };
            CartPage.elements.getCartItemRows().should('have.length', Object.keys(expectedCartItems).length).each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((actualDescription) => {
                    const trimmedActualDescription = actualDescription.trim();
                    const expectedItem = itemsToFind[trimmedActualDescription];
                    expect(expectedItem, `Product "${trimmedActualDescription}" found in cart but was not expected`).to.exist;
                    CartPage.actions.validateItemDescription($row, expectedItem.description);
                    CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                    cy.log('Validando precio:', expectedItem.price, expectedItem.description);

                    CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
                    delete itemsToFind[trimmedActualDescription];
                });
            }).then(() => {
                expect(Object.keys(itemsToFind).length, `Missing expected unique products in cart: ${Object.keys(itemsToFind).join(', ')}`).to.eq(0);
                CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
            });

            CartPage.actions.goToCheckout();

            const testCard = TEST_CARD_DATA.VISA_SUCCESS;

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
            cy.get('#swal2-html-container').should('have.text', 'Tu orden se ha creado con éxito, podrás ver tu historial en tu cuenta');
            CheckoutPage.actions.assertOrderSuccess();
            cy.log('Checkout completed successfully with mixed products.');
        });
    });


});