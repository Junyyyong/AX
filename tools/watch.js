const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const targetDir = path.join(__dirname, '../interactions');
const generatorScript = path.join(__dirname, 'generate_list.js');

console.log('🔍 Watching interactions folder for changes... (Press Ctrl+C to stop)');

let timeout;

function updateList() {
    console.log('⚡ Change detected. Updating interaction list...');
    exec(`node "${generatorScript}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error updating list:', err);
            return;
        }
        if (stderr) console.error(stderr);
        console.log(stdout.trim());
        console.log('✅ List updated. Refresh your browser.');
    });
}

// Watch the directory
fs.watch(targetDir, { recursive: true }, (eventType, filename) => {
    if (filename &&
        !filename.includes('.DS_Store') &&
        !filename.includes('interactions.js') &&
        !filename.includes('dist/') &&
        !filename.includes('node_modules/')
    ) {
        // Debounce: Wait 1000ms after the last change before running
        clearTimeout(timeout);
        timeout = setTimeout(() => handleFileChange(filename), 1000);
    }
});

function handleFileChange(filename) {
    console.log(`\n📝 Detected change in: ${filename}`);

    // Identify which interaction folder changed
    // filename might be "HCMV/App.tsx" or "subfolder/file.js"
    const parts = filename.split(path.sep);
    const interactionName = parts[0];
    const interactionPath = path.join(targetDir, interactionName);

    if (interactionName && fs.existsSync(interactionPath)) {
        const packageJsonPath = path.join(interactionPath, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
            console.log(`🚀 React project detected: ${interactionName}. Starting build process...`);

            // 1. Check/Install dependencies
            if (!fs.existsSync(path.join(interactionPath, 'node_modules'))) {
                console.log('📦 Installing dependencies...');
                try {
                    require('child_process').execSync('npm install', { cwd: interactionPath, stdio: 'inherit' });
                } catch (e) {
                    console.error('❌ Error installing dependencies:', e.message);
                    return;
                }
            }

            // 2. Run Build
            console.log('🔨 Building project...');
            exec('npm run build', { cwd: interactionPath }, (err, stdout, stderr) => {
                if (err) {
                    console.error('❌ Build failed:', err.message);
                    if (stderr) console.error(stderr);
                    return;
                }
                console.log('✅ Build successful!');
                updateList(); // Regenerate list after build
            });
            return;
        }
    }

    // If not a react project or just a simple file change, just update the list
    updateList();
}

// Run once on start to be sure
updateList();
