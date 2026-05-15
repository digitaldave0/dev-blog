const createSlug = (title) => {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const titles = [
  "The Ultimate Hermes Operator Guide: Persistence, Security, and Cost-Optimization",
  "Hermes Evolution: Building a Sovereign, Disaster-Proof AI Command Center"
];

titles.forEach(t => console.log(`${t} => ${createSlug(t)}`));
