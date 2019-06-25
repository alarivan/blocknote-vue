<template>
  <div class="container mx-auto relative px-2">
    <Options class="w-full sm:w-1/2 mx-auto py-2 mb-8"/>
  </div>
</template>

<script>
import Options from "../components/Settings/Options";

export default {
  name: "settings",
  components: { Options }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>