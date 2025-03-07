import React from 'react';
import { AppStateProvider } from '@components/app-state';
import { ProgressBar } from '@components/progress-bar';
import { BaseLayout } from '@components/layouts/base-layout';
import { Meta } from '@components/meta-head';

export const AppWrapper: React.FC<any> = ({ children, isHome }) => {
  return (
    <>
      <Meta />
      <ProgressBar />
      <AppStateProvider>
        <BaseLayout isHome={isHome}>{children}</BaseLayout>
      </AppStateProvider>
    </>
  );
};
