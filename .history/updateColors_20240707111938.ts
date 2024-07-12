import fs from "fs";
import path from "path";

interface Colors {
  [key: string]: string;
}

// Funzione per ottenere i colori dal file CSS
const getColorsFromCSS = (filePath: string): Colors => {
  const css = fs.readFileSync(filePath, "utf8");
  const colors: Colors = {};
  const regex = /(--[\w-]+):\s*(hsl\([^;]+|#[0-9a-fA-F]+);/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(css)) !== null) {
    colors[match[1]] = match[2];
  }

  return colors;
};

// Leggi i colori originali da colors.css
const originalColorsPath = path.join(__dirname, "colors.css");
const originalColors = getColorsFromCSS(originalColorsPath);

// Leggi i nuovi colori da newColors.css
const newColorsPath = path.join(__dirname, "newColors.css");
const newColors = getColorsFromCSS(newColorsPath);

// Sostituisci i colori originali con i nuovi colori
const replaceColors = (originalColors: Colors, newColors: Colors): Colors => {
  const updatedColors: Colors = { ...originalColors };

  for (const [key, value] of Object.entries(newColors)) {
    if (updatedColors[key] !== undefined) {
      updatedColors[key] = value;
    }
  }

  return updatedColors;
};

const updatedColors = replaceColors(originalColors, newColors);

// Genera il nuovo contenuto CSS
const generateCSSContent = (colors: Colors): string => {
  let cssContent = ":root {\n";
  for (const [key, value] of Object.entries(colors)) {
    cssContent += `  ${key}: ${value};\n`;
  }
  cssContent += "}";
  return cssContent;
};

const updatedCSSContent = generateCSSContent(updatedColors);

// Scrivi i colori aggiornati in updatedColors.css
const updatedColorsPath = path.join(__dirname, "updatedColors.css");
fs.writeFileSync(updatedColorsPath, updatedCSSContent, "utf8");

console.log("Colori aggiornati scritti in updatedColors.css");
