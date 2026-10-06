const fs = require('fs');

const { spawn } = require('child_process');

function runEdgeScript(jsCode, outputPath, width = 1280, height = 1800) {
    return new Promise((resolve, reject) => {
        const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        const args = [
            '--headless',
            '--disable-gpu',
            `--window-size=${width},${height}`,
            `--screenshot=${outputPath}`,
            'http://localhost/5-letter-word-finder/'
        ];
        const child = spawn(edgePath, args);
        child.on('close', (code) => {
            if (fs.existsSync(outputPath)) {
                resolve(outputPath);
            } else {
                reject(new Error(`Exit code ${code}`));
            }
        });
    });
}

const artifactDir = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e';

async function generateAll() {
    try {
        console.log('Capturing screenshots...');
        await runEdgeScript('', `${artifactDir}\\desktop_homepage.png`, 1280, 1800);
        await runEdgeScript('', `${artifactDir}\\mobile_homepage.png`, 395, 1200);
        await runEdgeScript('', `${artifactDir}\\desktop_sidebar.png`, 1280, 1000);
        await runEdgeScript('', `${artifactDir}\\mobile_sidebar.png`, 395, 1400);
        await runEdgeScript('', `${artifactDir}\\trust_cards_wordle.png`, 1280, 1000);
        await runEdgeScript('', `${artifactDir}\\explore_more_tools.png`, 1280, 3600);
        await runEdgeScript('', `${artifactDir}\\non_sidebar_card.png`, 1280, 2400);
        console.log('All screenshots ready!');
    } catch (err) {
        console.error('Error generating screenshots:', err);
    }
}

generateAll();
