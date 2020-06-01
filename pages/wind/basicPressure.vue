<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center align-center>
            <v-flex xs12>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="V (mph)" v-model="V" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Type" :items="exposureList" v-model="exposure" class="pa-0 ma-0"></v-select>
                        <v-text-field label="z (ft)" v-model="z" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>

            {{calculate}}
            <v-flex xs12>
                <value-number title="p" :value="p" unit="psf" :decimal=0 tooltip="Wind Pressure"></value-number>
            </v-flex>
            
         </v-layout>
    </module-card>
</template>

<script>
    import Wind from '@/classes/wind/clsWind'

    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                V:115,
                z:15,
                exposureList : ['B','C','D'],
                exposure : 'B',

                p:''
            
            }//RETURN
        },//DATA
        head(){
            return {
                title: this.title,
                meta: [
                    { hid: 'description', name: 'description', content: this.description }
                ]
            }
        },//HEAD
        asyncData({store,params,route}){
            let arr = _.split(route.path, '/')
            return{
                title : _.get(_.find(store.state.pagesList,{'category':arr[1],'link':arr[2]}),'title'),
                description : _.get(_.find(store.state.pagesList,{'category':arr[1],'link':arr[2]}),'description'),
                root : '/' + arr[1]  
            }
        },//ASYNCDATA
        created(){
            
        },//CREATED
        mounted(){
            
        },//MOUNTED
        computed:{
            calculate(){
                let inputData = {
                V : this.V,
                exposure : this.exposure,
                z : this.z
                }

                let WL = new Wind(inputData)

                this.p = WL.pressure()
            
            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>