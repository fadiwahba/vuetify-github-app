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
      Find a Github Topic
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
            class="mr-4"
            placeholder="Github topic, for example: Java, or Vue.js"
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

          <v-switch
            class="mr-4"
            inset
            dense
            outlined
            hide-details
            color="primary"
            v-model="isFeaturedSwitch"
            label="Featured Only"
            :disabled="!searchQuery || !searchQuery.length || noRecords"
            @click="onSearch"
          ></v-switch>
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
          <div class="text-left">
            About <span class="primary--text">{{ totalResult }}</span> results
          </div>
        </v-col>
      </v-row>
      <v-data-table
        :headers="tableHeaders"
        :items="result.items"
        :items-per-page="resultPerPage"
        :hide-default-footer="true"
        loading-text="Loading data, Please wait!"
        class="elevation-2"
      >
        <template v-slot:[`item.featured`]="{ item }">
          <span v-if="item.featured">
            <v-icon color="secondary">mdi-star</v-icon>
          </span>
        </template>
      </v-data-table>

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
      totalResult: null,
      resultPerPage: 50,
      tableHeaders: [
        { text: "Featured", sortable: false, value: "featured" },
        { text: "Name", value: "name" },
        { text: "Created at", value: "created_at" },
        { text: "Description", sortable: false, value: "short_description" }
      ],
      isFeaturedSwitch: false,
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
    fetchData(page) {
      if (this.searchQuery && this.searchQuery.length) {
        let config = {
          headers: {
            Accept: "application/vnd.github.mercy-preview+json"
          }
        };
        let url = "";
        if (this.isFeaturedSwitch) {
          url = `https://api.github.com/search/topics?q=${this.searchQuery}+is:featured`;
        } else {
          url = `https://api.github.com/search/topics?q=${this.searchQuery}&per_page=${this.resultPerPage}&page=${page}`;
        }
        this.loading = true;
        this.noRecords = false;
        axios
          .get(url, config)
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
      this.totalResult = null;
      this.isFeaturedSwitch = false;
      this.currentPage = 1;
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
