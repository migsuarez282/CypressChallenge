// cypress/support/pages/product/ProductDetailPageElements.js

import utilities from '../utilities'; // Assuming correct path

class ProductDetailPageElements {
    // Selector for the product title on the PDP
    productTitle() {
        return cy.get('.text-3xl').eq(0); // Adjust if your product title has a specific data-at or class
    }

    // Selector for the product price on the PDP
    productPrice() {
        return cy.get('.text-2xl'); // Adjust if your product price has a specific data-at or class
    }

    // Selector for the 'Add to Cart' button on the PDP
    addToCartButton() {
        return cy.get('.text-md').eq(1); // Adjust if your PDP Add to Cart button has a specific data-at or class
    }

    // Selector for the quantity input field on the PDP (if adjustable)
    incrementQuantityButtonPDP() {
        return cy.get('[data-at="increment-quantity"]'); // Adjust if quantity input has a specific selector
    }
    quantityDecrement() {
        return cy.get('data-at="decrement-quantity"'); // Adjust if quantity input has a specific selector
    }
   
    quantityDisplay() { // Renamed from quantityInput to reflect it's a display <span>
        return cy.get('.border > .px-4')
        //cy.get('span.px-4.py-2'); // Selector for the <span> that displays the quantity
    }
}

export default new ProductDetailPageElements();