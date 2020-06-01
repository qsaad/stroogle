<template>
    <module-card :root="root" :title="title">
          <v-layout row wrap justify-center>
             <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="DL (plf)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (plf)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="WL (psf)" v-model.number="WL" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
             </v-flex>
             <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Species" :items="speciesItems" v-model="species" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="H (ft)" v-model.number="H" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="S (in)" v-model.number="S" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="No of Plies" :items="noPlyList" v-model="noPly" class="pa-0 ma-0"></v-combobox>
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
                                    <v-flex xs12 v-if="WL > 0">
                                        <value-interaction
                                            :heading="'INTERACTION CHECK - X'"
                                            :actual1="Pr"
                                            :allowable1="fPn"
                                            :title1 ="'Axial'"
                                            :actual2="Mrx"
                                            :allowable2="fMnx"
                                            :title2 ="'Wind'"
                                            tooltip="Interaction Check about X axis"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="P"  :actual="Pr" :allowable="fPn"  :decimal=0 unit="lb" tooltip="Axial Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12 v-if="WL > 0"> 
                                        <value-check title="M" subscript="X" :actual="Mrx" :allowable="fMnx"  :decimal=0 unit="lb-ft" tooltip="Flexure-X Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12 v-if="WL > 0"> 
                                        <value-check title="V" subscript="X" :actual="Vrx" :allowable="fMnx"  :decimal=0 unit="lb" tooltip="Shear-X Check"></value-check>
                                    </v-flex>
                                   
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
     import ValueInteraction from '@/components/ValueInteraction.vue'

    import * as WoodSawnBeam from '@/data/WoodSawnBeam' 
    import * as WoodSawnSpecies from '@/data/WoodSawnSpecies' 
    import SawnLumber from '@/classes/wood/clsSawnLumber'

    import {wood} from '@/mixins/woodMixin'
    import {simpleBeamUniformLoadDeflection} from '@/library/analysis'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueInteraction
            },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                DLF : 1,
                LLF : 1,
                DL : 200,
                LL : 200, 
                WL : 15,
                H : 10,
                S : 16,
                sizeList:[],
                size :'2x4',
                noPlyList : [1,2,3,4,5,6],
                noPly : 1,
                speciesList:[],
                species :'DFL#2',
                paramsList : ['Axial','Flexure','Shear'],
                param : 'Axial',
                axialParams :[],
                flexureParams : [],

                Mrx : '',
                Vrx : '',
                Pr : '',
                Dx : ''
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
            _.forEach(WoodSawnBeam.List,item =>{
                this.sizeList.push(item)
            }) 
            _.forEach(WoodSawnSpecies.List,item =>{
                this.speciesList.push(item)
            }) 
            
        },//MOUNTED
        computed:{
            params(){
                switch(this.param){
                    case ('Axial'):
                        return this.axialParams
                        break
                    case ('Flexure'):
                        return this.flexureParams
                        break
                    case ('Shear'):
                        return this.shearParams
                        break
                }//SWITCH
            },//PARAMS
            sizeItems(){
                return _.map(this.sizeList, 'size')
            },//ITEMS
            speciesItems(){
                return _.map(this.speciesList, 'species')
            },//ITEMS
            design(){
                //END POST AXIAL CAPACITY
                let axialData = {
                    method : this.method,
                    size : this.size,
                    noPly : this.noPly,
                    species : this.species,
                    duration : 'WL',
                    Lu : 1,
                    Lx : this.H,
                    Ly : 1,
                }

                let SL = new SawnLumber(axialData)
                this.d = SL.d
                this.fPn = SL.fPn()
                this.fMnx = SL.fMnx()
                this.fVnx = SL.fVnx()
                this.Ix = SL.Ix()
                this.E = SL.E1()
                this.axialParams = SL.axialParams()
                this.flexureParams = SL.flexureParams()
                this.shearParams = SL.shearParams()

                this.DLF = this.method == "ASD" ? 1 : 1.2
                this.LLF = this.method == "ASD" ? 1 : 1.6

                this.Pr = (this.DLF*this.DL + this.LLF*this.LL)*this.S/12
                this.Mrx = (this.LLF*this.WL*this.S/12)*this.H*this.H/8
                this.Vrx = (this.LLF*this.WL*this.S/12)*(this.H-(2*this.d/12))/2

                this.Dx = simpleBeamUniformLoadDeflection(this.WL*this.S/12,this.H,this.E,this.Ix)

                //MESSAGES
                this.messages = [
                    //{status : this.H / this.L > 2 ? true : false, type : 'warning', title: 'Aspect Ratio', value : 'H/L > 2'},
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