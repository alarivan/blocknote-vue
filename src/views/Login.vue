<template>
  <div class="flex justify-center items-center h-70vh">
    <div class="text-center sm:w-1/2">
      <h1 class="mb-4 text-2xl font-bold">BlockNote.xyz</h1>
      <p class>Note taking application with keyboard shortcuts for everything.</p>
      <p class="mb-3">
        Built on
        <a
          class="underline hover:text-green-600"
          href="https://blockstack.org"
          target="_blank"
        >Blockstack</a>
      </p>
      <button
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4"
        @click.prevent="signIn"
      >Sign In With Blockstack</button>
    </div>
  </div>
</template>

<script>
import { userSession } from "../helper/userSession";

export default {
  name: "login",
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
