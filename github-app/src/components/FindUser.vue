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

    <h1 class="display-3 font-weight-thin primary--text mb-4">
      Find a Github User
    </h1>
    <v-row>
      <v-col cols="12">
        <v-toolbar
          rounded
          elevation="2"
          color="grey lighten-4"
          class="mb-1 p-2"
        >
          <v-text-field
            data-testid="search-field"
            class="mr-4"
            placeholder="Github username, for example: Fady, or Tom"
            outlined
            dense
            hide-details
            clearable
            v-model="searchQuery"
            color="primary"
            clear-icon="mdi-close"
            append-icon="mdi-card-search"
            @click:append="onSearch"
            v-on:keydown.13="onSearch"
            :rules="validationRules"
          ></v-text-field>
          <v-select
            data-testid="sort-field"
            class="mr-4"
            v-model="defaultSortKey"
            outlined
            dense
            color="primary"
            item-color="primary"
            hide-details
            :items="sortByKeys"
            :disabled="!searchQuery || !searchQuery.length || noRecords"
            prepend-inner-icon="mdi-sort"
            @change="onSearch"
          >
          </v-select>
          <v-btn-toggle
            data-testid="order-btn"
            class="mr-4"
            v-model="defaultOrder"
            @change="onSearch"
            mandatory
            color="primary"
          >
            <v-btn
              small
              depressed
              color="primary"
              :disabled="!searchQuery || !searchQuery.length || noRecords"
              :value="'asc'"
            >
              <v-icon color="white" small>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn
              small
              depressed
              color="primary"
              :disabled="!searchQuery || !searchQuery.length || noRecords"
              :value="'desc'"
            >
              <v-icon color="white" small>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
          <v-btn
            data-testid="reset-btn"
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
          <div class="text-left">
            About <span class="primary--text">{{ totalResult }}</span> results
          </div>
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
                      color="secondary"
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
      <v-row>
        <v-col>
          <v-pagination
            v-model="currentPage"
            class="my-4"
            :total-visible="15"
            :length="numberOfPages()"
            @input="onPageChange"
          ></v-pagination>
        </v-col>
      </v-row>
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
      totalResult: null,
      resultPerPage: 24,
      currentPage: 1,
      disablePrevious: true,
      disableNext: true,
      validationRules: [
        value => !!value || "Required.",
        value => (value || "").length <= 50 || "Max 50 characters"
      ]
    };
  },
  methods: {
    fetchData: function() {
      if (this.searchQuery && this.searchQuery.length) {
        this.loading = true;
        this.noRecords = false;
        let url = `https://api.github.com/search/users?q=${this.searchQuery}&sort=${this.defaultSortKey}&order=${this.defaultOrder}&per_page=${this.resultPerPage}&page=${this.currentPage}`;
        axios
          .get(url)
          .then(response => {
            if (response.data && response.data.items.length) {
              this.result = response.data;
              this.totalResult = response.data.total_count;
            }
            if (response.data && response.data.items.length === 0) {
              this.snackbarText =
                "Sorry we could not find any records, Try another search!";
              this.snackbar = true;
              this.noRecords = true;
              this.reset();
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.error(error);
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
      this.$router.push({ name: "users", params: { userName: item.login } });
    },
    onFollowMe() {
      this.snackbarText =
        "This is just a placeholder of a 'follow me' action ;)";
      this.snackbar = true;
    },
    numberOfPages() {
      if (this.resultPerPage && this.totalResult) {
        return Math.ceil(this.totalResult / this.resultPerPage);
      } else {
        return 0;
      }
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchData(this.currentPage);
    },
    onPageChange() {
      this.fetchData(this.currentPage);
    }
  }
};
</script>
