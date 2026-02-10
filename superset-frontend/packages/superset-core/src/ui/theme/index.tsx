/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import emotionStyled, { type CreateStyled } from '@emotion/styled';
import { useTheme as useThemeBasic } from '@emotion/react';
import { Theme } from './Theme';
import {
  type SupersetTheme,
  type SerializableThemeConfig,
  type AnyThemeConfig,
  type ThemeStorage,
  type ThemeControllerOptions,
  type ThemeContextType,
  type SupersetThemeConfig,
  ThemeAlgorithm,
  ThemeMode,
} from './types';
import type { BrandingConfig } from './BrandingConfig';

let brandingConfig: BrandingConfig;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  brandingConfig = require('../../../../../branding/index').default;
} catch (error) {
  console.warn('Failed to load branding config, using defaults:', error);
  brandingConfig = {
    appName: 'Superset',
    logoPath: '/static/assets/images/superset-logo-horiz.png',
    primaryColor: '#20a7c9',
    secondaryColor: '#66bcfe',
  };
}

export {
  css,
  keyframes,
  jsx,
  ThemeProvider,
  CacheProvider as EmotionCacheProvider,
  withTheme,
} from '@emotion/react';
export { default as createEmotionCache } from '@emotion/cache';
export { default as exampleThemes } from './exampleThemes';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends SupersetTheme {}
}

export function useTheme() {
  const theme = useThemeBasic();
  // in the case there is no theme, useTheme returns an empty object
  if (Object.keys(theme).length === 0 && theme.constructor === Object) {
    throw new Error(
      'useTheme() could not find a ThemeContext. The <ThemeProvider/> component is likely missing from the app.',
    );
  }
  return theme;
}

const styled: CreateStyled = emotionStyled;

const defaultThemeConfig: AnyThemeConfig = {
  token: {
    colorPrimary: brandingConfig.primaryColor,
    brandLogoUrl: brandingConfig.logoPath,
    brandLogoAlt: brandingConfig.appName,
    brandAppName: brandingConfig.appName,

    brandLogoMargin: '18px',
    brandLogoHref: '/',
    brandLogoHeight: '24px',
    brandIconMaxWidth: 37,

    colorLink: '#2893B3',
    colorError: '#e04355',
    colorWarning: '#fcc700',
    colorSuccess: '#5ac189',
    colorInfo: '#66bcfe',

    fontFamily: `'Inter', Helvetica, Arial`,
    fontFamilyCode: `'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Courier New', monospace`,

    transitionTiming: 0.3,
    fontSizeXS: '8',
    fontSizeXXL: '28',
    fontWeightNormal: '400',
    fontWeightLight: '300',
    fontWeightStrong: 600,
  },
};

const themeObject: Theme = Theme.fromConfig(defaultThemeConfig);

const { theme } = themeObject;
const supersetTheme = theme;

export {
  Theme,
  ThemeAlgorithm,
  ThemeMode,
  themeObject,
  styled,
  theme,
  supersetTheme,
  brandingConfig,
  defaultThemeConfig,
};

export type {
  SupersetTheme,
  SerializableThemeConfig,
  AnyThemeConfig,
  ThemeStorage,
  ThemeControllerOptions,
  ThemeContextType,
  SupersetThemeConfig,
  BrandingConfig,
};

// Export theme utility functions
export * from './utils/themeUtils';
export * from './utils';
