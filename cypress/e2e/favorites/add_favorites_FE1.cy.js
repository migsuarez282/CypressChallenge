import FavoritePage from '../../support/pages/FavoritePage';
import LoginPageActions from '../../support/commands/LoginPageActions';
import products from '../../fixtures/products.json';

describe('Add and Delete Favorites (wishlist page) using the UI', () => {

    beforeEach(() => {
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
    });

    it('Add some products to favorites from PDP for multipleProducts', () => {
        FavoritePage.actions.visitWishlist();
                cy.wait(2000);
                function removeNext() {
                    cy.get('body').then(($body) => {
                        const $cards = $body.find('[data-at="favorite-card"]');
                        if ($cards.length === 0) {
                            cy.wait(500);
                            cy.contains('No has agregado ningún favorito', { timeout: 5000 }).should('be.visible');
                            return;
                        }
                        const href = $cards[0].getAttribute('href');
                        cy.visit(href);
                        cy.wait(2000);
                        cy.get('[data-at="remove-from-favorites"]').should('be.visible').click();
                        cy.wait(500);
                        FavoritePage.actions.visitWishlist();
                        cy.wait(2000);
                        removeNext();
                    });
                }
        
                removeNext();
        
        
        const productSlugs = products.multipleProductsForCheckout.map(product => product.slug);
        const productSlug1 = 'banda-elastica-de-resistencia';
        FavoritePage.actions.addProductToFavoritesBySlug(productSlug1);
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            const initialFavorites = $item.length;

            FavoritePage.actions.addMultipleProductsToFavoritesUI(productSlugs);

            FavoritePage.actions.visitWishlist();
            FavoritePage.elements.getFavoriteCards().should('have.length', initialFavorites + productSlugs.length);
        });
    });
   

    it('Add all products to favorites from PDP', () => {
        
        FavoritePage.actions.visitWishlist();
                cy.wait(2000);
                function removeNext() {
                    cy.get('body').then(($body) => {
                        const $cards = $body.find('[data-at="favorite-card"]');
                        if ($cards.length === 0) {
                            cy.wait(500);
                            cy.contains('No has agregado ningún favorito', { timeout: 5000 }).should('be.visible');
                            return;
                        }
                        const href = $cards[0].getAttribute('href');
                        cy.visit(href);
                        cy.wait(2000);
                        cy.get('[data-at="remove-from-favorites"]').should('be.visible').click();
                        cy.wait(500);
                        FavoritePage.actions.visitWishlist();
                        cy.wait(2000);
                        removeNext();
                    });
                }
        
                removeNext();
        
        
        const productSlugs = products.allProductsForCheckout.map(product => product.slug);
        const productSlug1 = 'banda-elastica-de-resistencia';

        FavoritePage.actions.addProductToFavoritesBySlug(productSlug1);
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            const initialFavorites = $item.length;

            FavoritePage.actions.addMultipleProductsToFavoritesUI(productSlugs);

            FavoritePage.actions.visitWishlist();
            FavoritePage.elements.getFavoriteCards().should('have.length', initialFavorites + productSlugs.length);
        });
    });
   

});