<template>
  <v-container fluid class="black grey--text">
    <v-row>
      <v-col>
        <footer class="text-right">
          &copy; {{ currentYear }} |
          <v-icon color="secondary" small>mdi-code-tags</v-icon>
          built with
          <v-icon color="red" small>mdi-heart</v-icon> by
          <a
            class="secondary--text"
            target="blank"
            href="http://fadysoliman.name"
            >Fady Soliman</a
          >
        </footer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>
<style lang="scss" scoped>
footer {
  font-size: 12px;
}
</style>
