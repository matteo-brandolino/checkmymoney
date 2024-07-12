import * as fs from "fs";
import * as path from "path";

interface Colors {
  [key: string]: string;
}

// Function to get colors from a CSS file
const getColorsFromCSS = (filePath: string): Colors => {
  const css = fs.readFileSync(filePath, "utf8");

  const colors: Colors = {};
  const regex = /--([\w-]+):\s*([^;]+);$/gm;
  let match: RegExpExecArray | null;
  console.log(css.matchAll(regex));

  while ((match = regex.exec(css)) !== null) {
    colors[match[1]] = match[2];
  }

  return colors;
};

// Define paths for the CSS files in the root of the application
const rootPath = path.resolve(__dirname, "..");
console.log(rootPath);

const originalColorsPath = path.join(rootPath, "global.css");
const newColorsPath = path.join(rootPath, "newColors.css");
const updatedColorsPath = path.join(rootPath, "updatedColors.css");

// Read original colors from global.css
const originalColors = getColorsFromCSS(originalColorsPath);
console.log(originalColors);

// // Read new colors from newColors.css
// const newColors = getColorsFromCSS(newColorsPath);

// // Function to replace original colors with new colors
// const replaceColors = (originalColors: Colors, newColors: Colors): Colors => {
//   const updatedColors: Colors = { ...originalColors };

//   for (const [key, value] of Object.entries(newColors)) {
//     if (updatedColors[key] !== undefined) {
//       updatedColors[key] = value;
//     }
//   }

//   return updatedColors;
// };

// // Get the updated colors
// const updatedColors = replaceColors(originalColors, newColors);

// // Function to generate the CSS content from the colors object
// const generateCSSContent = (colors: Colors): string => {
//   let cssContent = ":root {\n";
//   for (const [key, value] of Object.entries(colors)) {
//     cssContent += `  ${key}: ${value};\n`;
//   }
//   cssContent += "}";
//   return cssContent;
// };

// // Generate the updated CSS content
// const updatedCSSContent = generateCSSContent(updatedColors);

// // Write the updated colors to updatedColors.css
// fs.writeFileSync(updatedColorsPath, updatedCSSContent, "utf8");

console.log("Updated colors written to updatedColors.css");
