<template>
    <module-card :root="root" :title="title">
        
        <module-content
            :inputList = "inputs"
            :graphicList = "graphics"
            :resultList = "results"
            :messageList = "messages"
            :parameterList = "parameters"
        >
            <template slot="tab-0">
                <v-layout row wrap class="mt-3">
                    <v-flex xs6 class="px-3">
                        <v-text-field label="P(k)" v-model.number="Pr" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="M (k-ft)" v-model.number="Mr" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="V (k)" v-model.number="Vr" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Axis" :items="axisList" v-model="axis" class="pa-0 ma-0"></v-combobox>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-1">
                <v-layout row wrap class="mt-3">
                    <v-flex xs6 class="px-3">
                        <v-text-field label="Np (in)" v-model.number="NP" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Bp (in)" v-model.number="BP" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Fy (ksi)" :items="FybList" v-model="Fyp" class="pa-0 ma-0"></v-combobox>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-text-field label="Nc (in)" v-model.number="NC" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Bc (in) " v-model.number="BC" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="fc (psi) " v-model.number="fc" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-2">
                <v-layout row wrap class="mt-3">
                    <v-flex xs6 class="px-3">
                        <v-combobox label="db (in)" :items="anchorSizeList" v-model="anchorSize" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="de (in) " v-model.number="de" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-text-field label="Qty Each End " v-model.number="Nb" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Fyb (ksi)" :items="anchorGradeList" v-model="anchorGrade" class="pa-0 ma-0"></v-combobox>
                    </v-flex>
                </v-layout>
            </template>
        </module-content>

        {{design}}



    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import ModuleContent from '@/components/ModuleContent.vue'

    import * as Data_W from '@/data/Data_W' 
    import * as Data_HSS from '@/data/Data_HSS'
    import * as Data_Pipe from '@/data/Data_Pipe'
    import * as Data_HSR from '@/data/Data_HSR'

    import SteelW from '@/classes/steel/clsSteelW'
    import SteelHSS from '@/classes/steel/clsSteelHSS'
    import SteelPipe from '@/classes/steel/clsSteelPipe'
    import SteelHSR from '@/classes/steel/clsSteelHSR'

    import Baseplate from '@/classes/steel/clsBaseplate'

    import {steel} from '@/mixins/steelMixin'

    //import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ModuleContent,
            },//COMPONENTS
        mixins : [steel],
        data(){
            return{
                //LOAD
                Pr : 260,
                Vr : 0,
                Mr : 208.33,
                //COLUMN SECTION
                typeList : ['W','HSS','Pipe','HSR'],
                type : 'W',
                ShapeList:[],
                Shape :'W12X96',
                Fy : 50,
                //BASE PLATE
                NP : 22,
                BP : 22,
                FypList : [36,50],
                Fyp : 36,
                //ANCHOR ROD
                Nb : 2,
                de : 1.5,
                FybList : [36,50],
                Fyb : 36,
                //CONCRETE PIER
                NC : 22,
                BC : 22,
                fc : 4000,
                //DESIGN
                parameters : [],
                messages : [],
                results : [],
            
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
            inputs(){
                return [
                    {id : 1 , title : 'Load', url : '../images/concrete/embedplate-load.svg'},
                    {id : 2 , title : 'Plate', url : '../images/concrete/embedplate-layout.svg'},
                    {id : 3 , title : 'Anchor', url : '../images/concrete/embedplate-stud.svg'},
                ]
            },
            graphics(){
                return [
                    {id : 1 , title : 'Graphics'},
                ]
            },
            items(){
                this.ShapeList = []
                this.FyList = []
                switch(this.type){
                    case ('W'):
                        _.forEach(Data_W.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 50
                        this.Shape = "W12X96"
                        break
                    case ('HSS'):
                        _.forEach(Data_HSS.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 46
                        this.Shape = "HSS6X6X3/8"
                        break
                    case ('Pipe'):
                        _.forEach(Data_Pipe.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 35
                        this.Shape = "PIPE3STD"
                        break
                    case ('HSR'):
                        _.forEach(Data_HSR.ShapeList,item =>this.ShapeList.push(item)) 
                        this.Fy = 42
                        this.Shape = "HSS6X.250"
                        break
                }
                return _.map(this.ShapeList, 'Shape')
            },//ITEMS
            design(){
                //BASEPLATE
                let baseplateData = {
                    //LOAD
                    Pr : this.Pr,
                    Vr : this.Vr,
                    Mr : this.Mr,
                    method : this.method,
                    //SECTION
                    type : this.type,
                    section : _.find(this.ShapeList, {'Shape': this.Shape}),
                    Fy : this.Fy,
                    axis : this.axis,
                    //PLATE
                    NP : this.NP,
                    BP : this.BP,
                    Fyp : this.Fyp,
                    //ANCHOR
                    anchorSize : this.anchorSize,
                    Nb : this.Nb,
                    de : this.de,
                    anchorGrade : _.filter(this.anchorGradeData,{'Grade' : this.anchorGrade}),
                    //PIER
                    NC : this.NC,
                    BC : this.BC,
                    fc : this.fc,
                }

                let BP = new Baseplate(baseplateData)
                //RESULTS
                this.results = [
                    {
                        type:'Interaction', 
                        heading : 'Combined', 
                        actual1 : this.Tr, allowable1 : BP.fTn(), title1 :'Tension',
                        actual2 :  this.Vr, allowable2 : BP.fVn(), title2 :'Shear',
                        tooltip:"Shear + Tension Interaction"
                    },
                    {
                        type:'Check', 
                        symbol:'', title : 'Pressure',
                        subscript:'', superscript : '',
                        actual : BP.fp(), allowable : BP.fpmax(), decimal:2, 
                        tooltip:"Pressure Check"
                    },
                     {
                        type:'Number', 
                        symbol:'', title : 't',
                        subscript:'p', superscript : '',
                        value : BP.tp(), decimal:2, unit :'in',
                        tooltip:"Plate thickness"
                    },
                ]
                //PARAMETERS
                this.parameters =[
                    _.merge({ Group : 'Base plate' }, { List : BP.baseplateParams() }),
                    _.merge({ Group : 'Anchor' }, { List : BP.anchorParams() }),
                    _.merge({ Group : 'Pier' }, { List : BP.pierParams() }),
                ]
               
                //MESSAGES
                this.messages = [
                    {status : BP.Y() == 0, type : 'error', title: 'Plate Size', value : 'Inadequate'},
                    {status : BP.e() > BP.ec(), type : 'info', title: 'Eccentricity', value : 'e > e<sub>c</sub>'},
                    {status : BP.e() < BP.ec(), type : 'info', title: 'Eccentricity', value : 'e < e<sub>c</sub>'},
                    {status : BP.Y() > BP.Yp(), type : 'info', title: 'Contact Length', value : 'Y > m'},
                    {status : BP.Y() < BP.Yp(), type : 'info', title: 'Contact Length', value : 'Y < m'},
                ]

            },//DESIGN
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>