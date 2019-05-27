<template>
  <div>
    <h1 class="text-3xl mb-2">Copy Block:</h1>
    <p>You can select part of the note to be copied instead of full note. To do that you need to wrap section that you want to be copied with "~c" opennig symbol and "c~" closing symbol.</p>
    <p>The section will not look any different.</p>
    <p>Having a copy block in your note allows you to only copy that part of the note when you click on copy button or use a shortcut.</p>
    <p class="font-bold my-2">Example:</p>
    <div class="p-4">
      <p class="mb-2">### Title</p>
      <p class="mb-2">~c copy me c~</p>
      <p class="mb-2">don't copy this part</p>
    </div>
    <p>Try creating a note with this example content and clicking a copy button. You will see that only this part "copy me" will be copied.</p>
  </div>
</template>

<script>
export default {
  name: "copy"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>