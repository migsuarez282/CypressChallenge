import HomePage from '../../support/pages/HomeProductsPage';
import ProductDetailPage from '../../support/pages/ProductDetailPage';
import CartPage from '../../support/pages/CartPage';
import products from '../../fixtures/products.json'; // Fixture for product data
import { cleanAndParsePrice } from '../../support/utils/helpers'; // Helper for price manipulation


describe('Add to Cart Functionality, products from Product Detail Page and Homepage', () => {

    // --- Test Case 1: Add a single product from pdp --- ✅
    // and a single product from homepage, validate the grand total --- ✅
    it('adds a single product from PDP and one from homepage, then validates the cart modal', () => {
        const pdpProduct = {
            slug: 'mancuernas-recubiertas-de-neopreno',
            desiredQuantity: 1
        };
        const homepageProduct = {
            index: 3,
            desiredQuantity: 1
        };

        let expectedCartItems = {}; // Stores expected item details, keyed by description
        let overallExpectedGrandTotal = 0; // Accumulates the total price

        // --- Phase 1: Add Product from Product Detail Page (PDP) ---
        cy.log('Adding product from PDP...');
        ProductDetailPage.actions.visitProductDetailPage(pdpProduct.slug);

        ProductDetailPage.actions.getProductTitle().then((title) => {
            const productTitle = title.trim();
            ProductDetailPage.actions.getProductPrice().then((price) => {
                const productPriceNumeric = price;

                expectedCartItems[productTitle] = {
                    description: productTitle,
                    price: productPriceNumeric,
                    quantity: pdpProduct.desiredQuantity
                };
                overallExpectedGrandTotal += (productPriceNumeric * pdpProduct.desiredQuantity);

                ProductDetailPage.actions.clickAddToCart({ scrollBehavior: false });
                cy.wait(500); // Wait for cart update
            });
        });

        // --- Phase 2: Add Product from Homepage ---
        cy.log('Adding product from Homepage...');
        HomePage.actions.visitHomePage();

        HomePage.elements.getProductCard(homepageProduct.index).then(($productCard) => {
            HomePage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                const productDescription = descriptionText.trim();

                HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                    const productPriceCleaned = cleanAndParsePrice(priceText);

                    expectedCartItems[productDescription] = {
                        description: productDescription,
                        price: productPriceCleaned,
                        quantity: homepageProduct.desiredQuantity
                    };
                    overallExpectedGrandTotal += (productPriceCleaned * homepageProduct.desiredQuantity);

                    HomePage.actions.clickAddToCart(homepageProduct.index);
                    cy.wait(500); // Wait for cart update
                });
            });
        });

        // --- Phase 3: Open Cart Modal and Validate Contents ---
        cy.log('Opening cart modal and validating contents...');
        HomePage.actions.openCartModal();
        cy.wait(2000); // Wait for the modal to fully open

        CartPage.elements.getCartItemRows()
            .should('be.visible');

        CartPage.elements.getCartItemRows().each(($row) => {
            CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                const actualDescription = descriptionCart.trim();
                const expectedItem = expectedCartItems[actualDescription];

                expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected`).to.exist;

                CartPage.actions.validateItemDescription($row, expectedItem.description);
                CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                CartPage.actions.validateItemPrice($row, expectedItem.price * expectedItem.quantity);
            });
        }).then(() => {
            CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
        });
    });

    // --- Test Case 2: Add some products from pdp  --- ✅
    // and a some products from homepage, validate the grand total --- ✅
    it('adds some products from homepage and PDPs, then validates the combined cart modal', () => {
        const productsToAdd = [{
            index: 3,
            desiredQuantity: 4
        }, {
            index: 5,
            desiredQuantity: 3
        }, {
            index: 2,
            desiredQuantity: 1
        }, {
            index: 0,
            desiredQuantity: 10
        }, {
            index: 1,
            desiredQuantity: 3
        }];

        const pdpProductsToAdd = [{
            slug: 'mancuernas-recubiertas-de-neopreno',
            quantity: 2
        }, {
            slug: 'bandas-elasticas-de-resistencia',
            quantity: 3
        }, {
            slug: 'camiseta-de-licra-deportiva-para-hombre',
            quantity: 10
        }, ];

        let expectedCartItems = {}; // Stores expected item details, handles quantities
        let overallExpectedGrandTotal = 0; // Accumulates the total price

        // --- Phase 1: Add Products from Homepage ---
        HomePage.actions.visitHomePage();
        cy.log('Adding products from Homepage...');
        cy.wrap(productsToAdd).each((productInfo) => {
            const productIndex = productInfo.index;
            const desiredQuantity = productInfo.desiredQuantity;

            HomePage.elements.getProductCard(productIndex).then(($productCard) => {
                HomePage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                    const productDescription = descriptionText.trim();

                    HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                        const productCleanedPrice = cleanAndParsePrice(priceText);

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

                        for (let i = 0; i < desiredQuantity; i++) {
                            HomePage.actions.clickAddToCart(productIndex);
                            cy.wait(100); // Small wait after each click
                        }
                    });
                });
            });
        }).then(() => {
            // --- Phase 2: Add Products from Product Detail Pages (PDPs) ---
            cy.log('Adding products from PDPs...');
            cy.wrap(pdpProductsToAdd).each((productInfo) => {
                const { slug, quantity: desiredQuantity } = productInfo;

                ProductDetailPage.actions.visitProductDetailPage(slug);

                ProductDetailPage.actions.getProductTitle().then((productTitle) => {
                    const title = productTitle.trim();

                    ProductDetailPage.actions.getProductPrice().then((unitPrice) => {
                        if (expectedCartItems[title]) {
                            expectedCartItems[title].quantity += desiredQuantity;
                            expectedCartItems[title].price = unitPrice;
                        } else {
                            expectedCartItems[title] = {
                                description: title,
                                price: unitPrice,
                                quantity: desiredQuantity
                            };
                        }
                        overallExpectedGrandTotal += (unitPrice * desiredQuantity);

                        ProductDetailPage.actions.clickIncrementQuantityPDP(desiredQuantity, 1);
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

            const totalUniqueItemsInCart = Object.keys(expectedCartItems).length;
            CartPage.elements.getCartItemRows()
                .should('have.length', totalUniqueItemsInCart)
                .should('be.visible');

            const itemsToFindForValidation = { ...expectedCartItems
            };

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
        });
    });

    // --- Test Case 3: Add all products from pdp, fixture allProductsForCheckout --- ✅
    // and all the products from homepage, validate the grand total --- ✅
    it('adds all homepage products and all Pdp products, then validates the combined cart modal', () => {
        let expectedCartItems = {}; // Stores expected item details, handles quantities
        let overallExpectedGrandTotal = 0; // Accumulates the total price
        HomePage.actions.visitHomePage();

        // --- Phase 1: Add ALL Products from Homepage ---
        cy.log('Adding ALL products from Homepage...');
        cy.get('[data-at="product-card"]').then(($productCards) => {
            const numberOfProductsFoundOnHomepage = $productCards.length;
            const productIndices = Array.from({
                length: numberOfProductsFoundOnHomepage
            }, (_, i) => i);

            cy.wrap(productIndices).each((productIndex) => {
                HomePage.elements.getProductCard(productIndex).then(($productCard) => {
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

                            HomePage.actions.clickAddToCart(productIndex);
                            cy.wait(100); // Small wait for UI update
                        });
                    });
                });
            });
        }).then(() => {
            // --- Phase 2: Add ALL Products from Product Detail Pages (PDPs) ---
            cy.log('Adding ALL products from PDPs...');
            cy.wrap(products.allProductsForCheckout).each((productFromFixture) => {
                const slug = productFromFixture.slug;
                const desiredQuantityOnPDP = 1;

                ProductDetailPage.actions.visitProductDetailPage(slug);

                ProductDetailPage.actions.getProductTitle().then((productTitle) => {
                    const title = productTitle.trim();
                    const unitPrice = Number(productFromFixture.price);

                    if (expectedCartItems[title]) {
                        expectedCartItems[title].quantity += desiredQuantityOnPDP;
                        expectedCartItems[title].price = unitPrice;
                    } else {
                        expectedCartItems[title] = {
                            description: title,
                            price: unitPrice,
                            quantity: desiredQuantityOnPDP
                        };
                    }
                    overallExpectedGrandTotal += (unitPrice * desiredQuantityOnPDP);

                    ProductDetailPage.actions.clickAddToCart();
                    cy.wait(500); // Wait after each add-to-cart from PDP
                });
            });
        }).then(() => {
            // --- Phase 3: Open Cart Modal and Validate Combined Contents ---
            cy.log('Opening cart modal and validating combined contents...');

            HomePage.actions.openCartModal();
            cy.wait(5000); // Wait for the modal to fully open and populate

            const totalUniqueItemsInCart = Object.keys(expectedCartItems).length;
            CartPage.elements.getCartItemRows()
                .should('have.length', totalUniqueItemsInCart)
                .should('be.visible');

            const itemsToFindForValidation = { ...expectedCartItems
            };

            CartPage.elements.getCartItemRows().each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                    const actualDescription = descriptionCart.trim();
                    const expectedItem = itemsToFindForValidation[actualDescription];

                    expect(expectedItem, `Product "${actualDescription}" found in cart but was not expected.`).to.exist;

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
        });
    });
});