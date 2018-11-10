<template>
  <div>
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/header';

export default {
  components: {
    appHeader: Header
  }
}
</script>

<style>


</style>
