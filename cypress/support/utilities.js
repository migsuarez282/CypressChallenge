class utilities {
    static getByCssSelector(selector, ...args) {
        return cy.get(`[data-qa="${selector}"]`, ...args);
    }
    static getById(selector, ...args) {
        return cy.get(`#${selector}`, ...args);
    }
    static getByButtonClass(selector, ...args) {
        return cy.get(`button[class="${selector}"]`, ...args);
    }
    static getByClass(selector, ...args) {
        return cy.get(`[class="${selector}"]`, ...args);
    }
    static getByName(selector, ...args) {
        return cy.get(`[name="${selector}"]`, ...args);
    }
    static getRandomData(json) {
        const data = {};
        for (let key in json) {
            const values = json[key];
            const randomIndex = Math.floor(Math.random() * values.length);
            data[key] = values[randomIndex];
        }
        return data;
    }
}
export default utilities;
