<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="pa-3 ">
                        <v-combobox label="Select Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="Lu (ft)" v-model="Lu" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="pa-3">
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" :items="FyList" v-model="Fy" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="pa-3">
                        <v-text-field label="Lx (ft)" v-model="Lx" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Ly (ft)" v-model="Ly" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="pa-3">
                        <v-text-field label="Kx" v-model="Kx" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Ky" v-model="Ky" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            {{design}}
            <v-flex xs6> 
                <value-number :method="method" title="M" subscript="nx" :value="fMnx"  :decimal=0 unit="k-ft" tooltip="Flexural Capacity"></value-number>
            </v-flex>
            <v-flex xs6> 
                <value-number :method="method" title="M" subscript="ny" :value="fMny"  :decimal=0 unit="k-ft" tooltip="Flexural Capacity"></value-number>
            </v-flex>
            <v-flex xs6> 
                <value-number :method="method" title="V" subscript="nx" :value="fVnx" :decimal=0 unit="k" tooltip="Shear Capacity"></value-number>
            </v-flex>
            <v-flex xs6> 
                <value-number :method="method" title="V" subscript="ny" :value="fVny" :decimal=0 unit="k" tooltip="Shear Capacity"></value-number>
            </v-flex>
            <v-flex xs6> 
                <value-number :method="method" title="P" subscript="n" :value="fPn" :decimal=0 unit="k" tooltip="Axial Capacity"></value-number>
            </v-flex>
            <v-flex xs6> 
                <value-number :method="method" title="T" subscript="n" :value="fTn" :decimal=0 unit="k" tooltip="Tension Capacity"></value-number>
            </v-flex>

            <v-flex xs6> 
                <value-parameter title="L" subscript="p" :value="Lp" :decimal=2 unit="ft"></value-parameter>
            </v-flex>
            <v-flex xs6> 
                <value-parameter title="L" subscript="r" :value="Lr" :decimal=2 unit="ft"></value-parameter>
            </v-flex>
        
        </v-layout>
    </module-card>
</template>

<script>
import _ from 'lodash'
import * as Data_W from '@/data/Data_W' 
import SteelW from '@/classes/steel/clsSteelW'
import ModuleCard from '@/components/ModuleCard.vue'
import ValueNumber from '@/components/ValueNumber.vue'
import ValueParameter from '@/components/ValueParameter.vue'

export default {
     middleware: ['auth'],
        components:{
            ModuleCard, ValueNumber, ValueParameter
        },//COMPONENTS
        data(){
            return{
                ShapeList:[],
                Shape :'W16X26',
                methodList : ['ASD','LRFD'],
                method : 'ASD',
                FyList : ['50','36'],
                Fy : '50',
                Lu : 12,
                Lx : 12,
                Ly : 12,
                Kx : 1,
                Ky : 1,

                //CAPACITIES
                fMnx : '',
                fMny : '',
                fVn : '',
                fPn : '',
                fTn : '',
                //PARAMETERS
                Lp : '',
                Lr : ''
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
            design(){
                let inputData = {
                    method : this.method,
                    section : _.omit(_.find(this.ShapeList, {'Shape': this.Shape}),['Shape']),
                    Fy : this.Fy,
                    Lu : this.Lu,
                    Lx : this.Lx,
                    Ly : this.Ly,
                    Kx : this.Kx,
                    Ky : this.Ky
                }

                let W = new SteelW(inputData)

                this.fMnx = W.fMnx()
                this.fMny = W.fMny()
                this.fPn = W.fPn()
                this.fVnx = W.fVnx()
                this.fVny = W.fVny()
                this.fTn = W.fTn()

                this.Lp = W.Lp()/12
                this.Lr = W.Lr()/12

            },//DESIGN
            capitalizeTitle(){
               return _.upperCase(this.title)
           },//CAPITALIZE TITLE
        },//COMPUTED
        methods:{
            
        }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>
