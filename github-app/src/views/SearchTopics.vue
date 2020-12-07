<template>
  <div class="search-topics">
    <find-topic></find-topic>
  </div>
</template>
<script>
import FindTopic from "../components/FindTopic.vue";
export default {
  components: { FindTopic },
  name: "SearchTopics"
};
</script>
