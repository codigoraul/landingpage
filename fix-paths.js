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
      
      // Optimizar carga de recursos críticos
      content = content.replace(
        /<link[^>]*\.css"[^>]*>/g,
        match => {
          if (match.includes('critical') || match.includes('main')) {
            // Estilos críticos: cargar inmediatamente
            return match.replace('rel="stylesheet"', 'rel="stylesheet" media="print" onload="this.media=\'all\'"');
          } else {
            // Estilos no críticos: cargar de forma diferida
            return match.replace('rel="stylesheet"', 'rel="preload" as="style" onload="this.rel=\'stylesheet\'"');
          }
        }
      );

      // Agregar fallback para navegadores sin JavaScript
      const noscriptStyles = `
        <noscript>
          <link rel="stylesheet" href="./assets/styles/main.css">
        </noscript>
      `;
      content = content.replace('</head>', `${noscriptStyles}\n</head>`);

      // Optimizar carga de scripts
      content = content.replace(
        /<script\s+src="([^"]+)"/g,
        (match, src) => {
          if (src.includes('gstatic.com')) {
            return `<script src="${src}" defer async`;
          } else if (src.includes('critical') || src.includes('main')) {
            return `<script src="${src}"`;
          } else {
            return `<script src="${src}" defer`;
          }
        }
      );
      
      // Agregar preconnect para recursos externos
      const preconnects = `
        <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="dns-prefetch" href="https://www.gstatic.com">
      `;
      content = content.replace('</head>', `${preconnects}\n</head>`);

      // Optimizar carga de imágenes
      content = content.replace(
        /<img[^>]+>/g,
        match => {
          if (!match.includes('loading=')) {
            return match.replace('>', ' loading="lazy">');
          }
          return match;
        }
      );

      // Agregar atributos de tamaño a imágenes
      content = content.replace(
        /<img[^>]+>/g,
        match => {
          if (!match.includes('width=') && !match.includes('height=')) {
            return match.replace('>', ' width="auto" height="auto">');
          }
          return match;
        }
      );

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