<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="DL (k/ft)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (k/ft)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="WL (k/ft)" v-model.number="WL" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
             </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Select Type" :items="TypeList" v-model="Type" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Select Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" :items="FyList" v-model="Fy" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Type" :items="LevelList" v-model="Level" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Web" :items="WebList" v-model="Web" v-if="Type == 'WT'"></v-combobox>
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
                                    <v-flex xs12 md4>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="DL" :value="DDL"  :decimal=3 unit="in" tooltip="DL Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="LL" :value="DLL"  :decimal=3 unit="in" tooltip="LL Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="WL" :value="DWL"  :decimal=3 unit="in" tooltip="WL Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-interaction
                                            :heading="'FLEXURE CHECK'"
                                            :actual1="Mrx"
                                            :allowable1="fMnx"
                                            :title1 ="'Gravity'"
                                            :actual2="Mry"
                                            :allowable2="fMny"
                                            :title2 ="'Wind'"
                                            tooltip="Flexure Interaction Check"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-interaction
                                            :heading="'SHEAR CHECK'"
                                            :actual1="Vrx"
                                            :allowable1="fVnx"
                                            :title1 ="'Gravity'"
                                            :actual2="Vry"
                                            :allowable2="fVny"
                                            :title2 ="'Wind'"
                                            tooltip="Shear Interaction Check"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                     <v-flex xs12> 
                                        <value-check :symbol="'&Delta;'" title="" subscript="TL" :actual="DTL" :allowable="DTLa"  :decimal=3 unit="in" tooltip="TL Deflection"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check :symbol="'&Delta;'" title="" subscript="LL" :actual="DLL" :allowable="DLLa"  :decimal=3 unit="in" tooltip="LL Deflection"></value-check>
                                    </v-flex>
                                    <!-- <v-flex xs12> 
                                        <value-check title="M" :actual="Mr" :allowable="fMnx"  :decimal=0 unit="lb-ft" tooltip="Flexure Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="V" :actual="Vr" :allowable="fVnx"  :decimal=0 unit="lb" tooltip="Shear Check"></value-check>
                                    </v-flex> -->
                                    <v-flex xs12>
                                        <v-layout row wrap justify-center>
                                            <v-flex xs12 v-for="(item,key) in messages" :key="key">
                                                <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
                                            </v-flex>
                                        </v-layout>
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
                                        <v-combobox label="Parameter" :items="paramsList" v-model="param" class="pa-0 ma-0"></v-combobox>
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
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

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

    import _ from 'lodash'

    import {steel} from '@/mixins/steelMixin'
    import {simpleBeamUniformLoadDeflection} from '@/library/analysis'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction
            },//COMPONENTS
        mixins : [steel],
        data(){
            return{
                TypeList : ['W','WT','HSS','C','MC','Pipe','HSR','LLBB','LU'],
                Type : 'W',
                ShapeList:[],
                Shape :'W16X26',
                FyList : [36,50],
                Fy : 50,
                WebList :['Tension','Compression'],
                Web : 'Tension',
                LevelList : ['Floor','Roof'],
                Level : 'Floor',
                paramsList : ['Property','Flexure','Shear'],
                param : 'Flexure',
                propParams : [],
                flexureParams : [],
                shearParams : [],
                DL : 1,
                LL : 1,
                WL : 0.15,
                L : 8,
                Cb : 1,
                E : 29000,
                Ix : 0,
                Iy : 0,
                fMnx : 0,
                fMny : 0,
                fVnx : 0,
                fVny : 0,
                DLF : 1,
                LLF : 1,
                Mrx : 0,
                Mry : 0,
                Vrx : 0,
                Vry : 0,
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
            params(){
                switch(this.param){
                    case ('Property'):
                        return this.propParams
                        break
                    case ('Flexure'):
                        return this.flexureParams
                        break
                    case ('Shear'):
                        return this.shearParams
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
                        this.Shape = "W16X26"
                        break
                    case ('WT'):
                        _.forEach(Data_WT.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 50
                        this.Shape = "WT6X25"
                        break
                    case ('HSS'):
                        _.forEach(Data_HSS.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [46]
                        this.Fy = 46
                        this.Shape = "HSS6X6X3/8"
                        break
                    case ('C'):
                        _.forEach(Data_C.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = "C10X15.3"
                        break
                    case ('MC'):
                        _.forEach(Data_MC.ShapeList,item =>this.ShapeList.push(item))
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = "MC6X16.3" 
                        break
                    case ('Pipe'):
                        _.forEach(Data_Pipe.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [35]
                        this.Fy = 35
                        this.Shape = "PIPE3STD"
                        break
                    case ('HSR'):
                        _.forEach(Data_HSR.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [42]
                        this.Fy = 42
                        this.Shape = "HSS6X.250"
                        break
                    case ('LLBB'):
                        _.forEach(Data_LLBB.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = "2L5X3-1/2X5/16LLBB"
                        break
                    case ('LU'):
                        _.forEach(Data_LU.ShapeList,item =>this.ShapeList.push(item)) 
                        this.FyList = [36,50]
                        this.Fy = 36
                        this.Shape = "L5X3-1/2X5/16"
                        break

                }

                return _.map(this.ShapeList, 'Shape')
            },//ITEMS
            properties(){
                return _.omit(_.find(this.ShapeList, {'Shape': this.Shape}),['Shape'])
            },//PROPERTIES
            design(){
                
                //HEADER GRAVITY CAPACITY
                let beamData = {
                    method : this.method,
                    section : _.find(this.ShapeList, {'Shape': this.Shape}),
                    Fy : this.Fy,
                    Lu : this.L,
                    web : this.web,
                    Cb : this.Cb
                }

                let W = {}

                switch(this.Type){
                    case ('W'):
                        W = new SteelW(beamData)
                        break
                    case ('WT'):
                        W = new SteelWT(beamData)
                        break
                    case ('HSS'):
                        W = new SteelHSS(beamData)
                        break
                    case ('C'):
                        W = new SteelC(beamData)
                        break
                    case ('MC'):
                        W = new SteelMC(beamData) 
                        break
                    case ('Pipe'):
                        W = new SteelPipe(beamData)
                        break
                    case ('HSR'):
                        W = new SteelHSR(beamData)
                        break
                    case ('LLBB'):
                        W = new SteelLLBB(beamData)
                        break
                    case ('LU'):
                        W = new SteelLU(beamData)
                        break
                }//SWITCH
               //CAPACITIES
                this.fMnx = W.fMnx()
                this.fMny = W.fMny()
                this.fVnx = W.fVnx()
                this.fVny = W.fVny()

                //PARAMETERS
                this.propParams = W.propParams()
                this.flexureParams = W.flexureParams()
                this.shearParams = W.shearParams()

                this.DLF = this.method == "ASD" ? 1 : 1.2
                this.LLF = this.method == "ASD" ? 1 : 1.6
               
                this.Mrx = (this.DLF*this.DL + this.LLF*this.LL)*this.L*this.L/8
                this.Vrx = (this.DLF*this.DL + this.LLF*this.LL)*this.L/2

                this.Mry = (this.LLF*this.WL)*this.L*this.L/8
                this.Vry = (this.LLF*this.WL)*this.L/2
                
                this.DDL = simpleBeamUniformLoadDeflection({w:this.DL, L:this.L, E:this.E, I: W.IX})
                this.DLL = simpleBeamUniformLoadDeflection({w:this.LL, L:this.L, E:this.E, I: W.IX})
                this.DTL = this.DDL + this.DLL
                this.DWL = simpleBeamUniformLoadDeflection({w:this.WL, L:this.L, E:this.E, I: W.IY})

                this.DLLa = this.Level == 'Floor' ? this.L*12/360 : this.L*12/240
                this.DTLa = this.Level == 'Floor' ? this.L*12/240 : this.L*12/180

                //MESSAGES
                this.messages = [
                    {status : this.Lu > this.L ? true : false, type : 'warning', title: 'Check Lu', value : 'Lu > L Not Good'},
                    //{status : S.p() < 10 * S.D ? true : false, type : 'warning', title: 'Partial Penetration', value : 'p < 10D'},
                ]
            }//DESIGN
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>