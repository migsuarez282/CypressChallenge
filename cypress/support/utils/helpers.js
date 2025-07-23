// cypress/support/utils/helpers.js

export const cleanAndParsePrice = (priceString) => {
    if (typeof priceString !== 'string' || !priceString.trim()) {
        return NaN;
    }
    const cleaned = priceString.trim().replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
};

export function updateExpectedCart(expectedCartItems, productDescription, productCleanedPrice, desiredQuantity) {
    if (expectedCartItems[productDescription]) {
        expectedCartItems[productDescription].quantity += desiredQuantity;
    } else {
        expectedCartItems[productDescription] = {
            description: productDescription,
            price: productCleanedPrice,
            quantity: desiredQuantity
        };
    }
    return productCleanedPrice * desiredQuantity;
}

export function cleanAndParsePrice2(priceText) {
    if (!priceText) return 0;
    const str = typeof priceText === 'string' ? priceText : String(priceText);
    const cleaned = str.replace(/[^\d.,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}