<template>
  <v-container>
    <Alert :options="snackBar" @close="snackBar.show = false"/>
    <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Estás a punto de eliminar el permiso, ¿Deseas Continuar?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deletePermiso">Proceder</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    <v-row class="text-center">
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :loading="loading"
        class="elevation-1">
      <template v-slot:top>
        <v-toolbar
          flat>
          <v-toolbar-title>Permisos</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <PermisoCreateOrUpdate 
            :tipo-permiso="tipoPermiso"
            @on-error="snackBar = $event"
            @close-and-update="updateCallback" >
            <v-btn
                color="primary"
                dark
                class="mb-2"
                >
                Nuevo Elemento
            </v-btn>
          </PermisoCreateOrUpdate>
         
      </v-toolbar>
    </template>

        <template v-slot:item.tipoPermiso="row">
          {{ getTipoPermisoDescripcion(row.item.tipoPermisoId) }}
        </template>

        <template v-slot:item.fechaPermiso="row">
          {{ toDate(row.item.fechaPermiso) }}
        </template>

        <template v-slot:item.opciones="{ item }">

          <PermisoCreateOrUpdate
            @close-and-update="updateCallback" 
            @on-error="snackBar = $event"
            :permiso="item" :tipo-permiso="tipoPermiso">
             <v-icon
              small
              class="mr-2">
            
              mdi-pencil
            </v-icon>
          </PermisoCreateOrUpdate>

         
          <v-icon
            small
            @click="deleteConfirm(item)"
          >
            mdi-delete
          </v-icon>
        </template>

        <template v-slot:footer.prepend>
          <v-btn :loading="loading" depressed small fab>
              <v-icon @click="getPermisos">mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-row>
  </v-container>
</template>

<script>
  import api from '@/api'
  import moment from 'moment'
  import PermisoCreateOrUpdate from './PermisoCreateOrUpdate.vue'
  import Alert from './Alert.vue'
  export default {
    components: { PermisoCreateOrUpdate, Alert},
    name: 'PermisosTable',

    data: () => ({
      items: [],
      loading: false,
      tipoPermiso: [],

      snackBar: {
        show: false,
        text: '',
        timeout: 750,
        color: 'success'
      },

      itemTodelete: null,
      dialogDelete: false,

    }),
    computed:{
      headers() {
        return [
          {text: 'Nombre', value: 'nombre'},
          {text: 'Apellidos', value: 'apellidos'},
          {text: 'Tipo Permiso', value: 'tipoPermiso'},
          {text: 'Fecha', value: 'fechaPermiso'},
          {text: 'Opciones', value: 'opciones'}
        ]
      },

    },
    methods:{
      getPermisos: async function (){
        this.loading = true
        try{
          const permisos = await api.getPermisosAll()
          this.items = permisos
        }catch(e){
          console.log(e)
        }finally{
          this.loading = false
        }
      },
      getTipoPermiso: async function(){
        try{
          const tipoPermiso = await api.getTipoPermisoAll()
          this.tipoPermiso = tipoPermiso
        }catch(e){
          console.log(e)
        }
      },

      getTipoPermisoDescripcion(idTipoPermiso){
        const tipoPermiso = this.tipoPermiso.filter(tipo => tipo.id === idTipoPermiso)
        return tipoPermiso.length > 0 ? tipoPermiso[0].descripcion : ''
      },

      toDate(date){
        const format = 'YYYY-MM-DD'
        return moment(date).format(format)
      },

      updateCallback(options){
        
        this.getTipoPermiso()
        this.getPermisos()

        this.snackBar = options

      },

      deleteConfirm(permiso){
        this.itemTodelete = permiso
        this.dialogDelete = true
      },
      deletePermiso: async function(){
        this.dialogDelete = false
        try{
          const tipoPermiso = this.tipoPermiso
                .filter( t=> t.id === this.itemTodelete.tipoPermisoId)
          this.itemTodelete.tipoPermiso = tipoPermiso[0]

          await api.deletePermiso(this.itemTodelete)

          this.getTipoPermiso()
          this.getPermisos()

          const snackBar = { ...this.snackbar, show: true, text: 'Cambios Guardados', color: 'success' } 
          this.snackBar = snackBar
        }catch(e){
           const snackBar = { ...this.snackbar, show: true, text: 'Error al actualizar', color: 'warning' } 
           this.snackBar = snackBar
        }
      }

    },
    created(){
      this.getPermisos()

      this.getTipoPermiso()
    },

    
  }
</script>
