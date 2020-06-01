<template>
    <v-container grid-list-md text-xs-center class="pt-2 px-0 pb-0 ma-0">
        <v-layout row wrap justify-center >
            <v-flex xs12 md8 id="module">
                <v-toolbar color="teal lighten-4" >
                    <v-btn icon :to="root">
                        <v-icon>chevron_left</v-icon>
                    </v-btn> 
                    <v-toolbar-title class="black--text title">{{capitalizeTitle}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="printPDF">
                        <v-icon>get_app</v-icon>
                    </v-btn>
                </v-toolbar>
                    <div class="mt-1 px-0 mx-0">
                        <v-container fluid grid-list-md class="pa-0 ma-0">
                            <slot></slot>
                        </v-container>
                        
                    </div>
            </v-flex>
        </v-layout>   
    </v-container>
</template>

<script>
import {pdf} from '@/mixins/printPdfMixin'
import ValueNumber from '@/components/ValueNumber.vue'
import ValueString from '@/components/ValueString.vue'
import ValueParameter from '@/components/ValueParameter.vue'
import ValueMessage from '@/components/ValueMessage.vue'
import ValueCheck from '@/components/ValueCheck.vue'
import ValuePercentage from '@/components/ValuePercentage.vue'
import ValueComputed from '@/components/ValueComputed.vue'
import ValueInteraction from '@/components/ValueInteraction.vue'
import ParamsList from '@/components/ParamsList.vue'
import MessageList from '@/components/MessageList.vue'

export default {
    name:'ModuleCard',
     components:{
        ValueNumber,ValueString, ValueParameter, 
        ValueCheck, ValueComputed, ValuePercentage,
        ValueInteraction,
        ParamsList, MessageList,
    },//COMPONENTS
    props:['root','title'],
    mixins : [pdf],
    data(){
        return{
        }
    },
    
    computed:{
        capitalizeTitle(){
            return _.upperCase(this.title)
        },//CAPITALIZE TITLE
    },
    methods:{

    }
}
</script>

<style>

</style>
