import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const componentsDir = path.join(__dirname, 'src', 'components');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function createComponentContent(componentName, componentType) {
  const pascalCase = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  
  return `import React from 'react';

interface ${pascalCase}Props {
  // Props
  propTest: React.ReactNode;
}

const ${pascalCase}: React.FC<${pascalCase}Props> = ({propTest}) => {
  return (
    <div>
      {propTest}
    </div>
  );
};

export default ${pascalCase};
`;
}

async function createComponent() {
  try {
    console.log('Creador de Componentes\n');
    
    console.log('Tipos de componentes disponibles:');
    console.log('1. Atom (átomo)');
    console.log('2. Molecule (molécula)');
    console.log('3. Organism (organismo)');
    console.log('4. Template (plantilla)');
    console.log('5. Page (página)\n');
    
    const typeChoice = await question('Selecciona el tipo de componente (1-5): ');
    
    const typeMap = {
      '1': 'atoms',
      '2': 'molecules', 
      '3': 'organisms',
      '4': 'templates',
      '5': 'pages'
    };
    
    const componentType = typeMap[typeChoice];
    
    if (!componentType) {
      console.log('Opción inválida. Por favor selecciona un número del 1 al 5.');
      rl.close();
      return;
    }
    
    const componentName = await question('Nombre del componente: ');
    
    if (!componentName || componentName.trim() === '') {
      console.log('El nombre del componente es requerido.');
      rl.close();
      return;
    }
    
    const componentTypeDir = path.join(componentsDir, componentType);
    
    // Asegurar que existe el directorio del tipo de componente
    if (!fs.existsSync(componentTypeDir)) {
      fs.mkdirSync(componentTypeDir, { recursive: true });
    }
    
    const pascalCase = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    
    const componentFile = path.join(componentTypeDir, `${pascalCase}.tsx`);
    
    if (fs.existsSync(componentFile)) {
      console.log(`El componente "${componentName}" ya existe en ${componentType}.`);
      rl.close();
      return;
    }
    fs.writeFileSync(componentFile, createComponentContent(componentName, componentType));
    
    console.log(`\nComponente "${componentName}" creado exitosamente!`);
    console.log(`Ubicación: src/components/${componentType}/`);
    console.log(`Archivos creados:`);
    console.log(`   - ${pascalCase}.tsx (componente principal)`);
    
    const createAnother = await question('\n¿Quieres crear otro componente? (s/n): ');
    
    if (createAnother.toLowerCase() === 's' || createAnother.toLowerCase() === 'si') {
      console.log('\n' + '='.repeat(50) + '\n');
      await createComponent();
    } else {
      rl.close();
    }
    
  } catch (error) {
    console.error('Error al crear el componente:', error.message);
    rl.close();
  }
}

async function main() {
  console.log('Bienvenido al Creador de Componentes');
  console.log('Este script te ayudará a crear componentes siguiendo Atomic Design\n');
  
  await createComponent();
}

main(); 