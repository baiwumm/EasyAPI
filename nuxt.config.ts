// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 5173
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NODE_ENV === 'production' ? process.env.NUXT_SITE_URL : 'http://localhost:5173',
      siteTitle: process.env.NUXT_SITE_NAME,
      siteDescription: process.env.NUXT_SITE_DESCRIPTION,
      siteKeywords: process.env.NUXT_SITE_KEYWORDS,
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }, // 页面过渡效果
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css"
        }
      ],
      script: [
        {
          // 第一部分：GTM 主脚本
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MPNCNMV4');`,
          type: 'text/javascript',
        }
      ],
      noscript: [
        {
          // 第二部分：noscript 备用 iframe
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPNCNMV4"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          tagPosition: 'bodyOpen' // 确保在 body 开始处插入
        }
      ]
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/supabase',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
    'nuxt-umami',
    'dayjs-nuxt',
    '@nuxt/ui',
    'nuxt-gtag',
    'nuxt-clarity-analytics',
    '@vueuse/nuxt'
  ],
  // supabase Auth
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/admin(/*)?'] // 只有 admin 才需要登录
    }
  },
  // nuxt-umami Umami 统计
  umami: {
    id: '27a00f30-5b76-495a-bf6d-46fc160f9a6b',
    host: 'https://umami.baiwumm.com',
    autoTrack: true
  },
  // nuxt-gtag 谷歌统计
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-0EBBC636CZ',
    config: {
      page_title: process.env.NUXT_SITE_NAME
    },
  },
  // dayjs 插件
  dayjs: {
    locales: ['zh-cn'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  },
  // @nuxtjs/color-mode 配置
  colorMode: {
    classSuffix: ''
  },
  // @nuxt/icon 配置
  icon: {
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './app/assets/icons'
      },
    ],
  },
  // @nuxt/ui 配置
  ui: {
    fonts: false
  },
  // 站点地图配置
  sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
    ],
  },
  experimental: {
    viewTransition: true
  },
  css: ['~/assets/css/main.css']
})