
const fs = require('fs');
const path = require('path');

const replacements = {
    'Ã°Å¸Ëœâ€ ': '😞',
    'ðŸ˜”': '😞',
    'Ã°Å¸ËœÂ ': '😐',
    'ðŸ˜ ': '😐',
    'Ã°Å¸ËœÅ ': '😊',
    'ðŸ˜Š': '😊',
    'ðŸ’œ': '💜',
    'ðŸŽ‰': '🎉',
    'ðŸ‘¶': '👶',
    'ðŸ¥¹ðŸ’•': '🥹💕',
    'ðŸ˜…': '😅',
    'ðŸŒŸ': '🌟',
    'ðŸ¤±': '🌱',
    'ðŸ˜¢': '😢',
    'ðŸ˜ž': '😞',
    'ðŸ˜„': '😄',
    'ðŸ¥°': '🥰',
    'ðŸ˜Œ': '😌',
    'ðŸ˜°': '😰',
    'ðŸ˜¡': '😡',
    'ðŸ˜ ': '😍', // Note: duplicate key check
    'ðŸ™‚': '🙂',
    'âš ï¸ ': '⚠️'
};

// Add duplicate key for love eyes if needed, JS obj keys overwrite. 
// The hex for 'ðŸ˜ ' is unique, but if visual representation is same, it might overwrite.

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const pagesDir = path.join(__dirname, 'pages');
const componentsDir = path.join(__dirname, 'components');

const files = [
    ...getAllFiles(pagesDir),
    ...getAllFiles(componentsDir)
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        for (const [key, value] of Object.entries(replacements)) {
            // Global replace
            const regex = new RegExp(key, 'g');
            content = content.replace(key, value).replace(regex, value);
        }

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Fixed emojis in: ${file}`);
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
});

console.log('Emoji fix complete!');
