import React from 'react';
import Document, {
  DocumentContext,
  DocumentProps,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { THEME_STORAGE_KEY } from '@common/constants';
import { extractCritical } from '@emotion/server';
import { MdxOverrides } from '@components/mdx/overrides';
import { ColorModes } from '@components/color-modes/styles';
import { ProgressBarStyles } from '@components/progress-bar';

export default class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const page = await ctx.renderPage();
    const styles = extractCritical(page.html);
    return {
      ...page,
      styles: (
        <>
          {MdxOverrides}
          {ProgressBarStyles}
          {ColorModes}
          <style
            data-emotion-css={styles.ids.join(' ')}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="color-scheme" content="light dark" />
          <link rel="stylesheet" href="https://x.syvita.org/fonts/roobert/importme.css"></link>
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
try {
    var mode = localStorage.getItem('${THEME_STORAGE_KEY}')
    if (!mode) return
    document.documentElement.classList.add(mode)
    var bgValue = getComputedStyle(document.documentElement)
    .getPropertyValue('--colors-bg')
    document.documentElement.style.background = bgValue
} catch (e) {}
})()`,
            }}
          />
          <link rel="preconnect" href="https://bh4d9od16a-dsn.algolia.net" crossOrigin="true" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
