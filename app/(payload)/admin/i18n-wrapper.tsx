'use client';

import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

type I18nWrapperProps = {
  children: (props: { i18n: any; t: any }) => ReactNode;
};

export function I18nWrapper({ children }: I18nWrapperProps) {
  const { i18n, t } = useTranslation();
  
  return children({ i18n, t });
}
