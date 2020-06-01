<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">LOADS</p>
                        <v-text-field label="DL (plf)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (plf)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="WL (psf)" v-model.number="WL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="P (lbs)" v-model.number="P" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
             </v-flex>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">HEADER</p>
                        <v-combobox label="Header Species" :items="speciesItems" v-model="speciesBeam" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Header Size" :items="sizeItems" v-model="sizeBeam" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="No of Plies" :items="noPlyList" v-model.number="noPly" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">POST</p>
                        <v-combobox label="Post Species" :items="speciesItems" v-model="speciesPost" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Post Size" :items="sizeItems" v-model="sizePost" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="# Full Post" :items="noPlyList" v-model.number="noFP" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="# Brg Post" :items="noPlyList" v-model.number="noBP" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Sill Species" :items="speciesItems" v-model="speciesSill" class="pa-0 ma-0"></v-combobox>
                        
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">WALL OPG</p>
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="H (ft)" v-model.number="H" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Ho (ft)" v-model.number="Ho" class="pa-0 ma-0"></v-text-field>
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
                                    <v-flex xs12>
                                        <value-interaction
                                            :heading="'HEADER CHECK'"
                                            :actual1="Mrxb"
                                            :allowable1="fMnxb"
                                            :title1 ="'Gravity'"
                                            :actual2="Mryb"
                                            :allowable2="fMnyb"
                                            :title2 ="'Wind'"
                                            tooltip="Header Interaction Check"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-interaction
                                            :heading="'POST CHECK'"
                                            :actual1="Prp"
                                            :allowable1="fPnp"
                                            :title1 ="'Axial'"
                                            :actual2="Mrxp"
                                            :allowable2="fMnxp"
                                            :title2 ="'Wind'"
                                            tooltip="Post Interaction Check"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="b" :value="Db"  :decimal=3 unit="in" tooltip="Header Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="p" :value="Dp"  :decimal=3 unit="in" tooltip="Post Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="Header Bearing" :actual="Rb" :allowable="fRnb"  :decimal=0 unit="" tooltip="Header Bearing Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="Post Bearing" :actual="Prp" :allowable="fRnp"  :decimal=0 unit="" tooltip="Post Bearing Check"></value-check>
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
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import * as WoodSawnBeam from '@/data/WoodSawnBeam' 
    import * as WoodSawnSpecies from '@/data/WoodSawnSpecies' 
    import SawnLumber from '@/classes/wood/clsSawnLumber'

    import {wood} from '@/mixins/woodMixin'
    import {simpleBeamUniformLoadDeflection,simpleBeamPointLoadDeflection} from '@/library/analysis'

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
                DLF : 1,
                LLF : 1,
                DL : 200,
                LL : 200, 
                WL : 15,
                P : 0,
            
                sizeList:[],
                speciesList:[],
                //HEADER
                
                sizeBeam :'2x6',
                speciesBeam :'DFL#2',
                noPlyList : [1,2,3,4,5,6],
                noPly : 3,
                L : 6,
                //POST
                sizePost :'2x6',
                speciesPost :'DFL#2',
                speciesSill :'DFL#2',
                noFP : 2,
                noBP : 1,
                H : 10,
                Ho : 7,
                Hs : 3,

                //DESIGN
                paramsList : ['Header Gravity','Header Wind','Post Flexure', 'Post Axial'],
                param : 'Header Gravity',
                postFlexureParams :[],
                postAxialParams :[],
                beamParams : [],
                //REQUIRED STRENGTH
                Mrxb : '',
                Mryb : '',
                PrP : '',
                Mrxp : '',
                Rb : '',
                Rp : '',
                //MEMBER CAPACITY
                fMnxb : '',
                fMnyb : '',
                fPnp : '',
                fMnxp : '',
                //INTEACTION CHECK
                headerBearing : '',
                postBearing : '',
                Ixb : 0,
                Eb : 0,
                Ixp : 0,
                Ep : 0,
                Db : 0,
                Dp : 0
            
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
                    case ('Header Gravity'):
                        return this.beamGravityParams
                        break
                    case ('Header Wind'):
                        return this.beamWindParams
                        break
                    case ('Post Flexure'):
                        return this.postFlexureParams
                        break
                    case ('Post Axial'):
                        return this.postAxialParams
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
                let postSize = _.find(WoodSawnBeam.List, {'size': this.sizePost})
               
                
                //HEADER GRAVITY CAPACITY
                let beamGravityData = {
                    method : this.method,
                    size : this.sizeBeam,
                    noPly : this.noPly,
                    species : this.speciesBeam,
                    duration : 'LL',
                    Lu : this.L,
                    Lx : 1,
                    Ly : this.L,
                    bearing : this.noBP*postSize.b
                }

                let SLBX = new SawnLumber(beamGravityData)
                this.fMnxb = SLBX.fMnx()
                this.fRnb = SLBX.fRn()*postSize.d
                this.Ixb = SLBX.Ix()
                this.Eb = SLBX.E1()
                this.beamGravityParams = {...SLBX.flexureParams(),...SLBX.bearingParams()}

                //HEADER WIND CAPACITY
                let beamWindData = {
                    method : this.method,
                    size : this.sizeBeam,
                    noPly : this.noPly,
                    species : this.speciesBeam,
                    duration : 'WL',
                    Lu : this.L,
                    Lx : 1,
                    Ly : this.L,
                }

                let SLBY = new SawnLumber(beamWindData)
                this.fMnyb = SLBY.fMny()
                this.beamWindParams = SLBY.flexureParams()

                //POST AXIAL CAPACITY
                let postAxialData = {
                    method : this.method,
                    size : this.sizePost,
                    noPly : this.noFP + this.noBP,
                    species : this.speciesPost,
                    duration : 'LL',
                    Lu : 1,
                    Lx : this.H,
                    Ly : 1,
                }

                let SLPA = new SawnLumber(postAxialData)
                this.fPnp = SLPA.fPn()
                this.postAxialParams = SLPA.axialParams()

                //SILL BEARING CAPACITY
                let sillBearingData = {
                    method : this.method,
                    size : this.sizePost,
                    noPly : this.noFP + this.noBP,
                    species : this.speciesSill,
                    duration : 'LL',
                    Lu : 1,
                    Lx : this.H,
                    Ly : 1,
                    bearing : (this.noFP + this.noBP)*postSize.b
                }

                let SLSB = new SawnLumber(sillBearingData)
                this.fRnp = SLSB.fRn()*postSize.d

                //POST FLEXURE CAPACITY
                let postFlexureData = {
                    method : this.method,
                    size : this.sizePost,
                    noPly : this.noFP,
                    species : this.speciesPost,
                    duration : 'WL',
                    Lu : 1,
                    Lx : this.H,
                    Ly : 1,
                }

                let SLPF = new SawnLumber(postFlexureData)
                this.fMnxp = SLPF.fMnx()
                this.Ixp = SLPF.Ix()
                this.Ep = SLPF.E1()
                this.postFlexureParams = SLPF.flexureParams()

                this.DLF = this.method == "ASD" ? 1 : 1.2
                this.LLF = this.method == "ASD" ? 1 : 1.6
                let a = this.Ho
                let b = this.H - this.Ho

                this.Mrxb = (this.DLF*this.DL + this.LLF*this.LL)*this.L*this.L/8
                this.Mryb = (this.LLF*this.WL*(a/2 + b/2))*this.L*this.L/8
                this.Rb = (this.DLF*this.DL + this.LLF*this.LL)*this.L/2

                this.Prp = (this.DLF*this.DL + this.LLF*this.LL)*this.L/2 + this.P
                this.Rp = (this.LLF*this.WL*(a/2 + b/2))*this.L/2 
                this.Mrxp = this.Rp*this.H/4
                //this.Mrxp = this.Rp*a*b/this.H

                this.headerBearing = this.Rb/this.fRnb
                this.postBearing = this.Rp/this.fRnp

                //this.Db = ((5*(this.DL + this.LL)*Math.pow(this.L,4)*1728)/(384*this.Eb*this.Ixb)).toFixed(3)
                let w = (this.DL + this.LL)
                this.Db = simpleBeamUniformLoadDeflection({w:w,L:this.L,E:this.Eb,I:this.Ixb})

                this.Dp = simpleBeamPointLoadDeflection({P:this.Rp,L:this.H,a:a,b:b,E:this.Ep,I:this.Ixp})
                //this.Dp = (this.Rp*a*b*(a+2*b)*Math.pow((3*a*(a+2*b)),0.5)*1728)/(27*this.Ep*this.Ixp*this.H)

                //MESSAGES
                this.messages = [
                    {status : this.Ho > this.H ? true : false, type : 'warning', title: 'Opg Height', value : 'Ho > H Not Good'},
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