import { AuthExpireTimeType } from '@/_types/time/jwt_expire_time.types';

/**
 *
 * jwt - used for next-auth.
 * moment - used for time calculations and for refreshing the access token.
 * (if you use external API or manipulating with refresh/access tokens with custom logic you can keep it, otherwise it's not necessary).
 *
 **/


export const AUTH_EXPIRE_TIME: AuthExpireTimeType = {
  access: {
    format: {
      jwt: {
        string: '15m',
        number: 15 * 60 * 1000,
      },
      moment: {
        add: {
          amount: 15,
          unit: 'minutes',
          endOfUnit: 'minute',
        },
      },
    },
  },
  refresh: {
    format: {
      jwt: {
        string: '30d',
        number: 30 * 24 * 60 * 60 * 1000,
      },
      moment: {
        add: {
          amount: 30,
          unit: 'days',
          endOfUnit: 'day',
        },
      },
    },
  },
};
