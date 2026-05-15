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
  "Docker Mastery Part 1: Advanced Networking & Multi-Host Connectivity",
  "The Ultimate Hermes Operator Guide: Persistence, Security, and Cost-Optimization",
  "Hermes Evolution: Building a Sovereign, Disaster-Proof AI Command Center",
  "Beyond Makefiles: Modern DevOps Automation with Taskfile.dev",
  "The Zero-Day DevOps Setup: From Fresh OS to Production Ready",
  "Gemini CLI: Getting Started"
];

titles.forEach(t => console.log(`${t} => ${createSlug(t)}`));
