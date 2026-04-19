import fs from 'fs';
import path from 'path';

const distDir = './dist';

function fixPaths(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixPaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // NO MODIFICAR SCRIPTS NI ESTILOS - dejar como están en el código fuente

      // Optimizaciones existentes de rutas
      content = content.replace(/src="\//g, 'src="./');
      content = content.replace(/href="\//g, 'href="./');
      content = content.replace(/url\(\//g, 'url(./');
      
      content = content.replace(/src="\.\.\//g, 'src="./');
      content = content.replace(/href="\.\.\//g, 'href="./');
      content = content.replace(/src="\.[\/\\]\.[\/\\]/g, 'src="./');
      content = content.replace(/srcset="\/\.\//g, 'srcset="./');
      content = content.replace(/srcset="\.[\/\\]\.[\/\\]/g, 'srcset="./');
      
      content = content.replace(/"\.\.[\/\\]assets/g, '"./assets');
      content = content.replace(/"\.[\/\\]\.[\/\\]assets/g, '"./assets');
      content = content.replace(/\/\.\//g, './');
      content = content.replace(/([^.])\/assets/g, '$1./assets');
      
      content = content.replace(/\.\.\//g, './');
      content = content.replace(/\.\/\.\/\./g, '.');
      content = content.replace(/\.\/\.\//g, './');
      
      fs.writeFileSync(filePath, content);
    }
  });
}

fixPaths(distDir);
console.log('¡Rutas corregidas y recursos optimizados para mejor rendimiento!'); 