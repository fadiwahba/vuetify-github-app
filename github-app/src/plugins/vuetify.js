import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.indigo.darken4,
        secondary: colors.teal.accent3,
        accent: colors.shades.black,
        warn: colors.red.accent3,
        error: colors.red.accent3
      },
      dark: {
        primary: colors.blue.lighten3
      }
    }
  },
  icons: {
    iconfont: "mdiSvg" // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  }
});

export default vuetify;
