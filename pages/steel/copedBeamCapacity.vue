<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center fill-height>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Select Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-select label="Fy" :items="FyList" v-model="Fy" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Lc (in)" v-model="Lc" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Dc (in)" v-model="Dc" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Setback (in)" v-model="c" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Coped Flange" :items="copedFlangeList" v-model="copedFlange" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="R (k)" v-model="R" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
          
          {{calculate}}
            <v-flex xs12>
                <value-number :method="method" title="M"  :value="fMn" unit="k-ft" decimal="2"></value-number>
            </v-flex>
            
            
        </v-layout>
    </module-card>
</template>

<script>
    import * as Data_W from '@/data/Data_W' 
    import CopedBeamCapacity from '@/classes/steel/clsCopedBeamCapacity'

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
                ShapeList:[],
                Shape :'W16X26',
                FyList : [50, 36],
                Fy : 50,
                Lc : 2,
                Dc : 2,
                copedFlangeList : ['Top', 'Both'],
                copedFlange : 'Top',
                c : 0.5,
                R : 20,
                methodList : ['ASD','LRFD'],
                method : 'ASD',

                fMn : 0,
            
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
             _.forEach(Data_W.ShapeList,item =>{
                this.ShapeList.push(item)
            }) 
        },//MOUNTED
        computed:{
            items(){
                return _.map(this.ShapeList, 'Shape')
            },//ITEMS
            calculate(){
                let inputData = {
                    method : this.method,
                    section : _.omit(_.find(this.ShapeList, {'Shape': this.Shape}),['Shape']),
                    Fy : this.Fy,
                    Lc : this.Lc,
                    Dc : this.Dc,
                    c : this.c,
                    copedFlange : this.copedFlange,
                    R : this.R
                }

                let CB = new CopedBeamCapacity(inputData)

                //this.fMn = CB.momentCapacity()

                this.fMn = CB.Mlb()
                
            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>