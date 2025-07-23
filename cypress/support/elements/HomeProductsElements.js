import utilities from '../utilities';

class HomePageElements {
 
    getProductCard(index) {
        // Returns Cypress chainable directly. No .then(), no cy.log().
        return utilities.getByCssSelector('product-card').eq(index);
    }

    getProductDescription(productCardElement) {
        // Returns Cypress chainable directly. No .then(), no cy.log().
        return cy.wrap(productCardElement).find('.block.font-sans').eq(0);
    }

    getProductPrice(productCardElement) {
        // Returns Cypress chainable directly. No .then(), no cy.log().
        return cy.wrap(productCardElement).find('.block.font-sans').eq(1);
    }

    getAddToCartButton(index) {
        // Returns Cypress chainable directly. No .then(), no cy.log().
        return cy.get('.align-middle.select-none').eq(index);
    }

    getCartIcon() {
        // Returns Cypress chainable directly. No .then(), no cy.log().
        //return cy.get('.relative.rounded-full').eq(0)
        return cy.get('.relative.rounded-full').eq(0)
        //return cy.get('.flex.justify-between.shadow-md').eq(4)
        //return utilities.getByCssSelector('cart-opener-mobile');
        //return utilities.getByClass('.relative.rounded-full').eq(0);
    }
}

export default new HomePageElements();