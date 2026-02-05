const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const interactionsDir = path.join(__dirname, '../interactions');

console.log('🚀 Starting global build for all interactions...');

if (!fs.existsSync(interactionsDir)) {
    console.error('❌ Interactions directory not found!');
    process.exit(1);
}

const items = fs.readdirSync(interactionsDir, { withFileTypes: true });

items.forEach(item => {
    if (item.isDirectory()) {
        const interactionPath = path.join(interactionsDir, item.name);
        const packageJsonPath = path.join(interactionPath, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
            console.log(`\n📦 Processing: ${item.name}`);

            try {
                // 1. Install dependencies if node_modules is missing
                if (!fs.existsSync(path.join(interactionPath, 'node_modules'))) {
                    console.log('   - Installing dependencies...');
                    execSync('npm install', { cwd: interactionPath, stdio: 'inherit' });
                }

                // 2. Build
                console.log('   - Building...');
                execSync('npm run build', { cwd: interactionPath, stdio: 'inherit' });
                console.log(`   ✅ ${item.name} built successfully.`);
            } catch (error) {
                console.error(`   ❌ Failed to build ${item.name}:`, error.message);
                // We don't exit process here so other builds can proceed, 
                // but Vercel might prefer failing. Let's fail hard for Vercel.
                process.exit(1);
            }
        } else {
            // console.log(`   ℹ️  Skipping usage of ${item.name} (no package.json)`);
        }
    }
});

console.log('\n✨ Global build completed.');
