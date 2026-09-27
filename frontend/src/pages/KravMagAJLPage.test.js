const fs = require('fs');
const path = require('path');

const pageSource = fs.readFileSync(path.join(__dirname, 'KravMagAJLPage.js'), 'utf8');

describe('KravMagAJLPage Calameo integration', () => {
  test('uses the autumn 2026 magazine embed instead of the summer 2026 issue', () => {
    expect(pageSource).toContain('KRAV MAG AJL AUTOMNE 2026');
    expect(pageSource).toContain('https://www.calameo.com/books/008044507a4a135f1e12a');
    expect(pageSource).toContain('v.calameo.com/?bkcode=008044507a4a135f1e12a&mode=mini');
    expect(pageSource).not.toContain('00804450798efd0bdcc1b');
    expect(pageSource).not.toContain('Été 2026');
  });
});
