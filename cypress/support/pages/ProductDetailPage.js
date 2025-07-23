// cypress/support/pages/product/ProductDetailPage.js

import ProductDetailPageElements from '../elements/ProductDetailPageElements';
import ProductDetailPageActions from '../commands/ProductDetailPageActions';

class ProductDetailPage {
    constructor() {
        this.elements = ProductDetailPageElements;
        this.actions = ProductDetailPageActions;
    }
}

export default new ProductDetailPage();