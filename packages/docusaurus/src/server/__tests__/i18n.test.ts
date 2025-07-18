/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import {loadI18n, getDefaultLocaleConfig} from '../i18n';
import {DEFAULT_I18N_CONFIG} from '../configValidation';
import type {DocusaurusConfig, I18nConfig} from '@docusaurus/types';

const loadI18nSiteDir = path.resolve(
  __dirname,
  '__fixtures__',
  'load-i18n-site',
);

function loadI18nTest({
  siteDir = loadI18nSiteDir,
  i18nConfig,
  currentLocale,
}: {
  siteDir?: string;
  i18nConfig: I18nConfig;
  currentLocale: string;
}) {
  return loadI18n({
    siteDir,
    config: {
      i18n: i18nConfig,
    } as DocusaurusConfig,
    currentLocale,
  });
}

describe('defaultLocaleConfig', () => {
  it('returns correct labels', () => {
    expect(getDefaultLocaleConfig('fr')).toEqual({
      label: 'Français',
      direction: 'ltr',
      htmlLang: 'fr',
      calendar: 'gregory',
      path: 'fr',
    });
    expect(getDefaultLocaleConfig('fr-FR')).toEqual({
      label: 'Français (France)',
      direction: 'ltr',
      htmlLang: 'fr-FR',
      calendar: 'gregory',
      path: 'fr-FR',
    });
    expect(getDefaultLocaleConfig('en')).toEqual({
      label: 'English',
      direction: 'ltr',
      htmlLang: 'en',
      calendar: 'gregory',
      path: 'en',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US',
      calendar: 'gregory',
      path: 'en-US',
    });
    expect(getDefaultLocaleConfig('zh')).toEqual({
      label: '中文',
      direction: 'ltr',
      htmlLang: 'zh',
      calendar: 'gregory',
      path: 'zh',
    });
    expect(getDefaultLocaleConfig('zh-CN')).toEqual({
      label: '中文（中国）',
      direction: 'ltr',
      htmlLang: 'zh-CN',
      calendar: 'gregory',
      path: 'zh-CN',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US',
      calendar: 'gregory',
      path: 'en-US',
    });
    expect(getDefaultLocaleConfig('fa')).toEqual({
      // cSpell:ignore فارسی
      label: 'فارسی',
      direction: 'rtl',
      htmlLang: 'fa',
      calendar: 'persian',
      path: 'fa',
    });
    expect(getDefaultLocaleConfig('fa-IR')).toEqual({
      // cSpell:ignore ایران فارسیا
      label: 'فارسی (ایران)',
      direction: 'rtl',
      htmlLang: 'fa-IR',
      calendar: 'persian',
      path: 'fa-IR',
    });
    expect(getDefaultLocaleConfig('en-US-u-ca-buddhist')).toEqual({
      label: 'American English',
      direction: 'ltr',
      htmlLang: 'en-US-u-ca-buddhist',
      calendar: 'buddhist',
      path: 'en-US-u-ca-buddhist',
    });
  });
});

describe('loadI18n', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it('loads I18n for default config', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: DEFAULT_I18N_CONFIG,
        currentLocale: 'en',
      }),
    ).resolves.toEqual({
      path: 'i18n',
      defaultLocale: 'en',
      locales: ['en'],
      currentLocale: 'en',
      localeConfigs: {
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: false,
        },
      },
    });
  });

  it('loads I18n for multi-lang config', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {},
        },
        currentLocale: 'fr',
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      path: 'i18n',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'fr',
      localeConfigs: {
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: false,
        },
        fr: {
          ...getDefaultLocaleConfig('fr'),
          translate: true,
        },
        de: {
          ...getDefaultLocaleConfig('de'),
          translate: true,
        },
      },
    });
  });

  it('loads I18n for multi-locale config with specified locale', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {},
        },
        currentLocale: 'de',
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      path: 'i18n',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: {
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: false,
        },
        fr: {
          ...getDefaultLocaleConfig('fr'),
          translate: true,
        },
        de: {
          ...getDefaultLocaleConfig('de'),
          translate: true,
        },
      },
    });
  });

  it('loads I18n for multi-locale config with some custom locale configs', async () => {
    await expect(
      loadI18nTest({
        i18nConfig: {
          path: 'i18n',
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {
            fr: {label: 'Français', translate: false},
            en: {translate: true},
            de: {translate: false},
          },
        },
        currentLocale: 'de',
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      path: 'i18n',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: {
        fr: {
          label: 'Français',
          direction: 'ltr',
          htmlLang: 'fr',
          calendar: 'gregory',
          path: 'fr',
          translate: false,
        },
        en: {
          ...getDefaultLocaleConfig('en'),
          translate: true,
        },
        de: {
          ...getDefaultLocaleConfig('de'),
          translate: false,
        },
      },
    });
  });

  it('warns when trying to load undeclared locale', async () => {
    await loadI18nTest({
      i18nConfig: {
        path: 'i18n',
        defaultLocale: 'fr',
        locales: ['en', 'fr', 'de'],
        localeConfigs: {},
      },
      currentLocale: 'it',
    });
    expect(consoleSpy.mock.calls[0]![0]).toMatch(
      /The locale .*it.* was not found in your site configuration/,
    );
  });
});
