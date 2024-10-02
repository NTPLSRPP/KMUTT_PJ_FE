<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div id="modal" class="absolute z-20"></div>
  <div id="addmodal" class="absolute z-20"></div>
  <div id="editmodal" class="absolute z-20"></div>
  <div id="delmodal" class="absolute z-20"></div>
  <RouterView />
  
</template>

<style scoped></style>
