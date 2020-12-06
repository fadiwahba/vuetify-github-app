<template>
  <div class="search-users">
    <find-user />
  </div>
</template>

<script>
// @ is an alias to /src
import FindUser from "@/components/FindUser.vue";

export default {
  name: "SearchUsers",
  components: {
    FindUser
  }
};
</script>
