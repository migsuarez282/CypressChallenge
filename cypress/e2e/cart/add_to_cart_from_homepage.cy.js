import HomeProductsPage from '../../support/pages/HomeProductsPage';
import CartPage from '../../support/pages/CartPage';
import { cleanAndParsePrice } from '../../support/utils/helpers'; // Import helper

describe('Add to Cart Functionality, products from Homepage', () => {

    beforeEach(() => {
        HomeProductsPage.actions.visitHomePage();
    });

    // --- Test Case 1: Add a single product from homepage --- ✅
    it('adds a single product to the cart and validates the item in the modal', () => {
        const productIndex = 3;
        let productDescription; // Save product description for validation
        let productPriceText; // Save product price text for validation

        HomeProductsPage.actions.getProductDescription(productIndex).then((description) => {
            productDescription = description.trim();
        });

        HomeProductsPage.actions.getProductPrice(productIndex).then((price) => {
            productPriceText = price.trim();
        });

        HomeProductsPage.actions.clickAddToCart(productIndex);
        HomeProductsPage.actions.openCartModal();

        CartPage.elements.getCartItemRows().should('have.length', 1).then(($row) => {
            CartPage.actions.validateItemDescription($row, productDescription);
            CartPage.actions.validateItemQuantity($row, 1);
            CartPage.actions.validateItemPrice($row, cleanAndParsePrice(productPriceText));
        });
    });

    // --- Test Case 1': Add a single product increment (any business rule for max quantity?) --- ✅
    it('adds the same product in multiple quantities and validates cart modal information (with grand total)', () => {
        const productIndex = 3;
        const desiredQuantity = 10;

        let productDescription;
        let unitPriceCleaned;

        HomeProductsPage.actions.getProductDescription(productIndex).then((description) => {
            productDescription = description.trim();
            HomeProductsPage.actions.getProductPrice(productIndex).then((priceTextFromCard) => {
                unitPriceCleaned = cleanAndParsePrice(priceTextFromCard);

                // Add the product to the cart the desired number of times
                for (let i = 0; i < desiredQuantity; i++) {
                    HomeProductsPage.actions.clickAddToCart(productIndex);
                    cy.wait(300); // Short wait for stability
                }

                HomeProductsPage.actions.openCartModal();

                // Validate the item's details in the cart modal
                CartPage.elements.getCartItemRows().should('have.length', 1).then(($row) => {
                    CartPage.actions.validateItemDescription($row, productDescription);
                    CartPage.actions.validateItemQuantity($row, desiredQuantity);
                    CartPage.actions.validateItemPrice($row, unitPriceCleaned * desiredQuantity);
                });

                // Validate the grand total in the cart footer
                CartPage.actions.validateGrandTotal(unitPriceCleaned * desiredQuantity);
            });
        });
    });

    // --- Test Case 2: Add multiple different products --- ✅
    it('adds multiple different products to the cart and validates items in the modal match', () => {
        const productsToAdd = [{
            index: 0
        }, {
            index: 2
        }, {
            index: 10
        }, {
            index: 13
        }];

        let expectedCartItems = []; // Store product details for later validation

        cy.wrap(productsToAdd).each((productInfo) => {
            const productIndex = productInfo.index;

            HomeProductsPage.elements.getProductCard(productIndex).then(($productCard) => {
                HomeProductsPage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                    const productDescription = descriptionText.trim();

                    HomeProductsPage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        const productCleanedPrice = cleanAndParsePrice(priceText);

                        expectedCartItems.push({
                            description: productDescription,
                            price: productCleanedPrice
                        });

                        cy.get('.align-middle.select-none').eq(productIndex).click();
                        cy.wait(100);
                    });
                });
            });
        }).then(() => {
            HomeProductsPage.actions.openCartModal();

            CartPage.elements.getCartItemRows().each((cartItemElement, index) => {
                const expectedItem = expectedCartItems[index];

                CartPage.actions.validateItemDescription(cartItemElement, expectedItem.description);
                CartPage.actions.validateItemQuantity(cartItemElement, 1);
                CartPage.actions.validateItemPrice(cartItemElement, expectedItem.price);
            });
        });
    });

    // --- Test Case 3: Add all HomeProductsPage products (with duplicates prducts) --- ✅
    it('adds all homepage products to cart and validates items in modal (duplicates, grand total)', () => {
        let expectedCartItems = {}; // Use an object to handle potential duplicate products and aggregate quantities
        let overallExpectedGrandTotal = 0; // Calculate the total price

        cy.get('[data-at="product-card"]').then(($productCards) => {
            const numberOfProductsFoundOnHomepage = $productCards.length;
            const productIndices = Array.from({
                length: numberOfProductsFoundOnHomepage
            }, (_, i) => i);

            cy.wrap(productIndices).each((productIndex) => {
                HomeProductsPage.elements.getProductCard(productIndex).then(($productCard) => {
                    HomeProductsPage.elements.getProductDescription($productCard).invoke('text').then((description) => {
                        const productDescription = description.trim();

                        HomeProductsPage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
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
                            overallExpectedGrandTotal += productPriceCleaned; // Sum up prices for grand total

                            cy.get('.align-middle.select-none').eq(productIndex).click();
                            cy.wait(100);
                        });
                    });
                });
            }).then(() => {
                HomeProductsPage.actions.openCartModal();

                const expectedDescriptionsSet = new Set(Object.keys(expectedCartItems));

                CartPage.elements.getCartItemRows().each(($row) => {
                    CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                        const actualDescription = descriptionCart.trim();
                        const expectedItem = expectedCartItems[actualDescription];

                        expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;
                        expectedDescriptionsSet.delete(actualDescription);

                        CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                        CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
                    });
                }).then(() => {
                    expect(expectedDescriptionsSet.size, `Missing expected unique products in cart: ${Array.from(expectedDescriptionsSet).join(', ')}`).to.eq(0);

                    CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
                });
            });
        });
    });

    // --- Test Case 4: Add the same products("2") from homepage multiple times (any business rule for max quantity?)--- ✅
    it('adds the same products(2) in multiple quantities and validates cart modal information (with grand total)', () => {
        const productsToAddToCart = [{
            index: 1,
            desiredQuantity: 10
        }, {
            index: 4,
            desiredQuantity: 10
        }];

        let expectedCartItems = {}; // Store expected items for validation
        let overallExpectedGrandTotal = 0; // Calculate the total price

        cy.wrap(productsToAddToCart).each((productInfo) => {
            const productIndex = productInfo.index;
            const desiredQuantity = productInfo.desiredQuantity;

            HomeProductsPage.actions.getProductDescription(productIndex).then((description) => {
                const productDescription = description.trim();

                HomeProductsPage.actions.getProductPrice(productIndex).then((priceTextFromCard) => {
                    const unitPriceCleaned = cleanAndParsePrice(priceTextFromCard);

                    expectedCartItems[productDescription] = {
                        description: productDescription,
                        price: unitPriceCleaned,
                        quantity: desiredQuantity
                    };

                    overallExpectedGrandTotal += (unitPriceCleaned * desiredQuantity);
                });
            });
        }).then(() => {
            cy.wrap(overallExpectedGrandTotal).as('expectedGrandTotal'); // Alias the grand total for later use

            cy.wrap(productsToAddToCart).each((productInfo) => {
                const productIndex = productInfo.index;
                const desiredQuantity = productInfo.desiredQuantity;

                for (let i = 0; i < desiredQuantity; i++) {
                    HomeProductsPage.actions.clickAddToCart(productIndex);
                }
            });
        }).then(() => {
            HomeProductsPage.actions.openCartModal();

            const itemsToFind = { ...expectedCartItems
            }; // Create a copy to track found items

            CartPage.elements.getCartItemRows().should('have.length', Object.keys(expectedCartItems).length).each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((actualDescription) => {
                    const trimmedActualDescription = actualDescription.trim();
                    const expectedItem = itemsToFind[trimmedActualDescription];

                    expect(expectedItem, `Product "${trimmedActualDescription}" found in cart but was not expected, or duplicated validation`).to.exist;

                    CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                    CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);

                    delete itemsToFind[trimmedActualDescription]; // Remove found item from tracking object
                });
            }).then(() => {
                expect(Object.keys(itemsToFind).length, `Missing expected unique products in cart: ${Object.keys(itemsToFind).join(', ')}`).to.eq(0);

                cy.get('@expectedGrandTotal').then((expectedGrandTotal) => {
                    CartPage.actions.validateGrandTotal(expectedGrandTotal);
                });
            });
        });
    });
});