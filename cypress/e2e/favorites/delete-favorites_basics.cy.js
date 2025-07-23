import FavoritePage from '../../support/pages/FavoritePage';
import LoginPageActions from '../../support/commands/LoginPageActions';
import products from '../../fixtures/products.json';

describe('Delete Favorites Flows', () => {

    beforeEach(() => {
        // Login user before each test
        cy.fixture('login').then((user) => {
            LoginPageActions.apiLogin(user.email, user.password).then((response) => {
                window.localStorage.setItem('token', response.body.token);
                cy.setCookie('__AUTH-TOKEN-APP', response.body.token);
            });
        });
        cy.visit('/whishlist');
    });

    it('Delete product to favorites, first element', () => {
        cy.visit('whishlist');
        cy.get('[data-at="favorite-card"]').then(($item) =>{
            cy.wrap($item.length).as('favorite');
        });
        cy.visit('');
        cy.get('.rounded-sm.aspect-square').first().click();
        cy.get('[data-at="add-to-favorites"]').click();
        cy.visit('whishlist');
        cy.get('[data-at="favorite-card"]').last().click();
        cy.get('[data-at="remove-from-favorites"]').should('be.visible').click();
        cy.get('[data-at="add-to-favorites"]').should('be.visible');
        cy.visit('whishlist');
        cy.get('@favorite').then((favoritesList) =>{
        cy.get('[data-at="favorite-card"]').then(($updatedList) =>{
            expect($updatedList).to.have.length(favoritesList) //verifico que el num de items sea el mismo que cuando inicié el test
        });
    });
    }); 

    it('Delete favorite: product added from PDP using slug', () => {
    const productSlug = 'mancuernas-recubiertas-de-neopreno'; // Usa el mismo slug que agregaste en el test de favoritos

    // Guarda la cantidad inicial de favoritos
    cy.visit('/whishlist');
    cy.get('[data-at="favorite-card"]').then(($item) => {
        cy.wrap($item.length).as('favoriteCount');
    });

    // Visita el PDP y agrega el producto a favoritos
    cy.visit(`/products/${productSlug}`);
    cy.wait(500);
    cy.get('[data-at="add-to-favorites"]').click();

    // Vuelve a la whishlist y elimina el favorito recién agregado
    cy.visit('/whishlist');
    cy.get('[data-at="favorite-card"]').first().click();
    cy.get('[data-at="remove-from-favorites"]').should('be.visible').click();
    cy.get('[data-at="add-to-favorites"]').should('be.visible');

    // Verifica que el número de favoritos es igual al inicial
    cy.visit('/whishlist');
    cy.get('@favoriteCount').then((initialCount) => {
        cy.get('[data-at="favorite-card"]').then(($updatedList) => {
            expect($updatedList).to.have.length(initialCount);
        });
    });
    });

    it('Delete favorites: products added from PDP for multipleProducts', () => {   
    cy.visit('/whishlist');
    cy.get('[data-at="favorite-card"]').then(($item) => {
        cy.wrap($item.length).as('initialFavorites');
    });

    // Guarda las descripciones de los productos agregados
    const addedDescriptions = [];

    products.multipleProductsForCheckout.forEach((product) => {
        cy.visit(`/products/${product.slug}`);
        cy.wait(500);
         cy.get('h1.text-3xl.font-bold.mb-2').invoke('text').then((desc) => {
            addedDescriptions.push(desc.trim());
       });
        cy.get('[data-at="add-to-favorites"]').click();
        cy.wait(200);
    });

    cy.visit('/whishlist');
    cy.wrap(addedDescriptions).as('addedDescriptions');

  cy.get('@addedDescriptions').then((descriptions) => {
    function removeNext(index) {
        if (index >= descriptions.length) return;
         cy.visit('/whishlist');
        cy.get('[data-at="favorite-card"]').contains(descriptions[index])
            .parents('[data-at="favorite-card"]').click()

            cy.get('[data-at="remove-from-favorites"]')
            //.should('be.visible')
            .click()
            .then(() => {
                cy.wait(500);
                removeNext(index + 1);
            });
    }
    removeNext(0);
});

    // Verifica que el número de favoritos disminuyó en la cantidad eliminada
    cy.visit('/whishlist');
    cy.get('@initialFavorites').then((initialFavorites) => {
        cy.get('[data-at="favorite-card"]').then(($updatedList) => {
            expect($updatedList).to.have.length(initialFavorites);
        });
    });
    });

    it.only('Delete all products from favorites, no using description', () => {
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