describe('Example of Huge library', () => {
    beforeEach(() => {
      cy.visit('https://rahulshettyacademy.com/AutomationPractice/')
    })
    it('Check broken links', () => {
      cy.checkBrokenLinks()
    })
    it('Open link same tab removing attribute target', () => {
      cy.openTab('#opentab')
    })
    it('Open link same tab intercepting window open', () => {
      cy.openTab2('#openwindow', 'https://www.qaclickacademy.com/')
    })
    it('Iframe use', () => {
      cy.switchIFrame('#courses-iframe')
        .find('.price-title h2 span')
        .should('have.text','why we are')
    })
})