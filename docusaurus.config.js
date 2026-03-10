// @ts-check
// Note: type annotations allow type checking and IDE autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: 'OFPPT Tech Academy',
  tagline: 'Your Professional IT Learning Platform',
  favicon: 'img/favicon.ico',

  url: 'https://ofppt-tech-academy.vercel.app',
  baseUrl: '/',

  organizationName: 'omar-maarouf',
  projectName: 'ofppt-academy',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    navbar: {
      title: 'OFPPT Tech Academy',
      logo: {
        alt: 'OFPPT Tech Academy Logo',
        src: 'img/logo.svg',
      },

      items: [
        {
          type: 'docSidebar',
          sidebarId: 'idosrSidebar',
          position: 'left',
          label: 'IDOSR',
        },
        {
          type: 'docSidebar',
          sidebarId: 'devfullstackSidebar',
          position: 'left',
          label: 'Dev Full Stack',
        },
        {
          type: 'docSidebar',
          sidebarId: 'quizzesSidebar',
          position: 'left',
          label: 'Quizzes',
        },
        {
          type: 'docSidebar',
          sidebarId: 'referenceSidebar',
          position: 'left',
          label: 'Reference',
        },
        {
          href: 'https://github.com/omar-maarouf/ofppt-academy',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',

      links: [
        {
          title: 'Courses',
          items: [
            {
              label: 'Conception Reseau',
              to: '/idosr/networking/intro',
            },
            {
              label: 'Administration Windows',
              to: '/idosr/windows/intro',
            },
            {
              label: 'Administration Linux',
              to: '/idosr/linux/intro',
            },
            {
              label: 'Dev Full Stack',
              to: '/devfullstack/intro',
            },
          ],
        },

        {
          title: 'Resources',
          items: [
            {
              label: 'Quizzes',
              to: '/quizzes/quiz-networking',
            },
            {
              label: 'Quick Reference',
              to: '/reference/commands-linux',
            },
          ],
        },

        {
          title: 'Platform',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/omar-maarouf/ofppt-academy',
            },
            {
              label: 'Vercel',
              href: 'https://vercel.com',
            },
          ],
        },
      ],

      copyright:
        `Copyright ${new Date().getFullYear()} OFPPT Tech Academy. Created by Omar Maarouf. Built with Docusaurus.`,
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['bash', 'powershell', 'json', 'yaml'],
    },
  },
};

module.exports = config;