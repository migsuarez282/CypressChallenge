import scrollToBottom from 'scroll-to-bottomjs';
import pages from '../fixtures/pages.json';

describe('Visual testing', () => {
  pages.forEach((pages) => {
    it('Visual testing ' + pages.id, function () {
      cy.visit(pages.url);
      cy.window().then(cyWindow => scrollToBottom({ remoteWindow: cyWindow }));
      cy.percySnapshot('Visual testing ' + pages.id);
    });
  });
});