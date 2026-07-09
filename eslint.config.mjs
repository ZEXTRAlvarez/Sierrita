import nx from '@nx/eslint-plugin';

// Dependency architecture (see plan c:\s\.claude\plans — foundation pass):
//   scope:ui           design system, no internal deps
//   scope:domain-core   pet, profiles, adaptive, games, audio, parents
//   scope:infra         storage (depends on domain-core types)
//   scope:feature        pdf (depends on domain-core + infra)
//   scope:app            apps/mobile (depends on everything)
const depConstraints = [
  { sourceTag: 'scope:ui', onlyDependOnLibsWithTags: ['scope:ui'] },
  { sourceTag: 'scope:domain-core', onlyDependOnLibsWithTags: ['scope:domain-core'] },
  { sourceTag: 'scope:infra', onlyDependOnLibsWithTags: ['scope:domain-core', 'scope:infra'] },
  {
    sourceTag: 'scope:feature',
    onlyDependOnLibsWithTags: ['scope:domain-core', 'scope:infra', 'scope:feature'],
  },
  {
    sourceTag: 'scope:app',
    onlyDependOnLibsWithTags: ['scope:domain-core', 'scope:infra', 'scope:feature', 'scope:ui', 'scope:app'],
  },
];

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/.expo', '**/coverage'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints,
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // Hard 100-line cap. Scoped to libs/** for this pass — apps/mobile
    // screens are a follow-up pass and would fail this today. Widen to
    // apps/mobile/src/** once that pass lands.
    files: ['libs/**/*.ts', 'libs/**/*.tsx'],
    ignores: ['libs/**/*.spec.ts', 'libs/**/*.spec.tsx', 'libs/**/*.test.ts', 'libs/**/*.test.tsx'],
    rules: {
      'max-lines': ['error', { max: 100, skipBlankLines: false, skipComments: false }],
    },
  },
];
