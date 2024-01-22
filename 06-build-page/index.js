const fs = require('fs').promises;
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const projectDistPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

// генерация тегов
async function generateTemplate() {
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const tagRegex = /\{\{([^}]+)\}\}/g;
  const tags = templateContent.match(tagRegex) || [];

  let modifiedTemplate = templateContent;

  for (const tag of tags) {
    const componentName = tag.slice(2, -2).trim();
    const componentFilePath = path.join(componentsPath, `${componentName}.html`);
    const componentContent = await fs.readFile(componentFilePath, 'utf-8');
    modifiedTemplate = modifiedTemplate.replace(new RegExp(`\\{\\{${componentName}\\}\\}`, 'g'), componentContent);
  }
  const indexPath = path.join(projectDistPath, 'index.html');
  await fs.writeFile(indexPath, modifiedTemplate);
}
// объединение стилей
async function generateStyles() {
  const stylesFiles = await fs.readdir(stylesPath);
  const stylePath = path.join(projectDistPath, 'style.css');
  const compiledStyles = stylesFiles.filter(file => file.endsWith('.css'));

  const stylePromises = compiledStyles.map(file => {
    const cssFilesPath = path.join(stylesPath, file);
    return fs.readFile(cssFilesPath)
  });

  Promise.all(stylePromises).then(async (array) => {
    await fs.writeFile(stylePath, array.join('\n'));
  });
}
// создание копии ассетов
async function generatecopyAssets() {
  const destPath = path.join(projectDistPath, 'assets');

  async function copyDir(src, dest) {
    const entries = await fs.readdir(src,{withFileTypes: true});

    entries.forEach(async entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);    
      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    })
  };
  await copyDir(assetsPath, destPath);
}

async function main() {
  try {
    await fs.mkdir(projectDistPath);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  };
  await generateTemplate();
  await generateStyles();
  await generatecopyAssets();
}

main();