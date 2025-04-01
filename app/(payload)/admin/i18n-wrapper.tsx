'use client';

import { ReactNode } from 'react';

type I18nWrapperProps = {
  children: (props: { i18n: any; t: any }) => ReactNode;
};

export function I18nWrapper({ children }: I18nWrapperProps) {
  const i18n = {};
  const t = (key: string) => key;
  
  return children({ i18n, t });
}
