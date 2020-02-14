<template>
<div class="container-header d-flex w-100 flex-row justify-content-center align-items-center p-3">
  <router-link to="/">Template Auth app</router-link>
  <div class="flex-fill"></div>
  <div v-if="!jwtToken && isLoggedIn === false" class="d-flex flex-row">
    <router-link to="/signin" class="mr-2">Connexion</router-link>
    <router-link to="/signup">Inscription</router-link>
  </div>
  <div style="cursor:pointer;" v-if="isLoggedIn" @click="signout">Déconnexion</div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
name: "TheHeader",
computed: {
  ...mapGetters("user", ["isLoggedIn", "jwtToken"])
},
methods: {
  signout() {
    this.$store.commit("user/signOut");
    this.$router.push("/");
  }
}
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