"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var convertToCamelCase = function (input) {
    var parts = input.split("-");
    var camelCaseParts = parts.map(function (part, index) {
        if (index === 0) {
            return part;
        }
        else {
            return part.charAt(0).toUpperCase() + part.slice(1);
        }
    });
    var camelCaseString = camelCaseParts.join("");
    return camelCaseString;
};
// Function to get colors from a CSS file
var getColorsFromCSS = function (filePath) {
    var css = fs.readFileSync(filePath, "utf8");
    console.log("css: ".concat(css));
    var regex = /(\w+(?:-\w+)*):\s*(.*?);/gm;
    return css.match(regex);
};
var getThemeFromCss = function (colors) {
    var light = {
        light: {},
    };
    var dark = {
        dark: {},
    };
    for (var _i = 0, colors_1 = colors; _i < colors_1.length; _i++) {
        var c = colors_1[_i];
        var _a = c
            .split(":")
            .map(function (t) { return t.replace(";", ""); })
            .map(function (y) { return y.trim(); }), variable = _a[0], color = _a[1];
        var convertedVariable = convertToCamelCase(variable);
        if (convertedVariable && convertedVariable in light.light) {
            dark.dark[convertedVariable] = color;
        }
        else {
            light.light[convertedVariable] = color;
        }
    }
    return __assign(__assign({}, light), dark);
};
// Define paths for the CSS files in the root of the application
var rootPath = path.resolve(__dirname, "..");
var originalColorsPath = path.join(rootPath, "global.css");
var updatedColorsPath = path.join("".concat(rootPath, "/constants"), "Colors.ts");
var originalColors = getColorsFromCSS(originalColorsPath);
console.log(originalColors);
var colors = originalColors && getThemeFromCss(originalColors);
console.log(colors);
var generateCSSContent = function (colors) {
    var cssContent = "export const THEME = {\n";
    if (colors && colors.light && colors.dark) {
        cssContent += "  light: {\n";
        for (var _i = 0, _a = Object.entries(colors === null || colors === void 0 ? void 0 : colors.light); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var col = key === "gradient" ? value : "hsl(".concat(value, ")");
            cssContent += "    ".concat(key, ": \"").concat(col, "\",\n");
        }
        cssContent += "  },\n";
        cssContent += "  dark: {\n";
        for (var _c = 0, _d = Object.entries(colors === null || colors === void 0 ? void 0 : colors.dark); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            var col = key === "gradient" ? value : "hsl(".concat(value, ")");
            cssContent += "    ".concat(key, ": \"").concat(col, "\",\n");
        }
        cssContent += "  },\n";
        cssContent += "};";
    }
    return cssContent;
};
// // Generate the updated CSS content
var updatedCSSContent = generateCSSContent(colors);
// // // Write the updated colors to updatedColors.css
fs.writeFileSync(updatedColorsPath, updatedCSSContent, "utf8");
console.log("Updated colors written to updatedColors.css");
