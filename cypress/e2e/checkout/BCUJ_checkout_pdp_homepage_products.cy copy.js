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


describe('End-to-End Checkout Process, pdp homepage products, initial login', () => {

    // Global setup for checkout tests: Login user, add product, navigate to checkout form
    beforeEach(() => {
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {

                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });

    });

    // --- Test Case 1: Add a single product from pdp 
    // and products from homepage, successful checkout--- ✅

    it('adds product from pdp and products from homepage, validates cart, and completes checkout', () => {
        // Define the product to add from the PDP
        const pdpProduct = {
            slug: 'mancuernas-recubiertas-de-neopreno',
            quantity: 2 // Quantity to set on PDP
        };

        // Define products to add from the HOMEPAGE
        const homepageProducts = [{
            index: 3, // Product at index 3 on homepage
            desiredClicks: 1 // Click its add-to-cart button 1 time
        }, {
            index: 5, // Product at index 5 on homepage
            desiredClicks: 3 // Click its add-to-cart button 3 times
        }];

        // This map will store the expected details of all unique items in the cart.
        let expectedCartItems = {};
        // This will accumulate the total expected price for all items in the cart.
        let overallExpectedGrandTotal = 0;

        // --- Phase 1: Add Product from Product Detail Page (PDP) ---
        cy.log('Adding product from PDP...');
        ProductDetailPage.actions.visitProductDetailPage(pdpProduct.slug);

        ProductDetailPage.actions.getProductTitle().then((title) => {
            const productTitle = title.trim();
            ProductDetailPage.actions.getProductPrice().then((price) => {
                const productPriceNumeric = price;

                // Update expectedCartItems for the PDP product
                expectedCartItems[productTitle] = {
                    description: productTitle,
                    price: productPriceNumeric,
                    quantity: pdpProduct.quantity
                };
                overallExpectedGrandTotal += (productPriceNumeric * pdpProduct.quantity);

                // Set quantity on PDP via increment buttons and add to cart
                ProductDetailPage.actions.clickIncrementQuantityPDP(pdpProduct.quantity, 1);
                ProductDetailPage.actions.clickAddToCart();
                cy.wait(500); // Wait for cart update after PDP add
            });
        });

        // --- Phase 2: Add Products from Homepage ---
        // Ensure we are back on the homepage after PDP actions
        HomePage.actions.visitHomePage();
        cy.log('Adding products from Homepage...');

        cy.wrap(homepageProducts).each((productInfo) => {
            const productIndex = productInfo.index;
            const clicksToAdd = productInfo.desiredClicks;

            HomePage.elements.getProductCard(productIndex).then(($productCard) => {
                HomePage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                    const productDescription = descriptionText.trim();

                    HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        const productCleanedPrice = cleanAndParsePrice(priceText);

                        // Update expectedCartItems: handle duplicates and quantities from homepage clicks
                        if (expectedCartItems[productDescription]) {
                            expectedCartItems[productDescription].quantity += clicksToAdd;
                        } else {
                            expectedCartItems[productDescription] = {
                                description: productDescription,
                                price: productCleanedPrice,
                                quantity: clicksToAdd
                            };
                        }
                        overallExpectedGrandTotal += (productCleanedPrice * clicksToAdd); // Add total price for homepage clicks

                        // Click 'Add to Cart' on the homepage 'clicksToAdd' times
                        for (let i = 0; i < clicksToAdd; i++) {
                            HomePage.actions.clickAddToCart(productIndex);
                            cy.wait(100); // Small wait after each click
                        }
                    });
                });
            });
        }).then(() => {
            // --- Phase 3: Open Cart Modal and Validate Combined Contents ---
            cy.log('Opening cart modal and validating combined contents...');
            HomePage.actions.openCartModal();
            cy.wait(2000); // Wait for the modal to fully open and populate

            const totalUniqueItemsInCart = Object.keys(expectedCartItems).length;
            CartPage.elements.getCartItemRows()
                .should('have.length', totalUniqueItemsInCart)
                .should('be.visible');

            const itemsToFindForValidation = { ...expectedCartItems };

            CartPage.elements.getCartItemRows().each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                    const actualDescription = descriptionCart.trim();
                    const expectedItem = itemsToFindForValidation[actualDescription];

                    expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected.`).to.exist;

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
        }).then(() => {
            // --- Phase 4: Proceed to Checkout ---
            cy.log('Proceeding to checkout...');
            CartPage.actions.goToCheckout();

            const testCard = TEST_CARD_DATA.VISA_SUCCESS; // Assuming successful card for this scenario

            // Fill Buyer Information
            CheckoutPage.actions.fillBuyerInformation({
                name: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                address: faker.location.streetAddress(true),
                country: 'Colombia' // Or use faker.location.country()
            });

            // Fill Payment Information
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

    // --- Test Case 2: Add some products from pdp  
    // and some products from homepage,  successful checkout --- ✅

    it('adds some products from homepage and pdp, then validates cart, and complets checkout', () => {
        // Define products to add from the HOMEPAGE
        const productsToAdd = [{
            index: 3, // First product on homepage
            desiredQuantity: 4 // Assuming 1 per click, if no quantity input
        }, {
            index: 5, // Another product on homepage
            desiredQuantity: 3
        },
        {
            index: 2, // Another product on homepage
            desiredQuantity: 1
        }, {
            index: 0, // Another product on homepage
            desiredQuantity: 10
        }, {
            index: 1, // Another product on homepage
            desiredQuantity: 3
        }
        ];

        // Define products to add from their PRODUCT DETAIL PAGES (PDPs)
        const pdpProductsToAdd = [{
            slug: 'mancuernas-recubiertas-de-neopreno',
            quantity: 2 // Can specify multiple for PDP
        }, {
            slug: 'bandas-elasticas-de-resistencia',
            quantity: 3
        }, {
            slug: 'camiseta-de-licra-deportiva-para-hombre',
            quantity: 10
        },
        ];

        // This object will store the expected details of all items in the cart (keyed by description).
        // It will handle quantities correctly if a product is added multiple times (e.g., same product from homepage AND PDP, or multiple quantity from PDP).
        let expectedCartItems = {};
        // This will accumulate the total expected price for all items in the cart.
        let overallExpectedGrandTotal = 0;

        // --- Phase 1: Add Products from Homepage ---
        HomePage.actions.visitHomePage();
        cy.log('Adding products from Homepage...');
        cy.wrap(productsToAdd).each((productInfo) => {
            const productIndex = productInfo.index;
            const desiredQuantity = productInfo.desiredQuantity; // For homepage, typically just 1 item per click unless quantity specified

            HomePage.elements.getProductCard(productIndex).then(($productCard) => {
                HomePage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                    const productDescription = descriptionText.trim();

                    HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        const productCleanedPrice = cleanAndParsePrice(priceText);

                        // Update expectedCartItems: handle duplicates and quantities
                        if (expectedCartItems[productDescription]) {
                            expectedCartItems[productDescription].quantity += desiredQuantity;
                        } else {
                            expectedCartItems[productDescription] = {
                                description: productDescription,
                                price: productCleanedPrice,
                                quantity: desiredQuantity
                            };
                        }
                        overallExpectedGrandTotal += (productCleanedPrice * desiredQuantity);

                        // Click 'Add to Cart' on the homepage
                        // HomePage.actions.clickAddToCart(productIndex);
                        // cy.wait(100); // Small wait for cart update
                        for (let i = 0; i < desiredQuantity; i++) {
                            HomePage.actions.clickAddToCart(productIndex);
                            cy.wait(100); // Small wait after each individual click
                        }
                    });
                });
            });
        }).then(() => {
            // --- Phase 2: Add Products from Product Detail Pages (PDPs) ---
            cy.log('Adding products from PDPs...');
            cy.wrap(pdpProductsToAdd).each((productInfo) => {
                const { slug, quantity: desiredQuantity } = productInfo;

                ProductDetailPage.actions.visitProductDetailPage(slug); // Visit the PDP

                ProductDetailPage.actions.getProductTitle().then((productTitle) => {
                    const title = productTitle.trim();

                    ProductDetailPage.actions.getProductPrice().then((unitPrice) => {
                        // Update expectedCartItems: handle quantities for PDP products
                        if (expectedCartItems[title]) {
                            expectedCartItems[title].quantity += desiredQuantity;
                            // Re-calculate price if quantity changes for existing item
                            expectedCartItems[title].price = unitPrice; // Ensure unit price is up-to-date
                        } else {
                            expectedCartItems[title] = {
                                description: title,
                                price: unitPrice,
                                quantity: desiredQuantity
                            };
                        }
                        // Accumulate grand total for this specific item's quantity
                        overallExpectedGrandTotal += (unitPrice * desiredQuantity);

                        // Set quantity on PDP and add to cart
                        ProductDetailPage.actions.clickIncrementQuantityPDP(desiredQuantity, 1); // Clicks from default 1 up to desiredQuantity
                        ProductDetailPage.actions.clickAddToCart();
                        cy.wait(500); // Wait after each add-to-cart
                    });
                });
            });
        }).then(() => {
            // --- Phase 3: Open Cart Modal and Validate Combined Contents ---
            cy.log('Opening cart modal and validating combined contents...');
            HomePage.actions.openCartModal();
            
            cy.wait(2000); // Wait for the modal to fully open

            // Assert the total number of unique items in the cart modal
            const totalUniqueItemsInCart = Object.keys(expectedCartItems).length;
            CartPage.elements.getCartItemRows()
                .should('have.length', totalUniqueItemsInCart)
                .should('be.visible');

            // Use a copy to track items found during validation, ensuring all expected items are present.
            const itemsToFindForValidation = { ...expectedCartItems };

            CartPage.elements.getCartItemRows().each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                    const actualDescription = descriptionCart.trim();
                    const expectedItem = itemsToFindForValidation[actualDescription];

                    expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;

                    CartPage.actions.validateItemDescription($row, expectedItem.description);
                    CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                    CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity); // Validate item's total price

                    delete itemsToFindForValidation[actualDescription]; // Remove from copy once validated
                });
            }).then(() => {
                // Final assertion: ensure all expected unique products were found in the cart
                expect(Object.keys(itemsToFindForValidation).length,
                    `Missing expected unique products in cart: ${Object.keys(itemsToFindForValidation).join(', ')}`)
                    .to.eq(0);

                // Validate the overall grand total
                CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
            });

            CartPage.actions.goToCheckout();
            const testCard = TEST_CARD_DATA.VISA_SUCCESS; // Assuming successful card for this scenario

            // Fill Buyer Information
            CheckoutPage.actions.fillBuyerInformation({
                name: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                address: faker.location.streetAddress(true),
                country: 'Colombia' // Or use faker.location.country()
            });

            // Fill Payment Information
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

    // --- Test Case 3: Add all products from pdp  
    // and all products from homepage,  successful checkout --- ✅

    it('adds all homepage products and all Pdp products, then validates the combined cart modal', () => {
            // This object will store the expected details of all unique items in the cart (keyed by description).
            // It's designed to correctly aggregate quantities if the same product is added multiple times from different sources.
            let expectedCartItems = {};
            // This will accumulate the total expected price for all items in the cart.
            let overallExpectedGrandTotal = 0;
            HomePage.actions.visitHomePage();
                     
            // --- Phase 1: Add ALL Products from Homepage ---
            cy.log('Adding ALL products from Homepage...');
            cy.get('[data-at="product-card"]').then(($productCards) => {
                const numberOfProductsFoundOnHomepage = $productCards.length;
                const productIndices = Array.from({ length: numberOfProductsFoundOnHomepage }, (_, i) => i);
    
                cy.wrap(productIndices).each((productIndex) => {
                    HomePage.elements.getProductCard(productIndex).then(($productCard) => {
                        HomePage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                            const productDescription = descriptionText.trim();
    
                            HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                                const productCleanedPrice = cleanAndParsePrice(priceText);
    
                                // Update expectedCartItems: Each click adds 1 to the product's total.
                                if (expectedCartItems[productDescription]) {
                                    expectedCartItems[productDescription].quantity += 1;
                                } else {
                                    expectedCartItems[productDescription] = {
                                        description: productDescription,
                                        price: productCleanedPrice,
                                        quantity: 1
                                    };
                                }
                                overallExpectedGrandTotal += productCleanedPrice; // Add unit price to total
    
                                // Click 'Add to Cart' on the homepage
                                HomePage.actions.clickAddToCart(productIndex);
                                cy.wait(100); // Small wait for cart badge/UI update after each click.
                            });
                        });
                    });
                });
            }).then(() => {
                // --- Phase 2: Add ALL Products from Product Detail Pages (PDPs) ---
                cy.log('Adding ALL products from PDPs...');
                // Loop through all products defined in your fixture for PDP additions
                cy.wrap(products.allProductsForCheckout).each((productFromFixture) => {
                    const slug = productFromFixture.slug;
                    // Assuming you add 1 quantity of each PDP product, or adjust if your fixture has `productFromFixture.quantity`
                    const desiredQuantityOnPDP = 1; // Or productFromFixture.quantity if applicable
    
                    ProductDetailPage.actions.visitProductDetailPage(slug); // Visit the specific PDP
    
                    ProductDetailPage.actions.getProductTitle().then((productTitle) => {
                        const title = productTitle.trim();
                        const unitPrice = Number(productFromFixture.price); // Get price from fixture for accuracy
    
                        // Update expectedCartItems: add 'desiredQuantityOnPDP' to the product's total.
                        if (expectedCartItems[title]) {
                            expectedCartItems[title].quantity += desiredQuantityOnPDP;
                            // Update unit price in case it was added from homepage first and price differs slightly
                            expectedCartItems[title].price = unitPrice;
                        } else {
                            expectedCartItems[title] = {
                                description: title,
                                price: unitPrice,
                                quantity: desiredQuantityOnPDP
                            };
                        }
                        // Accumulate grand total: unit price * quantity set on PDP.
                        overallExpectedGrandTotal += (unitPrice * desiredQuantityOnPDP);
    
                        // Add to cart from PDP (assuming default quantity if no incrementer)
                        // If your PDP requires incrementing to 'desiredQuantityOnPDP', use:
                        // ProductDetailPage.actions.clickIncrementQuantityPDP(desiredQuantityOnPDP, 1);
                        ProductDetailPage.actions.clickAddToCart();
                        cy.wait(500); // Wait after each add-to-cart from PDP.
                    });
                });
            }).then(() => {
                // This `.then()` ensures all product additions from both sources are complete.
    
                // --- Phase 3: Open Cart Modal and Validate Combined Contents ---
                cy.log('Opening cart modal and validating combined contents...');
                HomePage.actions.openCartModal();
                
                cy.wait(2000); // Give time for the modal to fully open and populate.
    
                // Assert the total number of unique items (rows) in the cart modal.
                const totalUniqueItemsInCart = Object.keys(expectedCartItems).length;
                CartPage.elements.getCartItemRows()
                    .should('have.length', totalUniqueItemsInCart)
                    .should('be.visible');
    
                // Create a mutable copy to track items found during validation, ensuring all expected items are present.
                const itemsToFindForValidation = { ...expectedCartItems };
    
                // Iterate through each actual item row in the cart modal for validation.
                CartPage.elements.getCartItemRows().each(($row) => {
                    CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                        const actualDescription = descriptionCart.trim();
                        const expectedItem = itemsToFindForValidation[actualDescription];
    
                        // Assert that the item found in the cart was indeed one we expected.
                        expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected.`).to.exist;
    
                        // Validate quantity for the current item in the cart.
                        CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                        // Validate total price for the current item in the cart (unit price * expected quantity).
                        CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
    
                        // Remove the item from our tracking map once it has been validated.
                        delete itemsToFindForValidation[actualDescription];
                    });
                }).then(() => {
                    // Final assertion: ensure all expected unique products were found and validated in the cart.
                    expect(Object.keys(itemsToFindForValidation).length,
                        `Missing expected unique products in cart: ${Object.keys(itemsToFindForValidation).join(', ')}`)
                        .to.eq(0);
    
                    // Validate the overall grand total displayed in the cart footer.
                    CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
                });
                CartPage.actions.goToCheckout();
            const testCard = TEST_CARD_DATA.VISA_SUCCESS; // Assuming successful card for this scenario

            // Fill Buyer Information
            CheckoutPage.actions.fillBuyerInformation({
                name: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                address: faker.location.streetAddress(true),
                country: 'Colombia' // Or use faker.location.country()
            });

            // Fill Payment Information
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

});