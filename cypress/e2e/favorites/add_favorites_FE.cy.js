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



    it('Add products to favorites first element in homepage', () => {
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

        const productSlug = 'banda-elastica-de-resistencia';
        FavoritePage.actions.addProductToFavoritesBySlug(productSlug);
        FavoritePage.actions.visitWishlist();
        cy.wait(2000);
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('favorite');
        });

        FavoritePage.actions.addFirstProductToFavorites();
        FavoritePage.actions.visitWishlist();
        cy.wait(2000);
        cy.get('@favorite').then((favoritesList) => {
            FavoritePage.elements.getFavoriteCards().then(($updatedList) => {
                expect($updatedList).to.have.length(favoritesList + 1);
            });
        });
    });
    it('Delete all products from favorites, no using description', () => {
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

    });


    it('Add only a product to favorites from PDP, using slug', () => {

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




        const productSlug1 = 'banda-elastica-de-resistencia';
        const productSlug2 = 'mancuernas-recubiertas-de-neopreno';

        FavoritePage.actions.addProductToFavoritesBySlug(productSlug1);

        FavoritePage.actions.visitWishlist();
         cy.wait(2000);
        FavoritePage.elements.getFavoriteCards().then(($items) => {
            const initialCount = $items.length;

            FavoritePage.actions.addProductToFavoritesBySlug(productSlug2);

            FavoritePage.actions.visitWishlist();
             cy.wait(2000);
            FavoritePage.elements.getFavoriteCards().should('have.length', initialCount + 1);
        });
    });
    it('Delete all products from favorites, no using description', () => {
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

    });



});