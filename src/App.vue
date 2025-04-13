<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div
        class="d-flex justify-content-center align-items-center"
        style="height: 100vh"
      >
        <div
          class="spinner-border text-primary"
          role="status"
          aria-hidden="true"
        ></div>
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
