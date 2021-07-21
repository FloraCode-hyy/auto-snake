<template>
  <div class="app">
    <snake-border :size="size"/>
  </div>
</template>

<script>
import SnakeBorder from './components/broder.vue'
export default {
  name: 'App',
  components: {
    SnakeBorder
  },
  data(){
    return {
      size:30
    }
  }
}
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:60px auto;
}
</style>
