import FavoritePage from '../../support/pages/FavoritePage';
import LoginPageActions from '../../support/commands/LoginPageActions';
import ProductDetailPage from '../../support/pages/ProductDetailPage';


describe('Add and Delete Favorites (wishlist page) using the APIs', () => {

    beforeEach(() => {
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
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

    it('Add 2 products to favorites using API', () => {

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
        ProductDetailPage.actions.visitProductDetailPage(productSlug);   FavoritePage.actions.addProductToFavoritesBySlug(productSlug);
        FavoritePage.actions.visitWishlist();
        cy.wait(2000); 
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });

        const productIds = Array.from({ length: 2 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            cy.request({
                method: 'POST',
                url: 'https://api.laboratoriodetesting.com/api/v1/favorites', // Ajusta el endpoint según tu backend
                body: {
                    products: id 
                 },
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });

        FavoritePage.actions.visitWishlist();
        cy.wait(2000); 
        cy.get('@initialFavorites').then((initialFavorites) => {
            FavoritePage.elements.getFavoriteCards().then(($updatedList) => {
                expect($updatedList).to.have.length(initialFavorites + productIds.length);
            });
        });
    });
    it('Delete 2 products to favorites using API', () => {
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });


        const productIds = Array.from({ length: 2 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            cy.request({
                method: 'DELETE',
                url: `https://api.laboratoriodetesting.com/api/v1/favorites/${id}`,
                //body: {
                //  products: id 
                // },
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

        FavoritePage.actions.visitWishlist();
        cy.wait(2000); 
        FavoritePage.elements.getFavoriteCards().should('have.length', 1);

    });

    it('Add 8 products to favorites using API', () => {
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
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });

        const productIds = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            cy.request({
                method: 'POST',
                url: 'https://api.laboratoriodetesting.com/api/v1/favorites', // Ajusta el endpoint según tu backend
                body: {
                    products: id 
                 },
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });

        FavoritePage.actions.visitWishlist();
        cy.get('@initialFavorites').then((initialFavorites) => {
            FavoritePage.elements.getFavoriteCards().then(($updatedList) => {
                expect($updatedList).to.have.length(initialFavorites + productIds.length);
            });
        });
    });
    it('Delete 8 products to favorites using API', () => {
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });


        const productIds = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            cy.request({
                method: 'DELETE',
                url: `https://api.laboratoriodetesting.com/api/v1/favorites/${id}`,
                //body: {
                //  products: id 
                //  //},
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().should('have.length', 1);

    });

    it('Add all 19 products to favorites using API', () => {
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

        FavoritePage.actions.addProductToFavoritesBySlug(productSlug);
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });

        const productIds = Array.from({ length: 19 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            cy.request({
                method: 'POST',
                url: 'https://api.laboratoriodetesting.com/api/v1/favorites', // Ajusta el endpoint según tu backend
                body: {
                    products: id 
                  },
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });

       
        FavoritePage.actions.visitWishlist();
        cy.get('@initialFavorites').then((initialFavorites) => {
            FavoritePage.elements.getFavoriteCards().then(($updatedList) => {
                expect($updatedList).to.have.length(initialFavorites + productIds.length);
            });
        });
    });
    it('Delete all 19 products to favorites using API', () => {
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });
        const productIds = Array.from({ length: 19 }, (_, i) => (i + 1).toString());
        productIds.forEach((id) => {
            cy.request({
                method: 'DELETE',
                url: `https://api.laboratoriodetesting.com/api/v1/favorites/${id}`,
                //body: {
                //  products: id 
                //   //},
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().should('have.length', 1);

    });
});
