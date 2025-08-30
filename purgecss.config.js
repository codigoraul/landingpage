module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  css: [
    './public/css/bootstrap.min.css',
    './public/css/app.min.css',
    './public/css/fontawesome.css',
    './public/css/aos.css',
    './public/css/main.css'
  ],
  safelist: [
    'aos-init',
    'aos-animate',
    /^fa-/,
    /^aos-/,
    /^data-aos/,
    /^btn/,
    /^col-/,
    /^row/,
    /^container/,
    /^d-/,
    /^mt-/,
    /^mb-/,
    /^p-/,
    /^m-/
  ],
  output: './dist/assets/css/'
} 