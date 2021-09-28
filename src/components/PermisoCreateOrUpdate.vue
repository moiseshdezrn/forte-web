
<template>
    <v-dialog
        v-model="dialog"
        max-width="500px">
        <template v-slot:activator="{ on, attrs }">
            
            <span v-bind="attrs"
                v-on="on">
                <slot >

                </slot>
            </span>
        </template>
        <v-card>
            
            <v-card-title>
                <span class="text-h5">{{ title }}</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="valid" @@submit="$event.preventDefault()">
                <v-container>
                    <v-row>
                    
                        <v-col
                            cols="12"
                            sm="6"
                            md="6">
                            <v-text-field
                                :value="permiso.nombre"
                                @change="permisoToSave.nombre = $event"
                                label="Nombre"
                                :rules="rules.nombre"
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="6">
                            <v-text-field
                                @change="permisoToSave.apellidos = $event"
                                :value="permiso.apellidos"
                                :rules="rules.apellidos"
                                label="Apellidos"
                            ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="6">
                            <v-menu
                                v-model="menuDateDialog"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="permisoToSave.fechaPermiso"
                                    label="Fecha del Permiso"
                                    prepend-icon="mdi-calendar"
                                    :rules="rules.fecha"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="permisoToSave.fechaPermiso"
                                    @input="menuDateDialog = false"
                                ></v-date-picker>
                            </v-menu>
                            
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="6">
                            <v-autocomplete
                                :items="tipoPermiso"
                                item-value="id"
                                item-text="descripcion"
                                @change="permisoToSave.tipoPermisoId = $event"
                                :value="permiso.tipoPermisoId"
                                :rules="rules.tipo"
                                label="Permiso"
                            ></v-autocomplete>
                        </v-col>
                       
                    </v-row>
                </v-container>
                </v-form> 
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close">
                    Cancelar
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import api from '@/api'
import moment from 'moment'
export default{
    
    name: 'PermisoCreateOrUpdate',

    props:{
        permiso:{
            type: Object,
            default(){
                return {}
            }
        },
        tipoPermiso:{
            type: Array,
            required: true,
        }
        
    },

    data: () =>{
        return {
            menuDateDialog: false,
            menuDateValue: null,
            dialog: false,
            permisoToSave: {},
            rules:{
                nombre: [
                    v => (v != null && v !== '' ) || 'Requerido',
                ],
                apellidos: [
                    v => (v != null && v !== '' ) || 'Requerido',
                ],
                fecha: [
                    v => (v != null && v !== '' ) || 'Requerido',
                ],
                tipo: [
                    v => (v != null && v !== '' ) || 'Requerido',
                ],
            },
            valid: false,
            
        }
    },

    methods:{
        close(){
            this.dialog = false
        },
        save(){
            this.validate()
            if(!this.valid) return
            if(this.permiso && this.permiso.id)
                this.update()
            else this.create()
        },
        create: async function(){
            try{
                const tipoPermiso = this.tipoPermiso
                .filter( t=> t.id === this.permisoToSave.tipoPermisoId)
                this.permisoToSave.tipoPermiso = tipoPermiso[0]
                
                await api.createPermiso(this.permisoToSave)
                const snackBar = { ...this.snackbar, show: true, text: 'Cambios Guardados', color: 'success' } 
                this.$emit('close-and-update', snackBar)
                this.dialog = false
                this.clean()
            }catch(e){
                const snackBar = { ...this.snackbar, show: true, text: 'Error al guardar', color: 'warning' } 
                this.$emit('on-error', snackBar)
            }

        },
        update: async function(){
            try{
                const tipoPermiso = this.tipoPermiso
                .filter( t=> t.id === this.permisoToSave.tipoPermisoId)
                this.permisoToSave.tipoPermiso = tipoPermiso[0]
                
                await api.updatePermiso(this.permisoToSave)
                const snackBar = { ...this.snackbar, show: true, text: 'Cambios Guardados', color: 'success' } 
                this.$emit('close-and-update', snackBar)
                this.dialog = false
            }catch(e){
                 const snackBar = { ...this.snackbar, show: true, text: 'Error al guardar', color: 'warning' } 
                this.$emit('on-error', snackBar)
            }
            
        },
        clean(){
            this.permisoToSave = {
                
            }
        },

        validate() {
            if (this.$refs.form)
                this.$refs.form.validate()
        },
        reset() {
            if (this.$refs.form)
                this.$refs.form.reset()
        },
        resetValidation() {
            if (this.$refs.form)
                this.$refs.form.resetValidation()
        },
    },

    computed:{
        title(){
            return this.permiso && this.permiso.id? 'Editar' : 'Nuevo'
        }
    },

    watch:{
        permiso:{
            deep: true,
            immediate: true,
            handler(newPermiso){
                const format = 'YYYY-MM-DD'
                const date = newPermiso.fechaPermiso ?
                 moment(newPermiso.fechaPermiso).format(format)
                 : null
                this.permisoToSave = {
                    ...newPermiso, 
                    fechaPermiso: date
                }
            }
        },
        dialog(value){
            if(!value){
                this.resetValidation()
            }
        }
    }
}
</script>
