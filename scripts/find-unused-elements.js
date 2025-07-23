const fs = require('fs');
const path = require('path');

const elementsDir = path.join(__dirname, '../cypress/support/elements');
const commandsDir = path.join(__dirname, '../cypress/support/commands');
const e2eDir = path.join(__dirname, '../cypress/e2e');

// Recursivamente obtiene todos los archivos de un directorio
function getAllFiles(dir) {
    let results = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
}

// Busca métodos en los archivos de elements
function getElementMethods(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const methodRegex = /(\w+)\s*\(/g;
    const methods = [];
    let match;
    while ((match = methodRegex.exec(content)) !== null) {
        if (!['constructor'].includes(match[1])) {
            methods.push(match[1]);
        }
    }
    return methods;
}

// Busca si el método aparece en los archivos de commands o e2e
function isMethodUsed(method, files) {
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(method)) {
            return true;
        }
    }
    return false;
}

// Script principal
const commandsFiles = getAllFiles(commandsDir);
const e2eFiles = getAllFiles(e2eDir);
const searchFiles = commandsFiles.concat(e2eFiles);

fs.readdirSync(elementsDir).forEach(file => {
    const filePath = path.join(elementsDir, file);
    const methods = getElementMethods(filePath);
    const unused = [];
    methods.forEach(method => {
        if (!isMethodUsed(method, searchFiles)) {
            unused.push(method);
        }
    });
    if (unused.length > 0) {
        console.log(`No usados en ${file}:`, unused);
    }
});