import FavoritePage from '../../support/pages/FavoritePage';
import LoginPageActions from '../../support/commands/LoginPageActions';
import products from '../../fixtures/products.json';

describe('Add and Delete Favorites (wishlist page) using the UI', () => {

    beforeEach(() => {
        // Phase 1: Log in a valid user via API and set token/cookie
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
    });

    it('Add some products to favorites from PDP for multipleProducts', () => {
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
    it('Delete all products from favorites, no using description', () => {
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($cards) => {
            const totalFavorites = $cards.length;
            if (totalFavorites === 0) return;

            // Elimina todos los favoritos uno por uno
            for (let i = 0; i < totalFavorites; i++) {
                FavoritePage.elements.getFavoriteCards().first().click();
                cy.get('[data-at="remove-from-favorites"]').should('be.visible').click();
                cy.get('[data-at="add-to-favorites"]').should('be.visible');
                FavoritePage.actions.visitWishlist();
            }
        });

        // Verifica que no quedan favoritos
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().should('have.length', 0);
    });

    it.only('Add all products to favorites from PDP', () => {
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
    it('Delete all products from favorites, no using description', () => {
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($cards) => {
            const totalFavorites = $cards.length;
            if (totalFavorites === 0) return;

            // Elimina todos los favoritos uno por uno
            for (let i = 0; i < totalFavorites; i++) {
                FavoritePage.elements.getFavoriteCards().first().click();
                cy.get('[data-at="remove-from-favorites"]').should('be.visible').click();
                cy.get('[data-at="add-to-favorites"]').should('be.visible');
                FavoritePage.actions.visitWishlist();
            }
        });

        // Verifica que no quedan favoritos
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().should('have.length', 0);
    });

});