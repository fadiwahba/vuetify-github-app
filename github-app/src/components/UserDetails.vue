<template>
  <v-container grid-list-xl v-if="user">
    <v-card outlined max-width="900" class="mx-auto">
      <v-card-text>
        <v-row>
          <v-col>
            <v-avatar v-if="user.avatar_url" size="400" class="mb-4">
              <img :src="user.avatar_url" />
            </v-avatar>
          </v-col>
          <v-col>
            <h2 class="display-1 mb-4 primary--text">
              {{ user.name ? user.name : user.login }}
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <a
                    :href="user.html_url"
                    target="blank"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon class="ml-1" color="accent">
                      mdi-link-variant
                    </v-icon>
                  </a>
                </template>
                <span>Visit Github profile</span>
              </v-tooltip>
            </h2>
            <p v-if="user.bio">{{ user.bio }}</p>
            <p v-if="user.created_at">
              <v-icon color="secondary" class="mr-2">
                mdi-calendar-account
              </v-icon>
              created at {{ user.created_at }}
            </p>
            <p v-if="user.followers">
              <v-icon color="secondary" class="mr-2">
                mdi-account-group
              </v-icon>
              {{ user.followers }} followers
            </p>
            <p v-if="user.following">
              <v-icon color="secondary" class="mr-2">
                mdi-account-heart
              </v-icon>
              {{ user.following }} following
            </p>
            <p v-if="user.location">
              <v-icon color="secondary" class="mr-2">mdi-map-marker</v-icon>
              {{ user.location }}
            </p>
            <p v-if="user.blog">
              <v-icon color="secondary" class="mr-2">mdi-web</v-icon>
              <a :href="user.blog" target="blank">{{ user.blog }}</a>
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      user: null
    };
  },
  props: {
    userName: String
  },
  mounted() {
    if (this.userName && this.userName.length) {
      this.getUserDetails(this.userName);
    }
  },
  watch: {
    $route(to) {
      // react to route changes...
      this.userName = to.params.userName;
    }
  },
  methods: {
    getUserDetails(userName) {
      axios
        .get(`https://api.github.com/users/${userName}`)
        .then(response => {
          console.log("response: ", response);
          this.user = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    }
  }
};
</script>
<style lang="sass" scoped>
//
</style>
