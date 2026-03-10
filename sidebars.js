/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {

  idosrSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Home',
    },

    {
      type: 'category',
      label: 'Conception Reseau',
      collapsed: false,
      items: [
        'idosr/networking/intro',
        'idosr/networking/lesson-01',
        'idosr/networking/lesson-02',
        'idosr/networking/lesson-03',
        'idosr/networking/lesson-04',
        'idosr/networking/lesson-05',
        'idosr/networking/lesson-06',
        'idosr/networking/lesson-07',
        'idosr/networking/lesson-08',
        'idosr/networking/lesson-09',
        'idosr/networking/lesson-10',
        'idosr/networking/lesson-11',
      ],
    },

    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'idosr/windows/intro',
        'idosr/windows/lesson-01',
        'idosr/windows/lesson-02',
        'idosr/windows/lesson-03',
        'idosr/windows/lesson-04',
        'idosr/windows/lesson-05',
        'idosr/windows/lesson-06',
        'idosr/windows/lesson-07',
        'idosr/windows/lesson-08',
      ],
    },

    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'idosr/linux/intro',
        'idosr/linux/lesson-01',
        'idosr/linux/lesson-02',
        'idosr/linux/lesson-03',
        'idosr/linux/lesson-04',
        'idosr/linux/lesson-05',
        'idosr/linux/lesson-06',
        'idosr/linux/lesson-07',
        'idosr/linux/lesson-08',
      ],
    },
  ],

  devfullstackSidebar: [
    {
      type: 'category',
      label: 'Dev Full Stack',
      collapsed: false,
      items: [
        'devfullstack/intro',
        'devfullstack/lesson-01',
        'devfullstack/lesson-02',
        'devfullstack/lesson-03',
        'devfullstack/lesson-04',
        'devfullstack/lesson-05',
        'devfullstack/lesson-06',
        'devfullstack/lesson-07',
        'devfullstack/lesson-08',
        'devfullstack/lesson-09',
      ],
    },
  ],

  quizzesSidebar: [
    {
      type: 'category',
      label: 'Quizzes',
      collapsed: false,
      items: [
        'quizzes/quiz-ldap',
        'quizzes/quiz-networking',
        'quizzes/quiz-windows',
        'quizzes/quiz-linux',
        'quizzes/quiz-devfullstack',
        'quizzes/quiz-general',
        'quizzes/quiz-ldap'
      ],
    },
  ],

  referenceSidebar: [
    {
      type: 'category',
      label: 'Quick Reference',
      collapsed: false,
      items: [
        'reference/commands-linux',
        'reference/commands-windows',
        'reference/networking-cheatsheet',
        'reference/git-cheatsheet',
      ],
    },
  ],

};

module.exports = sidebars;