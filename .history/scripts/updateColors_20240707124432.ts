import * as fs from "fs";
import * as path from "path";
type Colors = {
  light: {
    [key: string]: string;
  };
  dark: {
    [key: string]: string;
  };
} | null;

// Function to get colors from a CSS file
const getColorsFromCSS = (filePath: string): RegExpMatchArray | null => {
  const css = fs.readFileSync(filePath, "utf8");
  const regex = /(\w+(?:-\w+)*):\s*(.*?);/gm;
  return css.match(regex);
};

const getThemeFromCss = (colors: RegExpMatchArray): Colors => {
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
  return { ...light, ...dark };
};
// Define paths for the CSS files in the root of the application
const rootPath = path.resolve(__dirname, "..");

const originalColorsPath = path.join(rootPath, "global.css");
const newColorsPath = path.join(rootPath, "newColors.css");
const updatedColorsPath = path.join(rootPath, "globaNew.css");

const originalColors = getColorsFromCSS(originalColorsPath);

const colors = originalColors && getThemeFromCss(originalColors);

console.log(colors);
console.log(colors);

// const generateCSSContent = (colors: Colors): string => {
//   let cssContent = ":root {\n";
//   const light = colors?.light.
//   for (const [key, value] of Object.entries(colors?.light)) {
//     cssContent += `  ${key}: ${value};\n`;
//   }
//   cssContent += "}";
//   return cssContent;
// };

// // Generate the updated CSS content
// const updatedCSSContent = generateCSSContent(colors);

// // // Write the updated colors to updatedColors.css
// fs.writeFileSync(updatedColorsPath, updatedCSSContent, "utf8");

console.log("Updated colors written to updatedColors.css");
