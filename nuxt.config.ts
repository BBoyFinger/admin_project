/** @format */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@ant-design-vue/nuxt", "@pinia/nuxt", "@nuxtjs/supabase"],
  supabase: {
    redirect: false,
  },
  css: ["~/assets/main.css"],
});
