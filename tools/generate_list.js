const fs = require('fs');
const path = require('path');

const interactionsDir = path.join(__dirname, '../interactions');
const outputFile = path.join(__dirname, '../interactions.json');

function getInteractionList() {
    if (!fs.existsSync(interactionsDir)) {
        console.error('Interactions directory not found.');
        return [];
    }

    const items = fs.readdirSync(interactionsDir, { withFileTypes: true });
    const interactions = [];

    items.forEach(item => {
        if (item.isDirectory()) {
            // Check for dist/index.html (React/Built projects) first
            const distPath = path.join(interactionsDir, item.name, 'dist', 'index.html');
            if (fs.existsSync(distPath)) {
                const title = item.name
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                interactions.push({
                    id: item.name,
                    title: title,
                    path: `interactions/${item.name}/dist/index.html`
                });
                return;
            }

            const indexPath = path.join(interactionsDir, item.name, 'index.html');
            if (fs.existsSync(indexPath)) {
                // Determine title from folder name (kebab-case to Title Case)
                const title = item.name
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                interactions.push({
                    id: item.name,
                    title: title,
                    path: `interactions/${item.name}/index.html`
                });
            }
        }
    });

    // Sort alphabetically by title, but keep "AX" at the very top
    interactions.sort((a, b) => {
        if (a.title === 'Ax' || a.title === 'AX') return -1;
        if (b.title === 'Ax' || b.title === 'AX') return 1;
        return a.title.localeCompare(b.title);
    });

    return interactions;
}

const interactionData = getInteractionList();
const fileContent = `const interactionData = ${JSON.stringify(interactionData, null, 2)};`;
const jsOutputFile = path.join(__dirname, '../interactions.js');
fs.writeFileSync(jsOutputFile, fileContent);
console.log(`Generated interactions.js with ${interactionData.length} items.`);
