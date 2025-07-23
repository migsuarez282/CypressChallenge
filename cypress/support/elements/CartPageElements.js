import utilities from '../utilities';

class CartPageElements {
    /**
     * Gets the Cypress chainable for the main cart modal container.
     * Assumes it has `data-at="div[role="dialog"]"` or you might adjust to `cy.get('div[role="dialog"]')`
     * if it's a standard HTML attribute.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    // getCartModalContainer() {
    //     return utilities.getByCssSelector('div[role="dialog"]');
    // }

    /**
     * Gets the Cypress chainable for all cart item rows.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getCartItemRows() {
        return utilities.getByClass('cart-grid items-center');
    }

    /**
     * Gets the Cypress chainable for the description element within a cart item row.
     * Use with `cy.wrap(rowElement).find(...)`.
     * @param {Cypress.Chainable<JQuery<HTMLElement>>} rowElement The parent cart item row element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getCartItemDescription(rowElement) {
        return cy.wrap(rowElement).find('p.text-black').eq(0);
    }

    /**
     * Gets the Cypress chainable for the quantity element within a cart item row.
     * Use with `cy.wrap(rowElement).find(...)`.
     * @param {Cypress.Chainable<JQuery<HTMLElement>>} rowElement The parent cart item row element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getCartItemQuantity(rowElement) {
        return cy.wrap(rowElement).find('p.text-black').eq(1);
    }

    /**
     * Gets the Cypress chainable for the price element within a cart item row.
     * Use with `cy.wrap(rowElement).find(...)`.
     * @param {Cypress.Chainable<JQuery<HTMLElement>>} rowElement The parent cart item row element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getCartItemPrice(rowElement) {
        return cy.wrap(rowElement).find('p.text-black').eq(2);
    }

    /**
     * Gets the Cypress chainable for the grand total text element in the cart modal footer.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getGrandTotalText() {
        return utilities.getByClass('text-black text-center');
    }

    /**
     * Gets the Cypress chainable for the checkout button.
     * Note: utilities.getByClass requires the FULL class string match.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getCheckoutButton() {
        return utilities.getByClass('bg-primaryColor text-white p-3 rounded-lg w-full primary-cta-hover transition-all duration-200 mb-5 font-bold disabled:opacity-25');
    }

    /**
     * Gets the Cypress chainable for the clear cart button.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getClearCartButton() {
        return utilities.getByCssSelector('empty-cart');
    }

     getClearTrashIcon() {
        return cy.get('.grid.place-content-center')
        //return utilities.getByClass('.grid.place-content-center');
    }

    getAllTrashIcons() {
        // Find all trash icons directly within all cart item rows
        return this.getCartItemRows().find('button.grid.place-content-center');
    }



    getCartBadge() {
        // *** IMPORTANT: Adjust this selector based on your actual HTML structure. ***
        // It's usually a span or div *inside* the main cart icon element.
        // Example: If your badge is a span with specific styling, use that.
        // For the provided error message, the specific span classes are:
        // .relative.rounded-full.h-5.w-5.bg-pink-500.text-white.text-sm.grid.place-items-center
        return cy.get('.relative.rounded-full.h-5.w-5.bg-pink-500.text-white.text-sm.grid.place-items-center');
    }

}

export default new CartPageElements(); // Export an instance of the class
