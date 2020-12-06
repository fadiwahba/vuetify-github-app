<template>
  <v-container grid-list-xl>
    <v-snackbar v-model="snackbar" color="accent" top timeout="5000">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-row v-if="loading">
      <v-col cols="12">
        <div class="text-center">
          <v-progress-linear
            indeterminate
            color="secondary"
          ></v-progress-linear>
        </div>
      </v-col>
    </v-row>

    <!-- for debugging -->
    <!-- <v-row>
      <v-col class="red--text">
        <pre>searchQuery: {{ searchQuery }}</pre>
        <pre>defaultSortKey: {{ defaultSortKey }}</pre>
        <pre>defaultOrder: {{ defaultOrder }}</pre>
        <pre>totalResult: {{ totalResult }}</pre>
      </v-col>
    </v-row> -->

    <h1 class="display-3 mb-4">Find a Github User</h1>
    <v-row>
      <v-col cols="12">
        <v-toolbar rounded dark color="accent" class="mb-1 p-2">
          <v-text-field
            placeholder="Github username, for example: Fady, or Tom"
            flat
            dense
            hide-details
            clearable
            v-model="searchQuery"
            color="secondary"
            clear-icon="mdi-close"
            append-icon="mdi-account-search"
            @click:append="searchGitHub"
            v-on:keydown.13="searchGitHub"
            :rules="validationRules"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-select
            v-model="defaultSortKey"
            flat
            dense
            hide-details
            :items="sortByKeys"
            :disabled="!searchQuery || !searchQuery.length || noRecords"
            prepend-inner-icon="mdi-sort"
            @change="searchGitHub"
          >
          </v-select>
          <v-spacer></v-spacer>
          <v-btn-toggle
            v-model="defaultOrder"
            @change="searchGitHub"
            rounded
            mandatory
          >
            <v-btn
              small
              depressed
              color="accent lighten-1"
              :disabled="!searchQuery || !searchQuery.length || noRecords"
              :value="'asc'"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn
              small
              depressed
              color="accent lighten-1"
              :disabled="!searchQuery || !searchQuery.length || noRecords"
              :value="'desc'"
            >
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="warn"
            v-on:click="reset"
            :disabled="!searchQuery || !searchQuery.length || noRecords"
          >
            Reset <v-icon>mdi-restart-off</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <template v-if="result && result.items">
      <v-row>
        <v-col>
          <div class="text-left">About {{ totalResult }} results</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="6" md="4" lg="3" v-for="item in result.items" :key="item.id">
          <v-hover v-slot="{ hover }">
            <v-card
              color="grey lighten-5"
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              class="mx-auto my-4"
            >
              <v-card-text class="text-center">
                <v-avatar v-if="item.avatar_url" size="150" class="mb-4">
                  <img :src="item.avatar_url" />
                </v-avatar>
                <h2 v-if="item.login">
                  {{ item.login }}
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <a
                        :href="item.html_url"
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
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  small
                  color="primary"
                  v-on:click="onViewDetails(item)"
                >
                  More Info
                </v-btn>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      color="grey lighten-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="onFollowMe"
                    >
                      <v-icon>
                        mdi-heart
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Follow me</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-toolbar dense rounded outlined flat color="grey lighten-4">
        <span class="mr-4 grey--text">
          Page
          <span class="primary--text">
            {{ currentPage }}
          </span>
          of
          <span class="primary--text">
            {{ numberOfPages }}
          </span>
        </span>
        <v-spacer></v-spacer>
        <v-btn
          fab
          depressed
          x-small
          dark
          color="primary"
          class="mr-1"
          @click="previousPage"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          fab
          depressed
          x-small
          dark
          color="primary"
          class="ml-1"
          @click="nextPage"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      snackbar: false,
      snackbarText: "",
      searchQuery: "",
      noRecords: false,
      result: null,
      defaultSortKey: "joined",
      sortByKeys: ["joined", "followers", "repositories"],
      defaultOrder: "asc",
      resultPerPage: "24",
      totalResult: null,
      currentPage: "1",
      validationRules: [
        value => !!value || "Required.",
        value => (value || "").length <= 50 || "Max 50 characters"
      ]
    };
  },
  computed: {
    numberOfPages() {
      if (this.resultPerPage && this.totalResult) {
        return Math.ceil(this.totalResult / this.resultPerPage);
      } else {
        return 0;
      }
    }
  },
  methods: {
    searchGitHub: function() {
      if (this.searchQuery && this.searchQuery.length) {
        this.loading = true;
        this.noRecords = false;
        axios
          .get(
            `https://api.github.com/search/users?q=${this.searchQuery}&sort=${this.defaultSortKey}&order=${this.defaultOrder}&per_page=${this.resultPerPage}&page=${this.currentPage}`
          )
          .then(response => {
            console.log("response: ", response);
            if (response.data && response.data.items.length) {
              this.result = response.data;
              this.totalResult = response.data.total_count;
            }
            if (response.data && response.data.items.length === 0) {
              this.snackbarText =
                "Sorry we could not find any records, Try another search!";
              this.snackbar = true;
              this.noRecords = true;
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log(error);
            this.snackbarText = error.message;
            this.snackbar = true;
          });
      }
    },
    reset() {
      this.searchQuery = "";
      this.result = null;
      this.defaultSortKey = "joined";
      this.defaultOrder = "asc";
      this.currentPage = 1;
    },
    onViewDetails(item) {
      console.log("item: ", item);
      // named route
      this.$router.push({ name: "users", params: { userName: item.login } });
    },
    onFollowMe() {
      this.snackbarText = "This is just a placeholder of a 'follow me' action";
      this.snackbar = true;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchGitHub();
      }
    },
    nextPage() {
      this.currentPage++;
      this.searchGitHub();
    }
  }
};
</script>
