<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
        
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Select Type" :items="TypeList" v-model="Type" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Select Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="Lu (ft)" v-model="Lu" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" :items="FyList" v-model="Fy" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="Cb " v-model="Cb" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Lx (ft)" v-model="Lx" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Ly (ft)" v-model="Ly" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Kx" v-model="Kx" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Ky" v-model="Ky" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            {{design}}

             <v-flex xs12>
                <v-tabs fixed-tabs>
                    <v-tab ripple>Capacities</v-tab>
                    <v-tab ripple>Parameters</v-tab>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
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
                                        <value-number :method="method" title="T" subscript="rn" :value="fTrn" :decimal=0 unit="k" tooltip="Torsion Capacity"></value-number>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex>
                                        <v-radio-group v-model="paramType" row>
                                            <v-radio label="Flexure" value="flexure"></v-radio>
                                            <v-radio label="Axial" value="axial"></v-radio>
                                            <v-radio label="Shear" value="shear"></v-radio>
                                            <v-radio label="Tension" value="tension"></v-radio>
                                            <v-radio label="Torsion" value="torsion"></v-radio>
                                        </v-radio-group>
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

import * as Data_W from '@/data/Data_W' 
import * as Data_WT from '@/data/Data_WT' 
import * as Data_HSS from '@/data/Data_HSS'
import * as Data_C from '@/data/Data_C'
import * as Data_MC from '@/data/Data_MC'
import * as Data_Pipe from '@/data/Data_Pipe'
import * as Data_HSR from '@/data/Data_HSR'
import * as Data_LLBB from '@/data/Data_LLBB'
import * as Data_LU from '@/data/Data_LU'

import SteelW from '@/classes/steel/clsSteelW'
import SteelWT from '@/classes/steel/clsSteelWT'
import SteelHSS from '@/classes/steel/clsSteelHSS'
import SteelC from '@/classes/steel/clsSteelC'
import SteelMC from '@/classes/steel/clsSteelMC'
import SteelPipe from '@/classes/steel/clsSteelPipe'
import SteelHSR from '@/classes/steel/clsSteelHSR'
import SteelLLBB from '@/classes/steel/clsSteelLLBB'
import SteelLU from '@/classes/steel/clsSteelLU'

export default {
     middleware: ['auth'],
        components:{
            ModuleCard, ValueNumber, ValueParameter
        },//COMPONENTS
        data(){
            return{
                TypeList : ['W','WT','HSS','C','MC','Pipe','HSR','LLBB','LU'],
                Type : 'W',
                ShapeList:[],
                Shape :'W16X26',
                methodList : ['ASD','LRFD'],
                method : 'ASD',
                FyList : [36,50],
                webList :['Tension','Compression'],
                web : 'Tension',
                Fy : 50,
                Lu : 12,
                Lx : 12,
                Ly : 12,
                Kx : 1,
                Ky : 1,
                Cb : 1,

                //CAPACITIES
                fMnx : '',
                fMny : '',
                fVnx : '',
                fVny : '',
                fPn : '',
                fTn : '',
                fTrn : '',
                //PARAMETERS
                paramType : 'flexure',
                axialParams : {},
                flexureParams : {},
                shearParams : {},
                tensionParams : {},
                torsionParams : {}
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
            _.forEach(Data_W.ShapeList,item =>{
                this.ShapeList.push(item)
            }) 
        },//MOUNTED
        computed:{
            params(){
                switch(this.paramType){
                    case ('flexure'):
                        return this.flexureParams
                        break
                    case ('axial'):
                        return this.axialParams
                        break
                    case ('shear'):
                        return this.shearParams
                        break
                    case ('tension'):
                        return this.tensionParams
                        break
                    case ('torsion'):
                        return this.torsionParams
                        break
                }//SWITCH
            },//PARAMS
            items(){
                this.ShapeList = []
                this.FyList = []
                switch(this.Type){
                    case ('W'):
                        _.forEach(Data_W.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 50
                        this.Shape = 'W18X50'
                        break
                    case ('WT'):
                        _.forEach(Data_WT.ShapeList,item =>this.ShapeList.push(item))
                        this.FyList = [36,50]
                        this.Fy = 50
                        this.Shape = 'WT5X6'
                        break
                    case ('HSS'):
                        _.forEach(Data_HSS.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [46]
                        this.Fy = 46
                        this.Shape = 'HSS14X6X3/16'
                        break
                    case ('C'):
                        _.forEach(Data_C.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = 'C15X33.9'
                        break
                    case ('MC'):
                        _.forEach(Data_MC.ShapeList,item =>this.ShapeList.push(item))
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = 'MC6X12'
                        break
                    case ('Pipe'):
                        _.forEach(Data_Pipe.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [35]
                        this.Fy = 35
                        this.Shape = 'PIPE3-1/2STD'
                        break
                    case ('HSR'):
                        _.forEach(Data_HSR.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [42]
                        this.Fy = 42
                        this.Shape = 'HSS6X.250'
                        break
                    case ('LLBB'):
                        _.forEach(Data_LLBB.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = '2L5X3-1/2X5/16LLBB'
                        break
                    case ('LU'):
                        _.forEach(Data_LU.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = 'L4X3-1/2X5/16'
                        break
                }//SWITCH

                return _.map(this.ShapeList, 'Shape')
           
            },//ITEMS
            design(){
                let inputData = {
                    method : this.method,
                    //section : _.omit(_.find(this.ShapeList, {'Shape': this.Shape}),['Shape']),
                    section : _.find(this.ShapeList, {'Shape': this.Shape}),
                    Fy : this.Fy,
                    Lu : this.Lu,
                    Lx : this.Lx,
                    Ly : this.Ly,
                    Kx : this.Kx,
                    Ky : this.Ky,
                    web : this.web,
                    Cb : this.Cb
                }
                let W = {}

                switch(this.Type){
                    case ('W'):
                        W = new SteelW(inputData)
                        break
                    case ('WT'):
                        W = new SteelWT(inputData)
                        break
                    case ('HSS'):
                        W = new SteelHSS(inputData)
                        break
                    case ('C'):
                        W = new SteelC(inputData)
                        break
                    case ('MC'):
                        W = new SteelMC(inputData) 
                        break
                    case ('Pipe'):
                        W = new SteelPipe(inputData)
                        break
                    case ('HSR'):
                        W = new SteelHSR(inputData)
                        break
                    case ('LLBB'):
                        W = new SteelLLBB(inputData)
                        break
                    case ('LU'):
                        W = new SteelLU(inputData)
                        break
                }//SWITCH

                //CAPACITIES
                this.fMnx = W.fMnx()
                this.fMny = W.fMny()
                this.fPn = W.fPn()
                this.fVnx = W.fVnx()
                this.fVny = W.fVny()
                this.fTn = W.fTn()
                this.fTrn = W.fTrn()
                //PARAMETERS
                this.flexureParams = W.flexureParams()
                this.axialParams = W.axialParams() 
                this.shearParams = W.shearParams()
                this.tensionParams = W.tensionParams()
                this.torsionParams = W.torsionParams()
            }//Design
        },//COMPUTED
        methods:{
            
        }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>

