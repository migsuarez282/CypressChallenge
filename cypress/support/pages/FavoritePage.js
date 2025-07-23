import FavoritePageElements from '../elements/FavoritePageElements';
import FavoritePageActions from '../commands/FavoritePageActions';

class FavoritePage {
    constructor() {
        this.elements = FavoritePageElements;
        this.actions = FavoritePageActions;
    }
}

export default new FavoritePage();