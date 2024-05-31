const basePath = '/';

export default {
  url: {
    basePath,
  },
  timers: {
    userCookieExpiry: '720h',
  },
  env: {
    authSecret: process.env.TOKEN_SECRET_KEY || 'test',
  },
  openApi: {
    key : process.env.OPEN_API_KEY || 'null',
  },
  authorizationIgnorePath: [
    '/',
    '/auth/login',
    '/auth/register',
    
    
  ],
};
