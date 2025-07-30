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