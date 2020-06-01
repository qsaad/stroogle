<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="V (lbs)" v-model.number="V" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="H (ft)" v-model.number="H" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Type" :items="loadList" v-model="load" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Post Species" :items="speciesItems" v-model="species" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Post Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="No of Plies" :items="noPlyList" v-model.number="noPly" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Sill Species" :items="speciesItems" v-model="speciesSill" class="pa-0 ma-0"></v-combobox>
                       
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Panel" :items="panelItems" v-model="panel" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Nail Spacing (in)" :items="nailSpacingList" v-model="nailSpacing" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Holdown" :items="holdownItems" v-model="holdown" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Holdown" :items="studFastenerItems" v-model="studFastener" class="pa-0 ma-0"></v-combobox>
                        
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
                                    <!-- <v-flex>{{postSize()}}</v-flex>
                                    <v-flex>{{holdownCapacity()}}</v-flex>
                                    <v-flex>{{minPostSize()}}</v-flex> -->
                                    <!-- <v-flex xs6> 
                                        <value-number :method="method" title="V" subscript="n" superscript="''" :value="fVn"  :decimal=0 unit="plf" tooltip="Sheathing Shear Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="P" subscript="n" superscript="''" :value="fPn"  :decimal=0 unit="lb" tooltip="End Post Axial Capacity"></value-number>
                                    </v-flex> -->
                                    <v-flex xs12> 
                                        <value-check title="Sheathing, Vr" :actual="Vr" :allowable="fVn"  :decimal=0 unit="plf" tooltip="Sheathing Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="End Post, Pr" :actual="Pr" :allowable="fPn"  :decimal=0 unit="lb" tooltip="End Post Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="Bearing, Rr" :actual="Pr" :allowable="fRn"  :decimal=0 unit="lb" tooltip="Sill Bearing Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="Holdown, Tr" :actual="Tr" :allowable="holdownCapacity()"  :decimal=0 unit="lb" tooltip="Sill Bearing Check"></value-check>
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
                                        <v-combobox label="Parameters" :items="paramsList" v-model="param" class="pa-0 ma-0"></v-combobox>
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

    import {wood} from '@/mixins/woodMixin'

    import Shearwall from '@/classes/wood/clsShearwall'
    import * as ShearwallWind from '@/data/wood/ShearwallWind'
    import * as ShearwallSeismic from '@/data/wood/ShearwallSeismic'

    import * as WoodSawnBeam from '@/data/WoodSawnBeam' 
    import * as WoodSawnSpecies from '@/data/WoodSawnSpecies' 
    import SawnLumber from '@/classes/wood/clsSawnLumber'

    import * as HoldownData from '@/data/wood/SimpsonHoldown' 

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck
            },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                V : 5000,
                L : 12,
                H : 10,
                holdownList : [],
                holdown : 'HD5B',
                studFastenerList :  [],
                studFastener : '',
                sizeList :[],
                size :'2x4',
                noPlyList : [1,2,3,4,5,6],
                noPly : 1,
                speciesList : [],
                species :'DFL#2',
                speciesSill :'DFL#2',
                loadList :['Wind', 'Seismic'],
                load : 'Wind',
                panelList :[],
                panel : '15/32 Sheathing w/ 10d Common Nails',
                nailSpacingList : ['6','4','3','2'],
                nailSpacing : '6',
                paramsList : ['Axial','Bearing','Shear Wall'],
                param : 'Axial',
                axialParams : [],
                bearingParams : [],
                shearwallParams : [],
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
            _.forEach(ShearwallWind.List,item =>{
                this.panelList.push(item)
            }) 
            _.forEach(WoodSawnBeam.List,item =>{
                this.sizeList.push(item)
            }) 
            _.forEach(WoodSawnSpecies.List,item =>{
                this.speciesList.push(item)
            }) 
            _.forEach(HoldownData.List,item =>{
                this.holdownList.push(item)
            }) 
        },//MOUNTED
        computed:{
            params(){
                switch(this.param){
                    case ('Axial'):
                        return this.axialParams
                        break
                    case ('Bearing'):
                        return this.bearingParams
                        break
                    case ('Shear Wall'):
                        return this.shearwallParams
                        break
                }//SWITCH
            },//PARAMS
            panelItems(){
                this.panelList = []
                switch(this.load){
                    case ('Wind'):
                        _.forEach(ShearwallWind.List,item =>this.panelList.push(item)) 
                        this.panel = '15/32 Sheathing w/ 10d Common Nails'
                        break
                    case ('Seismic'):
                        _.forEach(ShearwallSeismic.List,item =>this.panelList.push(item)) 
                        this.panel = '15/32 Sheathing w/ 10d Common Nails'
                        break
                }//SWITCH
                return _.map(this.panelList, 'Panel')
            },//ITEMS
            sizeItems(){
                return _.map(this.sizeList, 'size')
            },//ITEMS
            speciesItems(){
                return _.map(this.speciesList, 'species')
            },//ITEMS
            holdownItems(){
                let arr = _.map(_.filter(this.holdownList,{'size' : this.holdown}),'stud_fastener')
                this.studFastener = arr[0]
                return _.map(this.holdownList, 'size')
            },//ITEMS
            studFastenerItems(){
                return _.map(_.filter(this.holdownList,{'size' : this.holdown}),'stud_fastener')
            },
            
            
            design(){
                //let postSize = _.find(WoodSawnBeam.List, {'size': this.size})

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
                this.b = SL.b 
		        this.d = SL.d
                this.fPn = SL.fPn()
                this.axialParams = SL.axialParams()

                //SILL BEARING CAPACITY
                let bearingData = {
                    method : this.method,
                    size : this.size,
                    noPly : this.noPly,
                    species : this.speciesSill,
                    duration : 'WL',
                    Lu : 1,
                    Lx : this.H,
                    Ly : 1,
                    bearing : this.noPly*this.b
                }

                let SLB = new SawnLumber(bearingData)
                this.fRn = SLB.fRn()*this.d
                this.bearingParams = SL.bearingParams()

                //SHEATHING SHEAR CAPACITY
                let inputData = {
                        method : this.method,
                        load : this.load,
                        panel : this.panel,
                        nailSpacing : this.nailSpacing,
                }

                let SW = new Shearwall(inputData)
                this.shearwallParams = SW.params()
                this.fVn = SW.shearCapacity()

                //SHEAR STRESS
                this.Vr = this.V/this.L
                //END POST TENSION/COMPRESSION
                this.Pr = this.V*this.H/(this.L-(this.b*this.noPly)/12)
                //HOLDOWN FORCE
                this.Tr = this.V*this.H/(this.L-(this.b*this.noPly + 1)/12)
                
                this.fTn = this.holdownCapacity()

                //MESSAGES
                this.messages = [
                    {status : this.H / this.L > 2 ? true : false, type : 'warning', title: 'Aspect Ratio', value : 'H/L > 2'},
                    {status : this.fTn <= 0 ? true : false, type : 'warning', title: 'Min Post Size', value : this.minPostSize()},
                ]
            }//DESIGN
        
        },//COMPUTED
        methods:{
            minPostSize(){
                return   _.head(_.map(_.filter(this.holdownList,{'size' : this.holdown}),(item) =>{
                    return item.post_size
                }))
            },
            holdownCapacity(){
                let T =   _.map(_.filter(this.holdownList,{'size' : this.holdown}),(item) =>{
                    let actualPost = this.postSize()
                    let requiredPost = item.post_size

                    if(actualPost.localeCompare(requiredPost) >= 0){
                        return item.T
                    }
                    else{
                        return 0
                    }
                })
                return _.max(T) 
            },
            postSize(){
                let arr = _.split(this.size, 'x',2)
                let k1 = _.toString(_.toNumber(arr[0])*this.noPly)
                let k2 = arr[1]
                return _.toString(k1 + 'x' + k2)
            },
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>