<template>
  <div class="container-header d-flex w-100 flex-row justify-content-center align-items-center p-3">
    <router-link to="/">The App Header</router-link>
    <div class="flex-fill"></div>
    <div class="d-flex flex-row">
      <router-link to="/signin" class="mr-2">Connexion</router-link>
      <router-link to="/signup">Inscription</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheHeader",
  components: {}
};
</script>

<style scoped>
.container-header {
  background-color: #192a56;
  color: white;
}

a {
  color: white;
  text-decoration: none;
}
</style>