function createSlug(title) {
  return title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/^-+|-+$/g, '');
}

const titles = [
  'Helm Chart Mastery Part 1: Foundations & Architecture',
  'Helm Chart Mastery Part 2: Values, Templates & The Engine',
  'Helm Chart Mastery Part 3: Advanced Patterns & Control Flow',
  'Helm Chart Mastery Part 4: Production-Grade Helm & Best Practices',
  'Docker Mastery Part 1: Advanced Networking & Multi-Host Connectivity',
  'Docker Mastery Part 2: Orchestration with Docker Swarm & Compose',
  'Docker Mastery Part 3: Security Hardening & Secret Management',
  'Docker Mastery Part 4: Observability, Logging & Deep Troubleshooting',
  'Beyond Makefiles: Modern DevOps Automation with Taskfile.dev',
  'The Zero-Day DevOps Setup: From Fresh OS to Production Ready',
  'Gemini CLI: Getting Started'
];

titles.forEach(title => {
  console.log(`Title: "${title}"`);
  console.log(`Slug:  "${createSlug(title)}"`);
  console.log('---');
});
