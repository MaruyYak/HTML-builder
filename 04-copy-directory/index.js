const fs = require('fs').promises;
const path = require('path');

const currentFolderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

async function copyDirectory() {
    await fs.rm(newFolderPath, {recursive: true, force: true});
    await fs.mkdir(newFolderPath, {recursive: true});

    const files = await fs.readdir(currentFolderPath);

    files.map((file) => {
      const currentFilePath = path.join(currentFolderPath, file);
      const newFilePath = path.join(newFolderPath, file);
      fs.copyFile(currentFilePath, newFilePath);

    });
}

copyDirectory();
