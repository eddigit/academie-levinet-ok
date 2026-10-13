// SEO : génère après le build un HTML par page publique, avec <title>, description,
// canonical et og:* en dur (lisibles sans JavaScript). Vercel sert chaque page par
// une réécriture explicite (vercel.json) ; les autres chemins reçoivent 200.html,
// coquille générique sans canonical figée (le script de index.html la pose au rendu).
const fs = require('fs');
const path = require('path');

const BASE = 'https://academielevinet.com';
const SITE = 'Académie Jacques Levinet';
const BUILD = path.join(__dirname, '..', 'build');

const PAGES = [
  { path: '/', file: 'index.html', title: `${SITE} | École Internationale de Self-Défense`,
    description: 'Académie Jacques Levinet - École Internationale de Self-Défense. Apprenez le Krav Maga et la self-défense avec notre méthode brevetée SPK.' },
  { path: '/trouver-club', title: `Trouver un Club | ${SITE}`,
    description: "Trouvez un club de l'Académie Jacques Levinet près de chez vous : clubs affiliés et directeurs techniques dans plus de 50 pays." },
  { path: '/kravmag', title: `Krav Mag AJL, le magazine | ${SITE}`,
    description: 'Krav Mag AJL, le magazine international multilingue des arts martiaux et de la self-défense, en ligne et sur papier.' },
  { path: '/disciplines/spk', title: `Krav Maga Self-Défense (Self Pro Krav) | ${SITE}`,
    description: 'Self Pro Krav : apprenez à vous protéger avec des gestes simples et efficaces. Self pour Self-Défense, Pro pour Professionnel, Krav pour Combativité.' },
  { path: '/disciplines/sfjl', title: `Self-Défense Féminine | ${SITE}`,
    description: 'Self-défense féminine : des gestes simples et efficaces pour vous protéger, dans un cadre bienveillant, entre femmes.' },
  { path: '/disciplines/ipc', title: `IPC / ROS, formation des forces de l'ordre | ${SITE}`,
    description: "International Police Confederation : formation professionnelle des forces de l'ordre et des agents de sécurité. Certification ROS (Real Operational System)." },
  { path: '/disciplines/wkmo', title: `WKMO, World Krav Maga Organization | ${SITE}`,
    description: 'La self-défense pour tous. Krav Maga, KAPAP et Self Pro Krav accessibles au grand public dans un esprit familial et bienveillant.' },
  { path: '/disciplines/canne', title: `Canne Défense | ${SITE}`,
    description: 'Canne Défense : une méthode française adaptée aux agressions de la rue. La canne devient un instrument de protection efficace et légal.' },
  { path: '/disciplines/baton', title: `Bâton Défense | ${SITE}`,
    description: 'Bâton Défense Jacques Levinet : une méthode moderne de self-défense, simple et réaliste, pour le grand public et les professionnels de la sécurité.' },
  { path: '/disciplines/enfant', title: `Self-Défense Enfant | ${SITE}`,
    description: "Self-défense pour enfants : développer la confiance en soi, apprendre à se protéger et s'épanouir dans un cadre bienveillant." },
  { path: '/evenements', title: `Événements & Stages | ${SITE}`,
    description: "Retrouvez tous les stages, séminaires et manifestations de l'Académie Jacques Levinet." },
  { path: '/join', title: `Devenir Membre | ${SITE}`,
    description: "Devenez membre de l'Académie Jacques Levinet : certifications reconnues, réseau mondial, e-learning et communauté de pratiquants." },
  { path: '/about', title: `L'Académie | ${SITE}`,
    description: "Depuis plus de 25 ans, l'Académie Jacques Levinet est spécialisée dans la self-défense de rue et la formation professionnelle des forces de l'ordre." },
  { path: '/founder', title: `Le fondateur, Capitaine Jacques Levinet | ${SITE}`,
    description: 'Capitaine Jacques Levinet : 10ème Dan, Champion de France, créateur du Self Pro Krav.' },
  { path: '/pedagogy', title: `Pédagogie & Grades | ${SITE}`,
    description: "Un système de formation structuré et des certifications reconnues mondialement. Progressez à votre rythme avec l'accompagnement de l'Académie." },
  { path: '/international', title: `Présence Internationale | ${SITE}`,
    description: "L'Académie Jacques Levinet est représentée sur tous les continents avec des directeurs techniques et clubs affiliés dans plus de 50 pays." },
  { path: '/boutique', title: `Boutique Officielle | ${SITE}`,
    description: "Boutique officielle de l'Académie Jacques Levinet." },
  { path: '/editions', title: `Éditions AJL | ${SITE}`,
    description: 'Les Éditions AJL accompagnent vos travaux de recherche et vos ouvrages techniques en self-défense et arts martiaux.' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const shell = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
if (!/<title>[^<]*<\/title>/.test(shell) || !/<meta name="description" content="[^"]*"\s*\/?>/.test(shell)) {
  throw new Error('seo-pages: <title> ou meta description introuvable dans build/index.html');
}

// Coquille générique pour les chemins sans page dédiée.
fs.writeFileSync(path.join(BUILD, '200.html'), shell);

for (const page of PAGES) {
  const url = page.path === '/' ? `${BASE}/` : BASE + page.path;
  const head = [
    `<link rel="canonical" href="${url}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:site_name" content="${esc(SITE)}"/>`,
    `<meta property="og:title" content="${esc(page.title)}"/>`,
    `<meta property="og:description" content="${esc(page.description)}"/>`,
  ].join('');
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(page.description)}"/>`)
    .replace('</head>', `${head}</head>`);
  const file = page.file || `${page.path.slice(1)}.html`;
  fs.mkdirSync(path.dirname(path.join(BUILD, file)), { recursive: true });
  fs.writeFileSync(path.join(BUILD, file), html);
}

console.log(`seo-pages: ${PAGES.length} pages + 200.html générées`);
