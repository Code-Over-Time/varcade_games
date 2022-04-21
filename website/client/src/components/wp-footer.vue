<template>

  <footer class="footer">
    <div>
      <p>!! Warning: This is a dev server and is likely to be unstable / regularly reset !!</p>
      <p>Varcade Games is a <a href="https://codeovertime.com">Code Over Time</a> project.</p>
      <p>Source code is <a href="https://github.com/Code-Over-Time/varcade_games">available on Github</a>.</p>
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
    padding: 4rem;
    max-width: 100vw;
    width: 100%;   
    background-color: black;
    color: #f8f9fa!important;
    text-align: center;
 }
</style>
