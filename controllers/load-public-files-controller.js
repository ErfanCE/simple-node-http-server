const { readFileSync } = require('node:fs');
const { join } = require('node:path');

// HTML
const indexHtml = readFileSync(join(__dirname, '../views/index.html'), 'utf-8');
// CSS
const styleSheet = readFileSync(
  join(__dirname, '../public/stylesheets/style.css'),
  'utf-8'
);
const modalStyleSheet = readFileSync(
  join(__dirname, '../public/stylesheets/modal.css'),
  'utf-8'
);
const tableStyleSheet = readFileSync(
  join(__dirname, '../public/stylesheets/table.css'),
  'utf-8'
);
// JS
const assetsJs = readFileSync(
  join(__dirname, '../public/javascripts/assets.js'),
  'utf-8'
);
const mainJs = readFileSync(
  join(__dirname, '../public/javascripts/main.js'),
  'utf-8'
);
const modalJs = readFileSync(
  join(__dirname, '../public/javascripts/modal.js'),
  'utf-8'
);

module.exports = {
  indexHtml,
  styleSheet,
  modalStyleSheet,
  tableStyleSheet,
  mainJs,
  modalJs,
  assetsJs
};
