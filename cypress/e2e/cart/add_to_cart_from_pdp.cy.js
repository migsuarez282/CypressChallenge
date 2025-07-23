import HomePage from '../../support/pages/HomeProductsPage';
import ProductDetailPage from '../../support/pages/ProductDetailPage';
import CartPage from '../../support/pages/CartPage';
import products from '../../fixtures/products.json';

describe('Add to Cart Functionality, products from Product Detail Page', () => {
   
    // --- Test Case 1: Add a single product from pdp --- ✅
    it('adds a single product from its detail page to the cart and validates', () => {
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
    });

    // --- Test Case 2: Add some products from pdp  --- ✅
    it('adds multiple products from different detail pages and validates cart', () => {
        const productsToAddToCart = [{
            slug: 'mancuernas-recubiertas-de-neopreno',
            quantity: 1
        }, {
            slug: 'set-de-pesas-ajustables',
            quantity: 1
        }, {
            slug: 'bandas-elasticas-de-resistencia',
            quantity: 1
        }, {
            slug: 'gafas-de-natacion-recubiertas',
            quantity: 1
        }];

        let expectedCartItemsMap = {};
        let overallExpectedGrandTotal = 0;

        cy.wrap(productsToAddToCart).each((productInfo) => {
            const {
                slug,
                quantity: desiredQuantity
            } = productInfo;

            ProductDetailPage.actions.visitProductDetailPage(slug);

            ProductDetailPage.actions.getProductTitle().then((productTitle) => {
                const title = productTitle.trim();

                ProductDetailPage.actions.getProductPrice().then((unitPrice) => {
                    expectedCartItemsMap[title] = {
                        description: title,
                        price: unitPrice,
                        quantity: desiredQuantity,
                        totalItemPrice: unitPrice * desiredQuantity
                    };
                    overallExpectedGrandTotal += (unitPrice * desiredQuantity);

                    ProductDetailPage.actions.clickIncrementQuantityPDP(desiredQuantity, 1);
                    ProductDetailPage.actions.clickAddToCart();
                    cy.wait(500);
                });
            });
        }).then(() => {
            HomePage.actions.openCartModal();

            const totalUniqueItemsInCart = Object.keys(expectedCartItemsMap).length;
            CartPage.elements.getCartItemRows().should('exist')
                .and('be.visible')
                .and('have.length', totalUniqueItemsInCart);

            const actualDescriptionsFound = new Set();

            CartPage.elements.getCartItemRows().each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                    const actualDescription = descriptionCart.trim();
                    actualDescriptionsFound.add(actualDescription);

                    const expectedItem = expectedCartItemsMap[actualDescription];

                    expect(expectedItem, `Product "${actualDescription}" found in cart but not expected.`).to.exist;

                    CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                    CartPage.actions.validateItemPrice($row, expectedItem.totalItemPrice);
                });
            }).then(() => {
                const missingItems = Object.keys(expectedCartItemsMap).filter(desc => !actualDescriptionsFound.has(desc));
                expect(missingItems.length,
                    `Missing expected products in cart: ${missingItems.join(', ')}`)
                    .to.eq(0);
            });

            CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
        });
    });

    // --- Test Case 2: Add all products from pdp, fixture allProductsForCheckout --- ✅
    it('adds all products from detail pages, grand total, validates cart modal', () => {
        let expectedCartItems = {};
        let overallExpectedGrandTotal = 0;

        products.allProductsForCheckout.forEach((product) => {
            cy.visit(`/products/${product.slug}`);

            const productDescription = product.name.trim();
            const productPriceCleaned = Number(product.price);

            cy.get('[data-at="add-to-cart"]').click();
            cy.wait(100);

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

        HomePage.actions.openCartModal();

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

    // --- Test Case 4: Add a single product increment in pdp (any business rule for max quantity?) --- ✅
    it('adds product with incremented 10 quantity from PDP and validates in cart', () => {
        const initialQuantityOnPDP = 1;
        const finalDesiredQuantity = 10;
        let productTitle;

        const TEST_PRODUCT_SLUG = 'mancuernas-recubiertas-de-neopreno';
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
        });
    });

    // --- Test Case 5: Add some products increment in pdp (any business rule for max quantity?) --- ✅
    it('adds multiple products(increment) from different detail pages and validates cart', () => {
        const productsToAddToCart = [{
            slug: 'mancuernas-recubiertas-de-neopreno',
            quantity: 2
        }, {
            slug: 'set-de-pesas-ajustables',
            quantity: 6
        }, {
            slug: 'bandas-elasticas-de-resistencia',
            quantity: 10
        }, {
            slug: 'gafas-de-natacion-recubiertas',
            quantity: 8
        }];

        let expectedCartItemsMap = {};
        let overallExpectedGrandTotal = 0;

        cy.wrap(productsToAddToCart).each((productInfo) => {
            const {
                slug,
                quantity: desiredQuantity
            } = productInfo;

            ProductDetailPage.actions.visitProductDetailPage(slug);

            ProductDetailPage.actions.getProductTitle().then((productTitle) => {
                const title = productTitle.trim();

                ProductDetailPage.actions.getProductPrice().then((unitPrice) => {
                    expectedCartItemsMap[title] = {
                        description: title,
                        price: unitPrice,
                        quantity: desiredQuantity,
                        totalItemPrice: unitPrice * desiredQuantity
                    };
                    overallExpectedGrandTotal += (unitPrice * desiredQuantity);

                    ProductDetailPage.actions.clickIncrementQuantityPDP(desiredQuantity, 1);
                    ProductDetailPage.actions.clickAddToCart();
                    cy.wait(500);
                });
            });
        }).then(() => {
            HomePage.actions.openCartModal();

            const totalUniqueItemsInCart = Object.keys(expectedCartItemsMap).length;
            CartPage.elements.getCartItemRows().should('exist')
                .and('be.visible')
                .and('have.length', totalUniqueItemsInCart);

            const actualDescriptionsFound = new Set();

            CartPage.elements.getCartItemRows().each(($row) => {
                CartPage.actions.getCartItemDescription($row).then((descriptionCart) => {
                    const actualDescription = descriptionCart.trim();
                    actualDescriptionsFound.add(actualDescription);

                    const expectedItem = expectedCartItemsMap[actualDescription];

                    expect(expectedItem, `Product "${actualDescription}" found in cart but not expected.`).to.exist;

                    CartPage.actions.validateItemQuantity($row, expectedItem.quantity);
                    CartPage.actions.validateItemPrice($row, expectedItem.totalItemPrice);
                });
            }).then(() => {
                const missingItems = Object.keys(expectedCartItemsMap).filter(desc => !actualDescriptionsFound.has(desc));
                expect(missingItems.length,
                    `Missing expected products in cart: ${missingItems.join(', ')}`)
                    .to.eq(0);
            });

            CartPage.actions.validateGrandTotal(overallExpectedGrandTotal);
        });
    });
});
