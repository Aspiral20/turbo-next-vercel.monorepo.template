export const routes = {
  next: {
    self: '/',
    error: '/404',

    /** SITE **/
    '[locale]': (locale: string) => ({
      self: `/${locale}`,
      login: `/${locale}/login`,
      signUp: `/${locale}/sign-up`,
      verifyEmail: {
        self: `/${locale}/verify-email`,
        token: (t: string) => `/${locale}/verify-email/${t}`,
      },
      forgotPassword: {
        self: `/${locale}/forgot-password`,
        reset: (userId: string) => `/${locale}/forgot-password/${userId}`,
      },
      dashboard: {
        self: `/${locale}/dashboard`,
        settings: {
          self: `/${locale}/dashboard/settings`,
          profile: {
            self: `/${locale}/dashboard/settings/profile`,
            edit: `/${locale}/dashboard/settings/profile/edit`,
            changePassword: `/${locale}/dashboard/settings/profile/change-password`,
          },
          apiKeys: `/${locale}/dashboard/settings/api-keys`,
          billing: `/${locale}/dashboard/settings/billing`,
          notifications: `/${locale}/dashboard/settings/notifications`,
        },
      },
    }),
  },
  i18n: {
    /** SITE **/
    self: `/`,
    login: `/login`,
    signUp: `/sign-up`,
    verifyEmail: {
      self: `/verify-email`,
      token: (t: string) => `/verify-email/${t}`,
    },
    forgotPassword: {
      self: `/forgot-password`,
      reset: (userId: string) => `/forgot-password/${userId}`,
    },
    dashboard: {
      self: `/dashboard`,
      settings: {
        self: '/dashboard/settings',
        profile: {
          self: '/dashboard/settings/profile',
          edit: '/dashboard/settings/profile/edit',
          changePassword: '/dashboard/settings/profile/change-password',
        },
        apiKeys: '/dashboard/settings/api-keys', // ? depends on saas
        billing: '/dashboard/settings/billing',
        notifications: '/dashboard/settings/notifications',
      },
    },
  }
};
