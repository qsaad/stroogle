<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
        
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Species" :items="speciesItems" v-model="species" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Moisture" :items="moistureList" v-model="moisture" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Temperature" :items="temperatureList" v-model="temperature" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Duration" :items="durationList" v-model="duration" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="L (ft)" v-model="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lu (ft)" v-model="Lu" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="S (in)" v-model="spacing" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Bearing (in)" v-model="bearing" class="pa-0 ma-0"></v-text-field> 
                        <v-text-field label="Lx (ft)" v-model="Lx" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Ly (ft)" v-model="Ly" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            {{design}}

             <v-flex xs12>
                <v-tabs fixed-tabs>
                    <v-tab ripple>Capacities</v-tab>
                    <v-tab ripple>Factors</v-tab>
                    <v-tab ripple>Parameters</v-tab>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="M" subscript="nx" :value="fMnx"  :decimal=0 unit="lb-ft" tooltip="Flexural Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="M" subscript="ny" :value="fMny"  :decimal=0 unit="lb-ft" tooltip="Flexural Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="V" subscript="nx" :value="fVnx" :decimal=0 unit="lb" tooltip="Shear Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="V" subscript="ny" :value="fVny" :decimal=0 unit="lb" tooltip="Shear Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="P" subscript="n" :value="fPn" :decimal=0 unit="lb" tooltip="Axial Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="T" subscript="n" :value="fTn" :decimal=0 unit="lb" tooltip="Tension Capacity"></value-number>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <table>
                                    <tr>
                                        <th v-for="(v,k) in headers" :key="k" v-html="v.text"></th>
                                    </tr>
                                    <tr v-for="(v,k) in adjustmentFactors" :key="k">
                                        <td v-html="v.name"></td>
                                        <td>{{v.adjusted.toFixed(0)}}</td>
                                        <td>{{v.actual.toFixed(0)}}</td>
                                        <td>{{v.CD == 0 ? "-" : v.CD.toFixed(2)}}</td>
                                        <td>{{v.CM == 0 ? "-" : v.CM.toFixed(2)}}</td>
                                        <td>{{v.Ct == 0 ? "-" : v.Ct.toFixed(2)}}</td>
                                        <td>{{v.CF == 0 ? "-" : v.CF.toFixed(2)}}</td>
                                        <td>{{v.CL == 0 ? "-" : v.CL.toFixed(2)}}</td>
                                        <td>{{v.CV == 0 ? "-" : v.CV.toFixed(2)}}</td>
                                        <td>{{v.Cr == 0 ? "-" : v.Cr.toFixed(2)}}</td>
                                        <td>{{v.CP == 0 ? "-" : v.CP.toFixed(2)}}</td>
                                        <td>{{v.Cb == 0 ? "-" : v.Cb.toFixed(2)}}</td>
                                        <td>{{v.KF == 0 ? "-" : v.KF.toFixed(2)}}</td>
                                        <td>{{v.phi == 0 ? "-" : v.phi.toFixed(2)}}</td>
                                        <td>{{v.TE == 0 ? "-" : v.TE.toFixed(2)}}</td>
                                    </tr>
                                </table>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex>
                                        <v-combobox label="Adjustment Factors" :items="forceList" v-model="force" class="pa-0 ma-0"></v-combobox>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs4 v-for="(value,key) in params" :key="key"> 
                                        <value-parameter :title=key :value=value :decimal=2 unit=""></value-parameter>
                                    </v-flex>
                                </v-layout>
                               
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
           
        </v-layout>
    </module-card>
</template>

<script>
import _ from 'lodash'
import ModuleCard from '@/components/ModuleCard.vue'
import ValueNumber from '@/components/ValueNumber.vue'
import ValueParameter from '@/components/ValueParameter.vue'

import {wood} from '@/mixins/woodMixin'

import * as WoodEngineeredSize from '@/data/WoodEngineeredSize' 
import * as WoodEngineeredSpecies from '@/data/WoodEngineeredSpecies' 
import Engineered from '@/classes/wood/clsEngineered'

export default {
     middleware: ['auth'],
        components:{
            ModuleCard, ValueNumber, ValueParameter
        },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                //INPUT PARAMETERS
                sizeList:[],
                size :'1-3/4 x 11-7/8',
                speciesList:[],
                species :'2.0E Microllam LVL',
                bearing : 3.5,
                spacing : 36,
                L : 21,
                Lu : 1,
                Lx : 12,
                Ly : 12,
                //CAPACITIES
                fMnx : '',
                fMny : '',
                fVnx : '',
                fVny : '',
                fPn : '',
                fTn : '',
                //PARAMETERS
                forceList : ['Flexure','Tension','Shear','Axial','Bearing'],
                force : 'Flexure',
                flexureParams : {},
                tensionParams : {},
                shearParams : {},
                axialParams : {},
                bearingParams : {},
                //TABLE HEADERS
                headers: [
                    { text: 'Type', value: 'name' },
                    { text: 'Adjusted', value: 'adjusted' },
                    { text: 'Actual', value: 'actual' },
                    { text: 'C<sub>D</sub>', value: 'CD' },
                    { text: 'C<sub>M</sub>', value: 'CM' },
                    { text: 'C<sub>t</sub>', value: 'Ct' },
                    { text: 'C<sub>F</sub>', value: 'CF' },
                    { text: 'C<sub>L</sub>', value: 'CL' },
                    { text: 'C<sub>V</sub>', value: 'CV' },
                    { text: 'C<sub>r</sub>', value: 'Cr' },
                    { text: 'C<sub>P</sub>', value: 'CP' },
                    { text: 'C<sub>b</sub>', value: 'Cb' },
                    { text: 'K<sub>F</sub>', value: 'KF' },
                    { text: '&phi;', sub:'', value: 'phi' },
                    { text: '&lambda;', sub:'', value: 'TE' },
                ],//HEADERS
                adjustmentFactors : [],

            }//RETURN
        },//DATA
        head(){
            return {
                title: this.title,
                meta: [
                    { hid: 'description', name: 'description', content: this.description }
                ]
            }
        },
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
            _.forEach(_.filter(WoodEngineeredSize.List,{type : '1.9E Microllam'}),item =>{
                this.sizeList.push(item)
            }) 
            _.forEach(WoodEngineeredSpecies.List,item =>{
                this.speciesList.push(item)
            }) 
        },//MOUNTED
        computed:{
            params(){
                switch(this.force){
                    case ('Flexure'):
                        return this.flexureParams
                        break
                    case ('Tension'):
                        return this.tensionParams
                        break
                    case ('Shear'):
                        return this.shearParams
                        break
                    case ('Axial'):
                        return this.axialParams
                        break
                    case ('Bearing'):
                        return this.bearingParams
                        break
                }//SWITCH
            },//PARAMS
            sizeItems(){
                this.sizeList = _.filter(WoodEngineeredSize.List,{type : this.species})
                this.size = _.head(_.map(this.sizeList, 'size'))
                return _.map(this.sizeList, 'size')
            },//ITEMS
            speciesItems(){
                return _.map(this.speciesList, 'species')
            },//ITEMS
            design(){
                let inputData = {
                        method : this.method,
                        size : this.size,
                        noPly : this.noPly,
                        species : this.species,
                        duration : this.duration,
                        moisture : this.moisture,
                        temperature : this.temperature,
                        spacing : this.spacing,
                        bearing : this.bearing,
                        // incision : this.incision == 'Yes' ? true : false,
                        // flat : this.flat == 'Yes' ? true : false,
                        L : this.L,
                        Lu : this.Lu,
                        Lx : this.Lx,
                        Ly : this.Ly,
                }

                let EN = new Engineered(inputData)

                //CAPACITIES
                this.fMnx = EN.fMnx()
                this.fMny = EN.fMny()
                this.fPn = EN.fPn()
                this.fVnx = EN.fVnx()
                this.fVny = EN.fVny()
                this.fTn = EN.fTn()
                //PARAMETERS
                this.flexureParams = EN.flexureParams()
                this.tensionParams = EN.tensionParams()
                this.shearParams = EN.shearParams() 
                this.axialParams = EN.axialParams()
                this.bearingParams = EN.bearingParams()

                //this.adjustmentFactors = []
                this.adjustmentFactors = EN.adjustmentFactors()
            }//Design
        },//COMPUTED
        methods:{
            
        }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>
table {
    
  border-collapse: collapse;
  width: 100%;
}

table, th, td {
    border-bottom: 1px solid #ddd;
  /* border: 1px solid black; */
    padding-top: 5px;
    padding-bottom: 5px;
}

/* tr:hover {background-color: #f5f5f5;} */

tr:nth-child(even) {background-color: #f2f2f2;}

</style>

