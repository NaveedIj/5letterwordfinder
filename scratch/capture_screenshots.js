const fs = require('fs');

const { spawn } = require('child_process');

function takeScreenshot(url, outputPath, width = 1280, height = 1000) {
    return new Promise((resolve, reject) => {
        const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        const args = [
            '--headless',
            '--disable-gpu',
            `--window-size=${width},${height}`,
            `--screenshot=${outputPath}`,
            url
        ];
        const child = spawn(edgePath, args);
        child.on('close', (code) => {
            if (code === 0 && fs.existsSync(outputPath)) {
                console.log(`Screenshot saved to: ${outputPath}`);
                resolve(outputPath);
            } else {
                reject(new Error(`Failed with code ${code}`));
            }
        });
    });
}

const artifactDir = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\28c2b495-76cd-44df-b206-8b18f5f78b9e';

async function captureAll() {
    try {
        // 1. Desktop homepage
        await takeScreenshot('http://localhost/5-letter-word-finder/', `${artifactDir}\\desktop_homepage.png`, 1280, 1000);
        // 2. Mobile homepage
        await takeScreenshot('http://localhost/5-letter-word-finder/', `${artifactDir}\\mobile_homepage.png`, 395, 800);
        // 3. Desktop sidebar focus
        await takeScreenshot('http://localhost/5-letter-word-finder/', `${artifactDir}\\desktop_sidebar.png`, 1280, 800);
        // 4. Mobile sidebar focus
        await takeScreenshot('http://localhost/5-letter-word-finder/', `${artifactDir}\\mobile_sidebar.png`, 395, 1000);
        // 5. Hero trust cards Wordle mode
        await takeScreenshot('http://localhost/5-letter-word-finder/', `${artifactDir}\\trust_cards_wordle.png`, 1280, 600);
        // 6. Explore more tools section
        await takeScreenshot('http://localhost/5-letter-word-finder/', `${artifactDir}\\explore_more_tools.png`, 1280, 1200);
        // 7. Non-sidebar card
        await takeScreenshot('http://localhost/5-letter-word-finder/', `${artifactDir}\\non_sidebar_card.png`, 1280, 1000);

        console.log('All screenshots captured successfully!');
    } catch (err) {
        console.error('Error capturing screenshots:', err);
    }
}

captureAll();
