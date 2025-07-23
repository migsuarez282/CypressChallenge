
// cypress/support/pages/product/ProductDetailPageActions.js

import ProductDetailPageElements from '../elements/ProductDetailPageElements';
import CartPageElements from '../elements/CartPageElements';
import ProductDetailPage from '../commands/ProductDetailPageActions';

import { cleanAndParsePrice } from '../utils/helpers';
class ProductDetailPageActions {
    /**
     * Visits a specific product detail page.
     * @param {string} slug The product slug or ID from the URL (e.g., 'mancuernas-recubiertas-de-neopreno').
     */
    visitProductDetailPage(slug) {
        cy.visit(`/products/${slug}`);
    }

    /**
     * Gets the product title text from the PDP.
     * @returns {Cypress.Chainable<string>}
     */
    getProductTitle() {
        return ProductDetailPageElements.productTitle().invoke('text');
    }

    /**
     * Gets the product price text from the PDP and cleans/parses it.
     * @returns {Cypress.Chainable<number>}
     */
    getProductPrice() {
        return ProductDetailPageElements.productPrice().invoke('text').then(cleanAndParsePrice);
    }

    /**
     * Sets the desired quantity in the quantity input field on the PDP.
     * @param {number} quantity The desired quantity.
     */
    setQuantity(quantity) {
        ProductDetailPageElements.quantityInput().should('be.visible').clear().type(quantity.toString());
    }

    /**
     * Clicks the 'Add to Cart' button on the PDP.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    clickAddToCart() {
        return ProductDetailPageElements.addToCartButton().should('be.visible').click();
    }
  
  /*  incrementQuantity(itemIndex, clicks = 1) {
    CartPageElements.getCartItemRows().eq(itemIndex).then(($row) => {
        const incrementButton = CartPageElements.getIncrementQuantityButton($row);
        for (let i = 0; i < clicks; i++) {
            incrementButton.click();
            cy.wait(1000); // <-- Temporarily increase this for diagnosis
            // Alternatively, a more advanced wait:
            // CartPageElements.getCartItemQuantity($row).should('not.have.text', (i).toString()); // Wait for it to *not* be the previous count
            // CartPageElements.getCartItemQuantity($row).should('have.text', (initialQuantity + i + 1).toString()); // Wait for it to be the *next* count
        }
    });
   }

    clickDecrementQuantity() {
        return ProductDetailPageElements.quantityDecrement().should('be.visible').click();
    }*/
    clickIncrementQuantityPDP(targetQuantity, initialQuantity = 1) {
        const incrementButton = ProductDetailPageElements.incrementQuantityButtonPDP();
        const quantityDisplay = ProductDetailPageElements.quantityDisplay(); // Use the new quantityDisplay()
   // <--- ADD CY.PAUSE() HERE - Test will pause at this line

    cy.log(`DIAGNOSTIC: Starting increment clicks. Target quantity: ${targetQuantity}, Initial: ${initialQuantity}`);

        cy.log(`DIAGNOSTIC: Starting increment clicks. Target quantity: ${targetQuantity}, Initial: ${initialQuantity}`);

        const numberOfClicksNeeded = targetQuantity - initialQuantity;
        if (numberOfClicksNeeded < 0) {
            cy.log(`WARNING: Target quantity (${targetQuantity}) is less than initial (${initialQuantity}). No increment clicks performed.`);
            return;
        }

        for (let i = 0; i < numberOfClicksNeeded; i++) {
            const expectedValueAfterClick = initialQuantity + (i + 1);

            incrementButton.should('be.visible').click(); // Click the increment button

            // *** CRITICAL FIX: Assert .should('have.text') on the <span> element ***
            quantityDisplay.should('be.visible', expectedValueAfterClick.toString())
                           .then(($span) => { // Use $span for the resolved element
                               cy.log(`DIAGNOSTIC: PDP Display confirmed value: ${$span.text()}`);
                           });
            
            cy.wait(200); // Small buffer wait after each click and validation
        }
        cy.log(`DIAGNOSTIC: Finished increment clicks. Final PDP display value expected: ${targetQuantity}`);
    }

    /**
     * Clicks the decrement quantity button on the PDP multiple times,
     * validating the display <span>'s text content after each click.
     * @param {number} clicks The number of times to click the decrement button.
     * @param {number} [initialQuantity=1] The starting quantity in the display <span>.
     */


    clickDecrementQuantityPDP(clicks = 1) {
        ProductDetailPageElements.decrementQuantityButtonPDP().should('be.visible').click({ multiple: clicks });
    }


}

export default new ProductDetailPageActions();