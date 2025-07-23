class FavoritePageElements {
    getFavoriteCards() {
        return cy.get('[data-at="favorite-card"]');
    }

    getAddToFavoritesButton() {
        return cy.get('[data-at="add-to-favorites"]',{ timeout: 5000 });
    }

    getProductCardByIndex(index = 0) {
        return cy.get('.rounded-sm.aspect-square').eq(index);
    }
}

export default new FavoritePageElements();