'use client';

import { useTranslation } from 'react-i18next';

export function I18nWrapper({ children }) {
  const { i18n, t } = useTranslation();
  
  return children({ i18n, t });
}
