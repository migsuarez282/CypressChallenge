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



    it('Add products to favorites first element in homepage', () => {
        //The wishlist shoul be empty at the beginning
        const productSlug = 'banda-elastica-de-resistencia';
        FavoritePage.actions.addProductToFavoritesBySlug(productSlug);
        FavoritePage.actions.visitWishlist();
        cy.wait(500);
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('favorite');
        });

        FavoritePage.actions.addFirstProductToFavorites();
        FavoritePage.actions.visitWishlist();
        cy.wait(500);
        cy.get('@favorite').then((favoritesList) => {
            FavoritePage.elements.getFavoriteCards().then(($updatedList) => {
                expect($updatedList).to.have.length(favoritesList + 1);
            });
        });
    });
    it.only('Delete all products from favorites, no using description', () => {
        FavoritePage.actions.visitWishlist();
        FavoritePage.actions.removeAllFavoritesUI();

        // Verifica que no quedan favoritos
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().should('have.length', 0);
    });


    it('Add only a product to favorites from PDP, using slug', () => {
        const productSlug1 = 'banda-elastica-de-resistencia';
        const productSlug2 = 'mancuernas-recubiertas-de-neopreno';

        // Agrega el primer producto
        FavoritePage.actions.addProductToFavoritesBySlug(productSlug1);

        // Guarda el número inicial de favoritos
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($items) => {
            const initialCount = $items.length;

            // Agrega el segundo producto
            FavoritePage.actions.addProductToFavoritesBySlug(productSlug2);

            // Verifica que se agregó correctamente
            FavoritePage.actions.visitWishlist();
            FavoritePage.elements.getFavoriteCards().should('have.length', initialCount + 1);
        });
    });
    it('Delete all products from favorites, no using description', () => {
        FavoritePage.actions.visitWishlist();
        FavoritePage.actions.removeAllFavoritesUI();

        // Verifica que no quedan favoritos
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().should('have.length', 0);
    });



});