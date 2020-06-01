<template>
   <module-card :root="root" :title="title">
         <v-layout row wrap justify-center fill-height>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Pg (psf)" v-model="Pg" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Terrain" :items="terrainList" v-model="terrain" class="pa-0 ma-0"></v-select>
                        <v-select label="Exposure" :items="exposureList" v-model="exposure" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Thermal" :items="thermalList" v-model="thermal" class="pa-0 ma-0"></v-select>
                        <v-select label="Category" :items="categoryList" v-model="category" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Lu - High (ft)" v-model="Luh" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lu - Low (ft)" v-model="Lul" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h (ft)" v-model="h" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          {{calculate}}
            <v-flex xs4 md4>
                <value-number title="P" subscript="d" :value="Pd" unit="psf" :decimal=0 tooltip="Snow drift load"></value-number>
            </v-flex>
            <v-flex xs4 md4>
                <value-number title="h" subscript="d" :value="hd" unit="ft" :decimal=0 tooltip="Snow drift height"></value-number>
            </v-flex>
            <v-flex xs4 md4>
                <value-number title="w" subscript="d" :value="wd" unit="ft" :decimal=0 tooltip="Snow drift length"></value-number>
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
                Luh : 25,
                Lul : 25,
                h : 5,

                Pd:'',
                hd:'',
                wd:''
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
                    Luh : this.Luh,
                    Lul : this.Lul,
                    h : this.h,
                }

                let SL = new Snow(inputData)

                this.Pd = SL.Pd()
                this.hd = SL.hd()
                this.wd = SL.wd()

            }//CALCULATE
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>