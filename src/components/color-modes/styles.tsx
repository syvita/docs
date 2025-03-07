import * as React from 'react';
import { jsx, css, Global } from '@emotion/react';
import { theme, generateCssVariables } from '@stacks/ui';

export const Base = (
  <Global
    styles={css`
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      :root {
        @media (prefers-color-scheme: light) {
          ${generateCssVariables('light')({ colorMode: 'light', theme })};
          --colors-highlight-line-bg: rgba(255, 255, 255, 0.1);
          --colors-accent: #9146ff !important;
          --colors-brand: #9146ff !important;
        }
        @media (prefers-color-scheme: dark) {
          ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
          --colors-highlight-line-bg: rgba(255, 255, 255, 0.05);
          --colors-accent: #bfabff !important;
          --colors-brand: #bfabff !important;
        }
      }

      html,
      body,
      #__next {
        background: var(--colors-bg);
        border-color: var(--colors-border);

        @media (prefers-color-scheme: light) {
          :root {
            ${generateCssVariables('light')({ colorMode: 'light', theme })};
            --colors-highlight-line-bg: rgba(255, 255, 255, 0.1);
          }
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        @media (prefers-color-scheme: dark) {
          :root {
            ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
            --colors-highlight-line-bg: rgba(255, 255, 255, 0.04);
          }
          * {
            -webkit-font-smoothing: subpixel-antialiased;
            -moz-osx-font-smoothing: auto;
          }
        }
      }
    `}
  />
);

export const ColorModes = Base;
