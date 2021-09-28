const helmet = require('helmet');

const securityPolicyDomain = {
  L04: (process.env.ENV === 'sys') ? ['*.104.com.tw'] : ['*.104.com.tw', '*.104-staging.com.tw', '*.104-dev.com.tw'],
  DocApi: (process.env.ENV === 'sys') ? ['file.doc.104.com.tw'] : ['file.doc.104.com.tw', 'file.doc.104-staging.com.tw', 'file.doc.104-dev.com.tw'],
  DocApiImage: (process.env.ENV === 'sys') ? ['ori.doc.104.com.tw'] : ['ori.doc.104.com.tw', 'ori.doc.104-staging.com.tw', 'ori.doc.104-dev.com.tw']
}

const helmetMid = (app) => {
  app.use(helmet({
    // noCache: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
      force: true
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          ...securityPolicyDomain.L04,
          ...securityPolicyDomain.DocApiImage,
          'www.googletagmanager.com', 'tagmanager.google.com', 'www.google-analytics.com',
          '*.gstatic.com', '*.ggpht.com', 'stats.g.doubleclick.net',
          '*.hotjar.com', '*.hotjar.io', 'wss://*.hotjar.com',
          'polyfill.io',
          '*.youtube.com',
          '*.podcasts.apple.com',
          '*.music.apple.com',
          '*.mzstatic.com',
          '*.apple.com',
          'analytics.google.com',
        ],
        scriptSrc: [
          "'self'", "'unsafe-inline'", "'unsafe-eval'",
          ...securityPolicyDomain.L04,
          ...securityPolicyDomain.DocApiImage,
          'static.104.com.tw',
          '*.googleapis.com', '*.google-analytics.com', '*.googletagmanager.com', '*.google.com',
          '*.gstatic.com', '*.ggpht.com', 'stats.g.doubleclick.net',
          '*.hotjar.com', '*.hotjar.io',
          'connect.facebook.net',
          'd.line-scdn.net',
          'api.ipify.org',
          'polyfill.io',
          '*.youtube.com',
          '*.podcasts.apple.com',
          '*.music.apple.com',
          '*.mzstatic.com',
          '*.apple.com'
        ],
        styleSrc: [
          "'self'", "'unsafe-inline'",
          ...securityPolicyDomain.L04,
          ...securityPolicyDomain.DocApiImage,
          '*.googleapis.com', '*.googletagmanager.com', '*.google.com',
          '*.gstatic.com', '*.ggpht.com', 'stats.g.doubleclick.net',
          '*.hotjar.com', '*.hotjar.io',
          'maxcdn.bootstrapcdn.com',
          'polyfill.io',
          '*.youtube.com',
          '*.podcasts.apple.com',
          '*.music.apple.com',
          '*.mzstatic.com',
          '*.apple.com'
        ],
        imgSrc: [
          "'self'", 'data:', 'blob:',
          ...securityPolicyDomain.L04,
          ...securityPolicyDomain.DocApi,
          ...securityPolicyDomain.DocApiImage,
          '*.googleapis.com', '*.google.com', '*.google.com.tw', '*.google-analytics.com', 'www.googletagmanager.com', 'tagmanager.google.com',
          '*.gstatic.com', '*.ggpht.com', 'stats.g.doubleclick.net',
          '*.facebook.com', '*.fbcdn.net',
          '*.hotjar.com', '*.hotjar.io',
          '*.amazonaws.com',
          'maxcdn.bootstrapcdn.com',
          'polyfill.io',
          'fakeimg.pl',
          'i.imgur.com',
          '*.podcasts.apple.com',
          '*.music.apple.com',
          '*.mzstatic.com',
          '*.apple.com'
        ],
        frameSrc: [
          ...securityPolicyDomain.L04,
          ...securityPolicyDomain.DocApi,
          ...securityPolicyDomain.DocApiImage,
          'www.youtube.com',
          '*.google.com', 'maps.googleapis.com', 'www.googletagmanager.com', 'tagmanager.google.com',
          '*.gstatic.com', '*.ggpht.com', 'stats.g.doubleclick.net',
          'www.facebook.com',
          'timeline.line.me', 'social-plugins.line.me',
          '*.hotjar.com', '*.hotjar.io',
          '*.youtube.com',
          '*.podcasts.apple.com',
          '*.music.apple.com',
          '*.mzstatic.com',
          '*.apple.com'
        ],
        fontSrc: [
          "'self'", 'data:',
          '*.hotjar.com', '*.hotjar.io',
          '*.gstatic.com', '*.ggpht.com', 'stats.g.doubleclick.net',
          'fonts.gstatic.com',
          'sxt.cdn.skype.com',
          'maxcdn.bootstrapcdn.com',
          'polyfill.io',
          '*.youtube.com'
        ],
        reportUri: '/csp/report'
      },
      reportOnly: false
    }
  }));
}

module.exports = helmetMid
