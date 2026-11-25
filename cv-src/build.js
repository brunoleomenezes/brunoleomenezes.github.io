// Gera os currículos em PDF (PT e EN) a partir de cv-src/cv.html.
// Uso: node cv-src/build.js   (requer o pacote "playwright" com Chromium)
const path = require('path');
const { chromium } = require('playwright');

const SRC = 'file://' + path.join(__dirname, 'cv.html');
const OUT = path.join(__dirname, '..', 'assets');
const LANGS = [
  { lang: 'pt', html: 'pt-BR', file: 'Bruno_Menezes_CV_PT.pdf', title: 'Bruno Menezes — Currículo' },
  { lang: 'en', html: 'en', file: 'Bruno_Menezes_CV_EN.pdf', title: 'Bruno Menezes — Résumé' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(SRC, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const v of LANGS) {
    await page.evaluate(({ lang, html, title }) => {
      document.body.className = 'lang-' + lang;
      document.documentElement.lang = html;
      document.title = title;
    }, v);
    await page.pdf({ path: path.join(OUT, v.file), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('ok', v.file);
  }
  await browser.close();
})();
