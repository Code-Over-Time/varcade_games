<template>

  <footer class="footer">
    <div>
      <p>!! Warning: This is a dev server and is likely to be unstable / regularly reset !!</p>
    </div>
  </footer>

</template>

<script>

export default {
  name: "wp-footer"
}

</script>

<style scoped>
  .footer {   
    position: absolute;   
    padding: 1em;
    bottom: 0;   
    width: 100%;   
    background-color: black;
    color: #f8f9fa!important;
 }
</style>
