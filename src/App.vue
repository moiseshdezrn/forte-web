<template>
  <v-app>
    
    <Header />
    <v-main>
      <PermisosTable />
    </v-main>
  </v-app>
</template>

<script>
import PermisosTable from './components/PermisosTable';
import Header from './components/Header'
export default {
  name: 'App',

  components: {
    PermisosTable,
    Header,
  },

  data: () => ({
    //
  }),
};
</script>
