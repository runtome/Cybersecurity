import { defineConfig } from 'vitepress'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'

// Silently skip placeholder image references that don't have real files yet.
// When an actual image file is added, Vite resolves it normally and this plugin steps aside.
const ignoreMissingImages = {
  name: 'ignore-missing-images',
  enforce: 'pre',
  resolveId(id, importer) {
    if (/\.(png|jpe?g|gif|webp|svg|ico)$/.test(id) && importer) {
      const full = resolve(dirname(importer.replace(/[?#].*$/, '')), id)
      if (!existsSync(full)) return '\0virtual:missing-image'
    }
  },
  load(id) {
    if (id === '\0virtual:missing-image') return 'export default ""'
  },
}

export default defineConfig({
  title: 'Cybersecurity Notes',
  description: 'Penetration testing and CTF reference — CEH v13 / CompTIA PenTest+ PT0-003',
  lang: 'en-US',
  srcDir: '.',
  srcExclude: [
    'CLAUDE.md',
    'New Text Document.txt',
    '**/.*',
    'node_modules/**',
    '.vitepress/**',
  ],
  cleanUrls: true,
  ignoreDeadLinks: true,
  rewrites: {
    'README.md': 'index.md',
    ':dir/README.md': ':dir/index.md',
  },
  vite: { plugins: [ignoreMissingImages] },
  themeConfig: {
    siteTitle: 'Cybersecurity Notes',

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Modules',
        items: [
          { text: '01 — Introduction',         link: '/module-01-intro/' },
          { text: '02 — Planning & Scoping',   link: '/module-02-planning/' },
          { text: '03 — Recon & Scanning',     link: '/module-03-recon/' },
          { text: '04 — Social Engineering',   link: '/module-04-social-engineering/' },
          { text: '05 — Network Exploitation', link: '/module-05-network-exploitation/' },
          { text: '06 — App Vulnerabilities',  link: '/module-06-app-vulnerabilities/' },
          { text: '07 — Cloud / Mobile / IoT', link: '/module-07-cloud-mobile-iot/' },
          { text: '08 — Post-Exploitation',    link: '/module-08-post-exploitation/' },
          { text: '09 — Reporting',            link: '/module-09-reporting/' },
          { text: '10 — Tools & Code Analysis',link: '/module-10-tools-code-analysis/' },
        ],
      },
      { text: 'Cheatsheets',   link: '/cheatsheets/' },
      { text: 'CTF Write-Ups', link: '/ctf-writeups/' },
      { text: 'Resources',     link: '/resources/' },
    ],

    sidebar: [
      {
        text: '01 — Introduction to Ethical Hacking',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-01-intro/' }],
      },
      {
        text: '02 — Planning & Scoping',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-02-planning/' }],
      },
      {
        text: '03 — Information Gathering & Recon',
        collapsed: true,
        items: [
          { text: 'Overview',       link: '/module-03-recon/' },
          { text: 'Google Dorking', link: '/module-03-recon/google-dorking' },
          { text: 'Kali Linux Lab', link: '/module-03-recon/kali-lab' },
        ],
      },
      {
        text: '04 — Social Engineering',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-04-social-engineering/' }],
      },
      {
        text: '05 — Network Exploitation',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-05-network-exploitation/' }],
      },
      {
        text: '06 — App Vulnerabilities',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-06-app-vulnerabilities/' }],
      },
      {
        text: '07 — Cloud / Mobile / IoT',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-07-cloud-mobile-iot/' }],
      },
      {
        text: '08 — Post-Exploitation',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-08-post-exploitation/' }],
      },
      {
        text: '09 — Reporting',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-09-reporting/' }],
      },
      {
        text: '10 — Tools & Code Analysis',
        collapsed: true,
        items: [{ text: 'Overview', link: '/module-10-tools-code-analysis/' }],
      },
      {
        text: 'Cheatsheets',
        collapsed: false,
        items: [
          { text: 'Index',                   link: '/cheatsheets/' },
          { text: 'Linux Commands',          link: '/cheatsheets/linux-commands' },
          { text: 'Windows Commands',        link: '/cheatsheets/windows-commands' },
          { text: 'Networking Basics',       link: '/cheatsheets/networking-basics' },
          { text: 'Common Ports & Services', link: '/cheatsheets/common-ports-services' },
          { text: 'Privilege Escalation',    link: '/cheatsheets/privilege-escalation' },
          { text: 'Cryptography Basics',     link: '/cheatsheets/cryptography-basics' },
        ],
      },
      {
        text: 'CTF Write-Ups',
        collapsed: false,
        items: [
          { text: 'Index',             link: '/ctf-writeups/' },
          { text: 'Write-Up Template', link: '/ctf-writeups/template-writeup' },
        ],
      },
      {
        text: 'Resources',
        collapsed: false,
        items: [
          { text: 'Index',           link: '/resources/' },
          { text: 'Tools Reference', link: '/resources/tools-reference' },
          { text: 'Wordlists',       link: '/resources/wordlists' },
          { text: 'Lab Setup Guide', link: '/resources/lab-setup' },
          { text: 'Certifications',  link: '/resources/certifications' },
        ],
      },
    ],

  search: { provider: 'local' },

    footer: {
      message: 'CEH v13 / CompTIA PenTest+ PT0-003 reference notes.',
      copyright: 'Maintained by suphot.n@gmail.com',
    },

    editLink: {
      pattern: 'https://github.com/runtome/Cybersecurity/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/runtome/Cybersecurity' },
    ],
  },
})
