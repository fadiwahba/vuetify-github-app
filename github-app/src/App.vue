<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title>
        <router-link
          to="/"
          class="d-flex flex-row justify-center align-center"
          title="Github API"
        >
          <v-icon color="white" large>mdi-github</v-icon>
          <h1 class="secondary--text display-1 font-weight-light mx-2">API</h1>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <router-link to="/find-user" exact class="mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="secondary" v-bind="attrs" v-on="on">
              Users <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <span>Find a Github User</span>
        </v-tooltip>
      </router-link>
      <router-link to="/find-topic" exact class="secondary--text">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="secondary" v-bind="attrs" v-on="on">
              Topics <v-icon>mdi-card-text</v-icon>
            </v-btn>
          </template>
          <span>Find a Github Topic</span>
        </v-tooltip>
      </router-link>
    </v-app-bar>

    <v-main class="blue-grey lighten-5">
      <v-container>
        <v-row>
          <v-col>
            <v-card class="my-5" elevation="5">
              <v-card-text>
                <router-view />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <footer-component></footer-component>
  </v-app>
</template>

<script>
import FooterComponent from "./components/FooterComponent.vue";
export default {
  components: { FooterComponent },
  name: "App",
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>
<style lang="scss">
.v-application a {
  text-decoration: none;
}
</style>
