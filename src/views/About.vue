<template>
  <div class="container mx-auto relative px-2">
    <h1
      class="text-center text-xl my-6"
    >This is an alpha version. Check "To do" section to see what is planned to be added in the full version.</h1>
    <shortcuts class="w-full sm:w-1/2 mx-auto py-2 mb-8"/>
    <todo class="w-full sm:w-1/2 mx-auto py-2 mb-8"/>
    <dependencies class="w-full sm:w-1/2 mx-auto py-2 mb-8"/>
    <div class="w-full mx-auto py-2 mb-8 text-center">
      <h4>contact developer:</h4>
      <a class="underline" href="mailto:alarivan@pm.me">alarivan@pm.me</a>
    </div>
  </div>
</template>

<script>
import Dependencies from "../components/Dependencies";
import Shortcuts from "../components/Shortcuts";
import Todo from "../components/Todo";

export default {
  name: "about",
  components: { Dependencies, Shortcuts, Todo }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>