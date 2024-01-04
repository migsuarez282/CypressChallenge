describe('Visuals', () => {
  it('should compare screenshot of the entire page', () => {
    cy.visit('login');
    cy.compareSnapshot('enterprise ind', 0.1);
  })

  it('should compare screenshot of the entire page', () => {
    cy.visit('products');
    cy.compareSnapshot('products', 0.1);
  })

  it('should compare screenshot of the entire page', () => {
    cy.visit('view_cart');
    cy.compareSnapshot('view_cart', 0.1);
  })
})
