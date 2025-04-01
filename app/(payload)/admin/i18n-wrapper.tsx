'use client';

import { ReactNode } from 'react';

type I18nWrapperProps = {
  children: (props: { i18n: any; t: any }) => ReactNode;
};

const createSafeFormatFunction = () => () => '';
const createSafeMatchFunction = () => () => 0;

const safeLocale = {
  code: 'en-US',
  formatDistance: createSafeFormatFunction(),
  formatLong: {
    date: createSafeFormatFunction(),
    time: createSafeFormatFunction(),
    dateTime: createSafeFormatFunction()
  },
  formatRelative: createSafeFormatFunction(),
  localize: {
    ordinalNumber: createSafeFormatFunction(),
    era: createSafeFormatFunction(),
    quarter: createSafeFormatFunction(),
    month: createSafeFormatFunction(),
    day: createSafeFormatFunction(),
    dayPeriod: createSafeFormatFunction()
  },
  match: {
    ordinalNumber: createSafeMatchFunction(),
    era: createSafeFormatFunction(),
    quarter: createSafeMatchFunction(),
    month: createSafeMatchFunction(),
    day: createSafeMatchFunction(),
    dayPeriod: createSafeFormatFunction()
  },
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};

export function I18nWrapper({ children }: I18nWrapperProps) {
  const safeI18n = {
    language: 'en-US',
  };

  const safeT = (key: string) => {
    if (key === 'locale' || key === '_locale') {
      return safeLocale;
    }
    
    return key;
  };

  return children({ 
    i18n: safeI18n, 
    t: safeT
  });
}
