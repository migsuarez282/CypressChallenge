// cypress/support/pages/home/HomePageActions.js

import HomePageElements from '../elements/HomeProductsElements';
import HomePage from '../pages/HomeProductsPage';

class HomePageActions {
    visitHomePage() {
        cy.visit('/');
    }

   getProductDescription(index) {
        // Chain directly off the product card selection
        return HomePageElements.getProductCard(index)
                               .find('.block.font-sans').eq(0) // Directly find the element
                               .invoke('text');
    }

    getProductPrice(index) {
        // Chain directly off the product card selection
        return HomePageElements.getProductCard(index)
                               .find('.block.font-sans').eq(1) // Directly find the element
                               .invoke('text');
    }

    clickAddToCart(index) {
        HomePageElements.getAddToCartButton(index)
          //.should('not.be.disabled')
          .click({force: true});
        cy.wait(500);
    }

    openCartModal() {
        HomePageElements.getCartIcon()
          //.should('be.visible')
          .click({force: true});
        cy.wait(500);
    }

    getCartIconText() {
        return HomePageElements.getCartIcon().invoke('text');
    }

    addProductsToCartFromHomepage(productsToAdd) {
    cy.wrap(productsToAdd).each((productInfo) => {
        const { index, desiredQuantity } = productInfo;
        HomePage.elements.getProductCard(index).then(($productCard) => {
            HomePage.elements.getProductDescription($productCard).invoke('text').then((descriptionText) => {
                HomePage.elements.getProductPrice($productCard).invoke('text').then((priceText) => {
                    // Agrega el producto la cantidad deseada
                    for (let i = 0; i < desiredQuantity; i++) {
                        HomePage.actions.clickAddToCart(index);
                        cy.wait(100);
                    }
                });
            });
        });
    });
}
}


export default new HomePageActions();