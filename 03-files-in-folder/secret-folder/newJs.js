const filePath = path.join(secretFolderPath, file.name);
        const stats = await fsPromises.stat(filePath);
        const fileName = path.parse(file.name).name;
        const fileExtn = path.extname(file.name).slice(1);
        const fileSize = (stats.size / 1024).toFixed(2) + 'kb';
        console.log(`${fileName} - ${fileExtn} - ${fileSize}`);