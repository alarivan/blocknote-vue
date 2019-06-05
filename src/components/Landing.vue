<template>
  <div class="container mx-auto">
    <div class="flex flex-wrap mb-20">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="w-full sm:w-1/2 p-4 pb-10 text-center"
      >
        <h3 class="text-xl font-bold mb-2">{{item.title}}</h3>
        <p class="max-w-xs mx-auto text-lg" v-html="item.description"></p>
      </div>
    </div>
    <div class="w-full mx-auto py-2 mb-8 text-center">
      <h4>contact developer:</h4>
      <a class="underline" href="mailto:alarivan@pm.me">alarivan@pm.me</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "landing",
  data() {
    return {
      items: [
        {
          title: "Encrypted",
          description:
            "Your data is encrypted with keys that only you hold via <a class='underline hover:text-green-600' href='https://blockstack.org' target='_blank'>Blockstack.</a>"
        },
        {
          title: "Quick and Simple",
          description:
            "Find, edit and copy your notes in seconds using advanced search and tags."
        },
        {
          title: "Decentralised",
          description: "You are in control of where your data is stored."
        },
        {
          title: "Access anywhere",
          description:
            "You have acces to your notes on mobile and desktop devices."
        }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>