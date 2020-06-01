<template>
    <module-card :root="root" :title="title">
        
         <v-layout row wrap justify-center>
            <v-flex xs6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Pg (psf)" v-model="Pg" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Terrain" :items="terrainList" v-model="terrain" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Exposure" :items="exposureList" v-model="exposure" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Thermal" :items="thermalList" v-model="thermal" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Category" :items="categoryList" v-model="category" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          {{calculate}}
            <v-flex xs6>
                <value-number title="P" subscript="f" :value="Pf" unit="psf" :decimal=0 tooltip="Flat roof snow load"></value-number>
            </v-flex>
            <v-flex xs6>
                <value-number title="P" subscript="m" :value="Pm" unit="psf" :decimal=0 tooltip="Minimum roof snow load"></value-number>
            </v-flex>
            
         </v-layout>
       
    </module-card>
</template>

<script>
    import Snow from '@/classes/snow/clsSnow'
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'

    import _ from 'lodash'

    export default {
        components:{
                ModuleCard, ValueNumber
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                Pg:20,
                exposureList : ['Full','Partial','Sheltered'],
                exposure : 'Full',
                terrainList : ['B','C','D'],
                terrain : 'B',
                thermalList : ['Others','Above Freezing','Unheated','Below Freezing','Greenhouses'],
                thermal : 'Others',
                categoryList : ['I','II','III','IV'],
                category : 'II',

                Pf:'',
                Pm:''
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
                    Pg : this.Pg,
                    exposure : this.exposure,
                    terrain : this.terrain,
                    exposure : this.exposure,
                    thermal : this.thermal,
                    category : this.category,
                }

                let SL = new Snow(inputData)

                this.Pf = SL.Pf()
                this.Pm = SL.Pm()

            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

    

</style>