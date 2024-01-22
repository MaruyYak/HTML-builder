const fs = require('fs').promises;
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(projectDistPath, 'bundle.css');

async function buildCSSBundle() {

    const fileNames = await fs.readdir(stylesPath);
    const cssFileNames = fileNames.filter(fileName => fileName.endsWith('.css'));

    const promises = cssFileNames.map(fileName => {
      const filePath = path.join(stylesPath, fileName);
      return fs.readFile(filePath);
    });

    Promise.all(promises).then(async (array) => {
      await fs.mkdir(projectDistPath, { recursive: true });
      fs.writeFile(bundlePath, array.join('\n'));
    })
}

buildCSSBundle();
