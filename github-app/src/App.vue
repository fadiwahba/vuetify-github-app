<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title>
        <v-img
          :src="require('./assets/logo_white.png')"
          alt="Github Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="100"
        />
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

      <!-- <v-btn
        color="secondary"
        v-on:click="$router.push('/home')"
        elevation="2"
        class="mr-4"
      >
        Users
      </v-btn>

      <v-btn
        color="secondary"
        v-on:click="$router.push('/topics')"
        elevation="2"
      >
        Topics
      </v-btn> -->
    </v-app-bar>

    <v-main class="blue-grey lighten-5">
      <v-container>
        <v-row>
          <v-col>
            <v-card elevation="4">
              <v-card-text>
                <router-view />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>
<style lang="sass">
.v-application a
  text-decoration: none
</style>
