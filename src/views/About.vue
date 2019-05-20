<template>
  <div class="flex h-full justify-center items-center">
    <dependencies/>
  </div>
</template>

<script>
import Dependencies from "../components/Dependencies";

export default {
  name: "about",
  components: { Dependencies },

  methods: {
    signIn() {
      userSession.redirectToSignIn();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>