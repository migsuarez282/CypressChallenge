import HomeProductsPage from '../../support/pages/HomeProductsPage';
import CartPage from '../../support/pages/CartPage';
import {
    cleanAndParsePrice
} from '../../support/utils/helpers';


describe('Clear the Cart Functionality Limpiar button and Trash icon', () => {
    beforeEach(() => {
        HomeProductsPage.actions.visitHomePage();
    });

    // --- Test Case 1: Add and clear a product from homepge, Limpiar button --- ✅
    it('adds and clear selecting just one product from homepage, Limpiar button', () => {
        const productIndex = 3;

        HomeProductsPage.actions.clickAddToCart(productIndex);

        cy.wait(200)
        CartPage.elements.getCartBadge()
            .should('be.visible');
        HomeProductsPage.actions.openCartModal();

        CartPage.elements.getCartItemRows().should('exist').and('be.visible');

        CartPage.actions.clearCart();

        CartPage.elements.getCartItemRows().should('not.exist');
    });

    // --- Test Case 2: Add and clear multiple products from homepge, Limpiar button --- ✅
    it('adds and clear selecting multiple products from homepage, Limpiar button', () => {
        const productsToAdd = [{
            index: 0
        }, {
            index: 2
        }, {
            index: 5
        }, {
            index: 7
        }];

        cy.wrap(productsToAdd).each((productInfo) => {
            const productIndex = productInfo.index;

            HomeProductsPage.elements.getProductCard(productIndex).then(($productCard) => {
                HomeProductsPage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                    cy.get('.align-middle.select-none').eq(productIndex).click();
                    cy.wait(200);
                });
            });
        }).then(() => {
            CartPage.elements.getCartBadge()
                .should('be.visible')
            cy.wait(100);
            HomeProductsPage.actions.openCartModal();

            CartPage.elements.getCartItemRows().should('exist')
                .and('have.length', productsToAdd.length);

            CartPage.actions.clearCart();

            CartPage.elements.getCartItemRows().should('not.exist');
        });
    });

    // --- Test Case 3: Add and clear a product from homepge, Trash icons --- ✅
    it('adds and clear selecting just one product from homepage: Trash icon', () => {
        const productIndex = 3;

        HomeProductsPage.actions.clickAddToCart(productIndex);

        cy.wait(200)
        CartPage.elements.getCartBadge()
            .should('be.visible');
       HomeProductsPage.actions.openCartModal();

        CartPage.elements.getCartItemRows().should('exist').and('be.visible');

        CartPage.actions.trashCart();

        CartPage.elements.getCartItemRows().should('not.exist');
    });

    // --- Test Case 4: Add and clear multiple products from homepge, Trash icons --- ✅
    it('adds and clear selecting multiple products from homepage: Trash icon', () => {
        const productsToAdd = [{
            index: 0
        }, {
            index: 2
        }, {
            index: 5
        }, {
            index: 7
        }, {
            index: 12
        }];
        const numberOfProducts = productsToAdd.length;

        let currentExpectedBadgeCount = 0;

        cy.wrap(productsToAdd).each((productInfo) => {
            const productIndex = productInfo.index;

            HomeProductsPage.elements.getProductCard(productIndex).then(($productCard) => {
                HomeProductsPage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                    currentExpectedBadgeCount++;

                    HomeProductsPage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        cleanAndParsePrice(priceText);

                        cy.get('.align-middle.select-none').eq(productIndex).click();

                        CartPage.elements.getCartBadge()
                            .should('be.visible');

                        cy.wait(50);

                    });
                });
            });
        }).then(() => {
            CartPage.elements.getCartBadge().should('be.visible')

            HomeProductsPage.actions.openCartModal();

            CartPage.elements.getCartItemRows().should('exist')
                .and('be.visible')
                .and('have.length', numberOfProducts);

            let itemsCount = numberOfProducts;

            function deleteNextItem() {
                if (itemsCount > 0) {
                    CartPage.elements.getCartItemRows().should('have.length', itemsCount)
                        .then(() => {
                            CartPage.elements.getCartItemRows().eq(0)
                                .find('button.grid.place-content-center')
                                .should('be.visible')
                                .click();
                        });

                    itemsCount--;

                    if (itemsCount > 0) {
                        CartPage.elements.getCartItemRows().should('have.length', itemsCount);
                    } else {
                        CartPage.elements.getCartItemRows().should('not.exist');
                    }

                    cy.wait(300);

                    deleteNextItem();
                }
            }

            deleteNextItem();
            CartPage.elements.getCartItemRows().should('not.exist');
        });
    });

    // --- Test Case 5: Add and clear all products from homepge, Limpiar button --- ✅
    it('adds and clear all homepage products to cart, Limpiar button', () => {
    let expectedCartItems = {};
    let overallExpectedGrandTotal = 0;

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
                        overallExpectedGrandTotal += productPriceCleaned;

                        cy.get('.align-middle.select-none').eq(productIndex).click();
                        cy.wait(100);
                    });
                });
            });
        }).then(() => {
            HomeProductsPage.actions.openCartModal();

            const expectedDescriptionsSet = new Set(Object.keys(expectedCartItems));
            const itemsToFindForValidation = { ...expectedCartItems
            };

            CartPage.elements.getCartItemRows().each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                    const actualDescription = descriptionCart.trim();
                    const expectedItem = itemsToFindForValidation[actualDescription];

                    expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;
                    expectedDescriptionsSet.delete(actualDescription);

                    CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                    CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);

                    delete itemsToFindForValidation[actualDescription];
                });
            }).then(() => {
                expect(expectedDescriptionsSet.size, `Missing expected unique products in cart: ${Array.from(expectedDescriptionsSet).join(', ')}`).to.eq(0);

                CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
            });
        }).then(() => {
            CartPage.actions.clearCart();

            CartPage.elements.getCartItemRows().should('not.exist');
        });
    });
    });

    // --- Test Case 6: Add and clear all products from homepge, Trash icons --- ✅
    it('adds and clear all homepage products, Trash icons', () => {
    let expectedCartItems = {};
    let currentExpectedBadgeCount = 0;

    cy.get('[data-at="product-card"]').then(($productCards) => {
        const numberOfProductsFoundOnHomepage = $productCards.length;
        const productIndices = Array.from({ length: numberOfProductsFoundOnHomepage }, (_, i) => i);

        cy.wrap(productIndices).each((productIndex) => {
            HomeProductsPage.elements.getProductCard(productIndex).then(($productCard) => {
                HomeProductsPage.elements.getProductDescription($productCard).invoke('text').then((description) => {
                    const productDescription = description.trim();

                    HomeProductsPage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        cleanAndParsePrice(priceText); // Parse price (if needed elsewhere)

                        if (expectedCartItems[productDescription]) {
                            expectedCartItems[productDescription].quantity += 1;
                        } else {
                            expectedCartItems[productDescription] = {
                                description: productDescription,
                                quantity: 1
                            };
                        }

                        cy.get('.align-middle.select-none').eq(productIndex).click();
                        cy.wait(100);

                        currentExpectedBadgeCount++;
                        CartPage.elements.getCartBadge().should('be.visible');
                        cy.wait(50);
                    });
                });
            });
        }).then(() => {
            CartPage.elements.getCartBadge().should('be.visible');
           HomeProductsPage.actions.openCartModal();
            // Correctly derive numberOfProducts from expectedCartItems,
            // as it reflects the unique items that will appear in the cart.
            const numberOfUniqueProductsInCart = Object.keys(expectedCartItems).length;

            CartPage.elements.getCartItemRows()
                .should('exist')
                .and('be.visible')
                .and('have.length', numberOfUniqueProductsInCart);

            let itemsCount = numberOfUniqueProductsInCart;

            function deleteNextItem() {
                if (itemsCount > 0) {
                    CartPage.elements.getCartItemRows().should('have.length', itemsCount).then(() => {
                        CartPage.elements.getCartItemRows().eq(0)
                            .find('button.grid.place-content-center')
                            .click();
                    });

                    itemsCount--;

                    if (itemsCount > 0) {
                        CartPage.elements.getCartItemRows().should('have.length', itemsCount);
                    } else {
                        CartPage.elements.getCartItemRows().should('not.exist');
                    }

                    cy.wait(300);
                    deleteNextItem();
                }
            }
            deleteNextItem();
            CartPage.elements.getCartItemRows().should('not.exist');
        });
    });
     });

});
