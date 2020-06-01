<template>
    <module-card :root="root" :title="title">
       <v-layout row wrap justify-center>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">LOADS</p>
                        <v-text-field label="DL (plf)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (plf)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
             </v-flex>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">SIZE</p>
                        <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Grade" :items="gradeList" v-model="grade" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Species" :items="speciesItems" v-model="species" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">LENGTHS</p>
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lu (ft)" v-model.number="Lu" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lb (in)" v-model.number="Lb" class="pa-0 ma-0"></v-text-field>
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
                        <v-combobox label="Type" :items="levelList" v-model="level" class="pa-0 ma-0"></v-combobox>
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
                                    <v-flex xs12 md6>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="DL" :value="DDL"  :decimal=3 unit="in" tooltip="DL Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="LL" :value="DLL"  :decimal=3 unit="in" tooltip="LL Deflection"></value-computed>
                                    </v-flex>
                                     <v-flex xs12> 
                                        <value-check :symbol="'&Delta;'" title="" subscript="TL" :actual="DTL" :allowable="DTLa"  :decimal=3 unit="in" tooltip="TL Deflection"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check :symbol="'&Delta;'" title="" subscript="LL" :actual="DLL" :allowable="DLLa"  :decimal=3 unit="in" tooltip="LL Deflection"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="M" :actual="Mr" :allowable="fMnx"  :decimal=0 unit="lb-ft" tooltip="Flexure Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="V" :actual="Vr" :allowable="fVnx"  :decimal=0 unit="lb" tooltip="Shear Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check  title="R" :actual="Rr" :allowable="fRn"  :decimal=0 unit="lb" tooltip="Bearing Check"></value-check>
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

    import * as WoodGlulamWesternSize from '@/data/WoodGlulamWesternSize' 
    import * as WoodGlulamSpecies from '@/data/WoodGlulamSpecies' 
    import * as WoodGlulamSouthernSize from '@/data/WoodGlulamSouthernSize' 
    import * as WoodGlulamHardwoodSpecies from '@/data/WoodGlulamHardwoodSpecies'
    import Glulam from '@/classes/wood/clsGlulam'

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
                DLF : 1,
                LLF : 1,
                DL : 400,
                LL : 400, 
                gradeList : ['Hardwood','Softwood'],
                grade : 'Softwood',
                typeList : ['Western','Southern'],
                type : 'Western',
                sizeList:[],
                speciesList:[],
                size :'5-1/8 x 24',
                species :'24F-1.7E',
                levelList : ['Floor','Roof'],
                level : 'Floor',
                L : 24,
                Lu : 10,
                Lb : 5.5,
                paramsList : ['Flexure','Shear','Bearing'],
                param : 'Flexure',
                Mr : '',
                Vr : '',
                Rr : '',
                DDL : '',
                DLL : '',
                DTL : '',
            
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
             _.forEach(WoodGlulamWesternSize.List,item =>{
                this.sizeList.push(item)
            }) 
            _.forEach(WoodGlulamSpecies.List,item =>{
                this.speciesList.push(item)
            }) 
        },//MOUNTED
        computed:{
            params(){
                switch(this.param){
                    case ('Flexure'):
                        return this.flexureParams
                        break
                    case ('Shear'):
                        return this.shearParams
                        break
                    case ('Bearing'):
                        return this.bearingParams
                        break
                }//SWITCH
            },//PARAMS
            sizeItems(){
                this.sizeList = []
                switch(this.type){
                    case ('Western'):
                        _.forEach(WoodGlulamWesternSize.List,item =>this.sizeList.push(item)) 
                        this.size = '5-1/8 x 24'
                        break
                    case ('Southern'):
                        _.forEach(WoodGlulamSouthernSize.List,item =>this.sizeList.push(item)) 
                        this.size = '5-1/8 x 24-3/4'
                        break
                }
                return _.map(this.sizeList, 'size')
            },//SIZE ITEMS
            speciesItems(){
                this.speciesList = []
                switch(this.grade){
                    case ('Softwood'):
                        _.forEach(WoodGlulamSpecies.List,item =>this.speciesList.push(item)) 
                        this.species = '24F-1.7E'
                        break
                    case ('Hardwood'):
                        _.forEach(WoodGlulamHardwoodSpecies.List,item =>this.speciesList.push(item)) 
                        this.species = '14F-V3'
                        break
                }
                return _.map(this.speciesList, 'species')
            },//SPECIES ITEMS
            design(){
                
                //HEADER GRAVITY CAPACITY
                let beamData = {
                    method : this.method,
                    grade : this.grade,
                    size : this.size,
                    species : this.species,
                    duration : this.duration,
                    temperature : this.temperature,
                    moisture : this.moisture,
                    Lu : this.Lu,
                    Lx : this.L,
                    Ly : 1,
                    bearing : this.Lb,
                    type : this.type,
                    grade : this.grade
                }

                let GL = new Glulam(beamData)
                this.b = GL.b
                this.d = GL.d
                this.fMnx = GL.fMnx()
                this.fVnx = GL.fVnx()
                this.fRn = GL.fRn()*this.b
                this.Ix = GL.Ix()
                this.E = GL.E1()

                //PARAMETERS
                this.flexureParams = GL.flexureParams()
                this.shearParams = GL.shearParams() 
                this.bearingParams = GL.bearingParams()

                this.DLF = this.method == "ASD" ? 1 : 1.2
                this.LLF = this.method == "ASD" ? 1 : 1.6
               
                this.Mr = (this.DLF*this.DL + this.LLF*this.LL)*this.L*this.L/8
                this.Vr = (this.DLF*this.DL + this.LLF*this.LL)*(this.L-(2*this.d)/12)/2
                
                this.Rr = (this.DLF*this.DL + this.LLF*this.LL)*this.L/2

                this.DDL = simpleBeamUniformLoadDeflection(this.DL,this.L,this.E,this.Ix)
                this.DLL = simpleBeamUniformLoadDeflection(this.LL,this.L,this.E,this.Ix)
                this.DTL = this.DDL + this.DLL

                this.DLLa = this.level == 'Floor' ? this.L*12/360 : this.L*12/240
                this.DTLa = this.level == 'Floor' ? this.L*12/240 : this.L*12/180

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