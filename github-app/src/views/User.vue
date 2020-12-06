<template>
  <div class="user details">
    <user-details :userName="userName"></user-details>
  </div>
</template>

<script>
import UserDetails from "../components/UserDetails.vue";
// @ is an alias to /src

export default {
  name: "user",
  components: {
    UserDetails
  },
  data() {
    return {
      userName: this.$route.params.userName
    };
  },
  mounted() {
    //
  }
};
</script>
