// cypress/support/pages/cart/CartPageActions.js

import CartPageElements from '../elements/CartPageElements';
import { cleanAndParsePrice } from '../utils/helpers';

class CartPageActions {
    getCartItemCount() {
        return CartPageElements.getCartItemRows().its('length');
    }

    getCartItemDescription(rowElement) {
        return CartPageElements.getCartItemDescription(rowElement).invoke('text');
    }

    getCartItemQuantity(rowElement) {
        return CartPageElements.getCartItemQuantity(rowElement).invoke('text');
    }

    getCartItemPrice(rowElement) {
        return CartPageElements.getCartItemPrice(rowElement).invoke('text');
    }

    getGrandTotalText() {
        return CartPageElements.getGrandTotalText().invoke('text');
    }

    clearCart() {
        CartPageElements.getClearCartButton().click();
    }

    trashCart() {
        CartPageElements.getClearTrashIcon().click({ multiple: true });
        cy.wait(10000);
    }

    clickAllTrashIcons() {
        CartPageElements.getAllTrashIcons().click({ multiple: true });
        cy.wait(10000); // Give time for all deletions to process and UI to update
    }

    goToCheckout() {
        CartPageElements.getCheckoutButton().click();
    }

    validateItemDescription(rowElement, expectedDescription) {
        this.getCartItemDescription(rowElement).then(actualDescription => {
            expect(actualDescription.trim()).to.eq(expectedDescription.trim(), `Description mismatch for cart item`);
        });
    }

    validateItemQuantity(rowElement, expectedQuantity) {
        this.getCartItemQuantity(rowElement).then(actualQuantity => {
            expect(actualQuantity.trim()).to.eq(expectedQuantity.toString(), `Quantity mismatch for cart item`);
        });
    }

    validateItemPrice(rowElement, expectedPrice) {
        this.getCartItemPrice(rowElement).then(actualPrice => {
            const cleanedActualPrice = cleanAndParsePrice(actualPrice);
            expect(cleanedActualPrice, `Price mismatch for cart item`).to.be.closeTo(expectedPrice, 0.01);
        });
    }

    validateGrandTotal(expectedTotal) {
        this.getGrandTotalText().then(grandTotalText => {
            const cleanedGrandTotal = cleanAndParsePrice(grandTotalText.replace('Total: ', ''));
            expect(cleanedGrandTotal, `Grand total mismatch`).to.be.closeTo(expectedTotal, 0.02);
        });
    }

    addAllHomepageProductsToCart() {
        cy.get('[data-at="product-card"]').then(($productCards) => {
            const productIndices = Array.from({ length: $productCards.length }, (_, i) => i);
            cy.wrap(productIndices).each((productIndex) => {
                cy.get('.align-middle.select-none').eq(productIndex).click();
                cy.wait(100); // Espera corta para estabilidad
            });
        });
    }

}

export default new CartPageActions();