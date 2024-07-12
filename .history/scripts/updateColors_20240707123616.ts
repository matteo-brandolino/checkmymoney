import * as fs from "fs";
import * as path from "path";

// Function to get colors from a CSS file
const getColorsFromCSS = (filePath: string): RegExpMatchArray | null => {
  const css = fs.readFileSync(filePath, "utf8");
  console.log(css.replace(/[\r\n]/g, "").replace(/\s\s+/g, " "));

  const regex = /(\w+(?:-\w+)*):\s*(.*?);/gm;
  console.log(css.match(regex));

  return css.match(regex);
};

const getThemeFromCss = (colors: RegExpMatchArray) => {
  const light: { light: { [key: string]: string } } = {
    light: {},
  };
  const dark: { dark: { [key: string]: string } } = {
    dark: {},
  };
  for (const c of colors) {
    const [variable, color] = c
      .split(":")
      .map((t) => t.replace(";", ""))
      .map((y) => y.trim());
    if (variable && variable in light.light) {
      dark.dark[variable] = color;
    } else {
      light.light[variable] = color;
    }
  }
  return { light, dark };
};
// Define paths for the CSS files in the root of the application
const rootPath = path.resolve(__dirname, "..");
console.log(rootPath);

const originalColorsPath = path.join(rootPath, "global.css");
const newColorsPath = path.join(rootPath, "newColors.css");
const updatedColorsPath = path.join(rootPath, "globaNew.css");

const originalColors = getColorsFromCSS(originalColorsPath);
console.log(originalColors);

const colors = originalColors && getThemeFromCss(originalColors);

console.log(colors);

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
//fs.writeFileSync(updatedColorsPath, updatedCSSContent, "utf8");

console.log("Updated colors written to updatedColors.css");
