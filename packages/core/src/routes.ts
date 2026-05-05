export const routes = {
  next: {
    self: '/',
    error: '/404',

    /** SITE **/
    '[locale]': (locale: string) => ({
      self: `/${locale}`,
      first: `/${locale}/first`,
      second: `/${locale}/second`,
      third: {
        self: `/${locale}/third`,
        number: `/${locale}/third/number`
      },
    }),
  },
  i18n: {
    /** SITE **/
    self: `/`,
    first: `/first`,
    second: `/second`,
    third: {
      self: `/third`,
      number: '/third/number'
    },
  }
};
