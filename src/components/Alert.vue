<template>
    <v-snackbar
            v-model="options.show"
            top
            right
            :color="options.color"
            :timeout="options.timeout">
                {{ options.text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="white"
                    text
                    v-bind="attrs"
                    @click="$emit('close')">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
</template>

<script>

export default {
    name: 'Alert',
    props:{
        options:{
            type: Object,
            required: true,
        }
    },
    data: () => {
        return{

        }
    }
}
</script>
