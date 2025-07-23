import FavoritePageElements from '../elements/FavoritePageElements';
import FavoritePage from '../../support/pages/FavoritePage';

class FavoritePageActions {
    visitWishlist() {
        cy.visit('/whishlist');
    }

    getFavoritesCount() {
        return FavoritePageElements.getFavoriteCards().its('length');
    }

    addProductToFavoritesBySlug(slug) {
        cy.visit(`/products/${slug}`);
        cy.wait(600);
        FavoritePageElements.getAddToFavoritesButton().click();
    }

    addFirstProductToFavorites() {
        cy.visit('');
        FavoritePageElements.getProductCardByIndex(0).click();
        cy.wait(500);
        FavoritePageElements.getAddToFavoritesButton().click();
    }

   removeAllFavoritesUI() {
    const removeNext = () => {
        FavoritePageElements.getFavoriteCards().then(($cards) => {
            if ($cards.length === 0) {
                // Assertion: Verifica que no hay favoritos y aparece el mensaje
                cy.contains('No has agregado ningún favorito').should('be.visible');
                FavoritePageElements.getFavoriteCards().should('not.exist');
                return;
            }
            cy.wrap($cards[0]).click({ timeout: 10000 });
            cy.get('[data-at="remove-from-favorites"]', { timeout: 10000 }).should('be.visible').click();
            cy.get('[data-at="add-to-favorites"]', { timeout: 10000 }).should('be.visible');
            FavoritePage.actions.visitWishlist();
            removeNext();
        });
    };
    removeNext();
}

    addMultipleProductsToFavoritesUI(productSlugs) {
    const addNext = (index) => {
        if (index >= productSlugs.length) return;
        cy.visit(`/products/${productSlugs[index]}`);
        cy.wait(300); // Ajusta si la UI es lenta
        FavoritePageElements.getAddToFavoritesButton().click();
        addNext(index + 1);
    };
    addNext(0);
   }
}

export default new FavoritePageActions();