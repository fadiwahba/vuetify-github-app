<template>
  <div class="home">
    <v-row>
      <v-col cols="6">
        <div class="d-flex flex-column justify-end align-start px-5 py-10">
          <h1 class="primary--text display-4 font-weight-thin my-4">
            Hi There!
          </h1>
          <p class="body-1 black--text">
            This is a simple Vue.js App to showcase how to consume the GitHub
            API. The main two API endpoints used in this App are the
            <code>Search user</code> and the <code>Search Topic</code>.
            <br />
            <br />
            You can use the
            <strong>top navigation menu</strong>
            to switch between the two search pages.
          </p>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="px-5">
          <v-img src="../assets/developer_2.svg"></v-img>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
