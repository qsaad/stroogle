<template>
    <module-card :root="root" :title="title">
       <v-layout row wrap justify-center>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">LOADS</p>
                        <v-text-field label="PDL (lb)" v-model.number="PDL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="PLL (lb)" v-model.number="PLL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="WLx (plf)" v-model.number="WLX" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="WLy (plf)" v-model.number="WLY" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
             </v-flex>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">SIZE</p>
                        <v-combobox label="Species" :items="speciesItems" v-model="species" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="No of Plies" :items="noPlyList" v-model.number="noPly" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">LENGTHS <sup>&#42;</sup></p>
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lu (ft)" v-model.number="Lu" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lx (ft)" v-model.number="Lx" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Ly (ft)" v-model.number="Ly" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">PARAMETERS</p>
                        <v-combobox label="Duration" :items="durationList" v-model="duration" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Temperature" :items="temperatureList" v-model="temperature" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Moisture" :items="moistureList" v-model="moisture" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
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
                                    <v-flex xs12 v-if="WLX > 0">
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
                                    <v-flex xs12 v-if="WLY > 0">
                                        <value-interaction
                                            :heading="'INTERACTION CHECK - Y'"
                                            :actual1="Pr"
                                            :allowable1="fPn"
                                            :title1 ="'Axial'"
                                            :actual2="Mry"
                                            :allowable2="fMny"
                                            :title2 ="'Wind'"
                                            tooltip="Interaction Check about Y axis"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12 md6 v-if="WLX > 0">
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="X" :value="DX"  :decimal=3 unit="in" tooltip="X Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md6 v-if="WLY > 0">
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="Y" :value="DY"  :decimal=3 unit="in" tooltip="Y Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="P"  :actual="Pr" :allowable="fPn"  :decimal=0 unit="lb" tooltip="Axial Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12 v-if="WLX > 0"> 
                                        <value-check title="M" subscript="X" :actual="Mrx" :allowable="fMnx"  :decimal=0 unit="lb-ft" tooltip="Flexure-X Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12 v-if="WLY > 0"> 
                                        <value-check title="M" subscript="Y" :actual="Mry" :allowable="fMny"  :decimal=0 unit="lb-ft" tooltip="Flexure-Y Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12 v-if="WLX > 0"> 
                                        <value-check title="V" subscript="X" :actual="Vrx" :allowable="fVnx"  :decimal=0 unit="lb" tooltip="Shear-X Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12 v-if="WLY > 0"> 
                                        <value-check title="V" subscript="Y" :actual="Vry" :allowable="fVny"  :decimal=0 unit="lb" tooltip="Shear-Y Check"></value-check>
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
          <v-layout>
              <v-flex class="caption text-xs-left teal--text">
                  &#42; For posts in wall Lx = L and Ly = 1
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

    import * as WoodSawnBeam from '@/data/WoodSawnBeam' 
    import * as WoodSawnSpecies from '@/data/WoodSawnSpecies' 
    import SawnLumber from '@/classes/wood/clsSawnLumber'

    import {wood} from '@/mixins/woodMixin'
    import {simpleBeamUniformLoadDeflection} from '@/library/analysis'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction
            },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                //LOAD
                PDL : 1000,
                PLL : 1000,
                WLX : 0,
                WLY : 0, 
                sizeList:[],
                speciesList:[],
                size :'2x6',
                species :'DFL#2',
                noPlyList : [1,2,3,4,5,6],
                noPly : 3,
                L : 12,
                Lu : 1,
                Lx : 12,
                Ly : 1,
                paramsList : ['Axial','Flexure','Shear'],
                param : 'Axial',
                axialParams :[],
                flexureParams :[],
                shearParams:[],

                Mrx : '',
                Vrx : '',
                Mry : '',
                Vry : '',
                DX : '',
                DY : '',
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
                
                //HEADER GRAVITY CAPACITY
                let postData = {
                    method : this.method,
                    size : this.size,
                    noPly : this.noPly,
                    species : this.species,
                    duration : this.duration,
                    temperature : this.temperature,
                    moisture : this.moisture,
                    Lu : this.Lu,
                    Lx : this.Lx,
                    Ly : this.Ly,
                }

                let SLP = new SawnLumber(postData)
                this.b = SLP.b
                this.d = SLP.d
                this.fPn = SLP.fPn()
                this.fMnx = SLP.fMnx()
                this.fMny = SLP.fMny()
                this.fVnx = SLP.fVnx()
                this.fVny = SLP.fVny()
                this.Ix = SLP.Ix()
                this.Iy = SLP.Iy()
                this.E = SLP.E1()
                this.axialParams = SLP.axialParams()
                this.flexureParams = SLP.flexureParams()
                this.shearParams = SLP.shearParams()

                console.log("WT : " + SLP.wt())

                this.LLF = this.method == "ASD" ? 1 : 1.6

                this.Pr = this.PDL + this.PLL
                this.Mrx = (this.LLF*this.WLX)*this.L*this.L/8
                this.Mry = (this.LLF*this.WLY)*this.L*this.L/8
                this.Vrx = (this.LLF*this.WLX)*(this.L-(2*this.d)/12)/2
                this.Vry = (this.LLF*this.WLY)*(this.L-(2**this.noPly*this.b)/12)/2

                this.DX = simpleBeamUniformLoadDeflection(this.WLX,this.L,this.E,this.Ix)
                this.DY = simpleBeamUniformLoadDeflection(this.WLY,this.L,this.E,this.Iy)
                
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