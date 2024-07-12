import * as fs from "fs";
import * as path from "path";

// Interface to define the structure of the colors object
interface Colors {
  [key: string]: string;
}

// Function to get colors from a CSS file
const getColorsFromCSS = (filePath: string): Colors => {
  const css = fs.readFileSync(filePath, "utf8");
  const colors: Colors = {};
  // Regular expression to match CSS variables
  const regex = /(--[\w-]+):\s*(hsl\([^;]+|#[0-9a-fA-F]+);/g;
  let match: RegExpExecArray | null;

  // Extract all CSS variables and their values
  while ((match = regex.exec(css)) !== null) {
    colors[match[1]] = match[2];
  }

  return colors;
};

// Read original colors from colors.css
const originalColorsPath = path.join("", "global.css");
const originalColors = getColorsFromCSS(originalColorsPath);

// Read new colors from newColors.css
const newColorsPath = path.join("", "newColors.css");
const newColors = getColorsFromCSS(newColorsPath);

// Function to replace original colors with new colors
const replaceColors = (originalColors: Colors, newColors: Colors): Colors => {
  const updatedColors: Colors = { ...originalColors };

  for (const [key, value] of Object.entries(newColors)) {
    if (updatedColors[key] !== undefined) {
      updatedColors[key] = value;
    }
  }

  return updatedColors;
};

// Get the updated colors
const updatedColors = replaceColors(originalColors, newColors);

// Function to generate the CSS content from the colors object
const generateCSSContent = (colors: Colors): string => {
  let cssContent = ":root {\n";
  for (const [key, value] of Object.entries(colors)) {
    cssContent += `  ${key}: ${value};\n`;
  }
  cssContent += "}";
  return cssContent;
};

// Generate the updated CSS content
const updatedCSSContent = generateCSSContent(updatedColors);

// Write the updated colors to updatedColors.css
const updatedColorsPath = path.join("", "updatedColors.css");
fs.writeFileSync(updatedColorsPath, updatedCSSContent, "utf8");

console.log("Updated colors written to updatedColors.css");
