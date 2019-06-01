<template>
  <div class="container mx-auto relative px-2">
    <h1 class="text-center text-3xl my-6">Settings</h1>
    <import-export class="w-full sm:w-1/2 mx-auto py-2 mb-8"/>
  </div>
</template>

<script>
import ImportExport from "../components/Settings/ImportExport";

export default {
  name: "settings",
  components: { ImportExport }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>