<template>
  <div>
    <h1 class="text-3xl mb-2">To do:</h1>
    <ul class="list-disc pl-4">
      <li v-for="(item, index) in items" :key="index">
        <h4>{{item.title}}</h4>
        <p v-if="item.description" class>* {{item.description}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "todo",
  data() {
    return {
      items: [
        {
          title: "Add settings",
          description: ""
        },
        {
          title: "Make all the shortcuts rebindable",
          description: ""
        },
        {
          title: "Add themes",
          description:
            "Combine all the color definitions in to a theme. Add the abilty to create new themes."
        },
        {
          title: "Add import/export",
          description: ""
        },
        {
          title: "Add RegExp to search.",
          description: ""
        },
        {
          title: "Add sorting",
          description: ""
        },
        {
          title: "Add caching",
          description: "Only load data from storage if it was changed."
        }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>