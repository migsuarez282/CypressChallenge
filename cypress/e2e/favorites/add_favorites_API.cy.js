import FavoritePage from '../../support/pages/FavoritePage';
import LoginPageActions from '../../support/commands/LoginPageActions';

describe('Add and Delete Favorites (wishlist page) using the APIs', () => {

    beforeEach(() => {
        // Phase 1: Log in a valid user via API and set token/cookie
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
    });

    it('Delete all products from favorites, no using description', () => {
    FavoritePage.actions.visitWishlist();
    cy.get('body').then(($body) => {
        // Solo elimina si existen favoritos
        if ($body.find('[data-at="favorite-card"]').length > 0) {
            FavoritePage.elements.getFavoriteCards().then(($cards) => {
                for (let i = 0; i < $cards.length; i++) {
                    FavoritePage.elements.getFavoriteCards().first().click();
                    cy.get('[data-at="remove-from-favorites"]').should('be.visible').click();
                    cy.get('[data-at="add-to-favorites"]').should('be.visible');
                    FavoritePage.actions.visitWishlist();
                }
            });
        }
    });

    // Verifica que no quedan favoritos
    FavoritePage.actions.visitWishlist();
    FavoritePage.elements.getFavoriteCards().should('not.exist');
    });

    it('Add 2 products to favorites using API', () => {
        const productSlug = 'banda-elastica-de-resistencia'; // Cambia por el slug que necesites
        FavoritePage.actions.addProductToFavoritesBySlug(productSlug);
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });

        const productIds = Array.from({ length: 2 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            // Llama a la API para agregar todos los productos favoritos
            cy.request({
                method: 'POST',
                url: 'https://api.laboratoriodetesting.com/api/v1/favorites', // Ajusta el endpoint según tu backend
                body: {
                    products: id // Reemplaza con los IDs de tus productos
                },
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });

        // Verifica en la UI que se agregaron todos
        FavoritePage.actions.visitWishlist();
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
            // Llama a la API para agregar todos los productos favoritos
            cy.request({
                method: 'DELETE',
                url: `https://api.laboratoriodetesting.com/api/v1/favorites/${id}`,
                //body: {
                //  products: id // Reemplaza con los IDs de tus productos
                //},
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

    it('Add 8 products to favorites using API', () => {
        const productSlug = 'banda-elastica-de-resistencia'; // Cambia por el slug que necesites
        FavoritePage.actions.addProductToFavoritesBySlug(productSlug);
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });

        const productIds = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            // Llama a la API para agregar todos los productos favoritos
            cy.request({
                method: 'POST',
                url: 'https://api.laboratoriodetesting.com/api/v1/favorites', // Ajusta el endpoint según tu backend
                body: {
                    products: id // Reemplaza con los IDs de tus productos
                },
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });

        // Verifica en la UI que se agregaron todos
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
            // Llama a la API para agregar todos los productos favoritos
            cy.request({
                method: 'DELETE',
                url: `https://api.laboratoriodetesting.com/api/v1/favorites/${id}`,
                //body: {
                //  products: id // Reemplaza con los IDs de tus productos
                //},
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

    it('Add all 19 products to favorites using API', () => {
        const productSlug = 'banda-elastica-de-resistencia'; // Cambia por el slug que necesites
        FavoritePage.actions.addProductToFavoritesBySlug(productSlug);
        FavoritePage.actions.visitWishlist();
        FavoritePage.elements.getFavoriteCards().then(($item) => {
            cy.wrap($item.length).as('initialFavorites');
        });
       
        const productIds = Array.from({ length: 19 }, (_, i) => (i + 1).toString());

        productIds.forEach((id) => {
            // Llama a la API para agregar todos los productos favoritos
            cy.request({
                method: 'POST',
                url: 'https://api.laboratoriodetesting.com/api/v1/favorites', // Ajusta el endpoint según tu backend
                body: {
                    products: id // Reemplaza con los IDs de tus productos
                },
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });

        // Verifica en la UI que se agregaron todos
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
            // Llama a la API para agregar todos los productos favoritos
            cy.request({
                method: 'DELETE',
                url: `https://api.laboratoriodetesting.com/api/v1/favorites/${id}`,
                //body: {
                //  products: id // Reemplaza con los IDs de tus productos
                //},
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