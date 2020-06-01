<template>
    <module-card :root="root" :title="title">
        {{design}}
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
                        <v-text-field label="Nu (k)" v-model.number="Nu" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="ex (in)" v-model.number="ex" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="ey (in)" v-model.number="ey" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-text-field label="Vu (k)" v-model.number="Vu" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="ev (in)" v-model.number="ev" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-1">
                <v-layout row wrap class="mt-3">
                    <v-flex xs6 class="px-3">
                        <v-text-field label="# Rows" v-model.number="NR" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="# Cols" v-model.number="NC" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Sx (in)" v-model.number="Sx" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Sy (in)" v-model.number="Sy" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-text-field label="d1 (in)" v-model.number="d1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="d2 (in)" v-model.number="d2" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="d3 (in)" v-model.number="d3" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="d4 (in)" v-model.number="d4" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-2">
                <v-layout row wrap class="mt-3">
                    <v-flex xs6 class="px-3">
                        <v-combobox label="ds (in)" :items="studSizeList" v-model="studSize" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="hef (in)" v-model.number="hef" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Cracked" :items="crackedList" v-model="cracked" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Reinforcing" :items="reinforcingList" v-model="reinforcing" class="pa-0 ma-0"></v-combobox>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h (in)" v-model.number="h" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="wc (pcf)" v-model.number="wc" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>
        </module-content>

    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import ModuleContent from '@/components/ModuleContent.vue'

    import * as studSizeList  from '@/data/STL_studSize'
    import EmbedPlate from '@/classes/concrete/clsEmbedPlate'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ModuleContent,
            
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                //LOAD
                Nu : 5,
                Vu : 7,
                ex : 0,
                ey : 0,
                ev : 1.5,
                //LAYOUT
                NR : 2,
                NC : 2,
                Sx : 4,
                Sy : 4,
                //CONCRETE
                fc : 5000,
                h : 8,
                wc : 145,
                crackedList : ['Yes','No'],
                cracked : 'Yes',
                reinforcingList : ['None',"Rebar only","Rebar and Stirrup"],
                reinforcing : 'Rebar',
                //EDGES
                d1 : 48,
                d2 : 48,
                d3 : 12,
                d4: 48,
                //STUD
                studSize : "1/2",
                ds : 0.5,
                hef : 6,
                //DESIGN
                parameters : [],
                messages : [],
                results : [],
                mode : ''
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
            this.studSizeList = _.map(studSizeList.List,"Size")
            
        },//CREATED
        mounted(){
            
        },//MOUNTED
        computed:{
            inputs(){
                return [
                    {id : 1 , title : 'Load', url : '../images/concrete/embedplate-load.svg'},
                    {id : 2 , title : 'Layout', url : '../images/concrete/embedplate-layout.svg'},
                    {id : 3 , title : 'Stud', url : '../images/concrete/embedplate-stud.svg'},
                ]
            },
            graphics(){
                return [
                    {id : 1 , title : 'Graphics'},
                ]
            },
            design(){
                let embedData = {
                    //LOAD
                    Nu : this.Nu,
                    Vu : this.Vu,
                    ex : this.ex ,
                    ey : this.ey,
                    ev : this.ev,
                    //LAYOUT
                    NR : this.NR,
                    NC : this.NC,
                    Sx: this.Sx,
                    Sy : this.Sy,
                    //CONCRETE
                    fc : this.fc,
                    h : this.h,
                    wc : this.wc,
                    cracked : this.cracked == 'Yes' ? true : false,
                    reinforcing : this.reinforcing,
                    //EDGES
                    d1 : this.d1,
                    d2 : this.d2,
                    d3 : this.d3,
                    d4: this.d4,
                    //STUD
                    studSize : this.studSize,
                    hef: this.hef,
                }//DATA
            
            let EP = new EmbedPlate(embedData)

                this.fVs = EP.fVs()
                this.fNs = EP.fNs()
                this.fNcb = EP.fNcb()
                this.fVc3 = EP.fVc3()
                this.fVc3c = EP.fVc3c()
                this.fVc1 = EP.fVc1()

                this.fNn = EP.fNn()
                this.fVn = EP.fVn()

                this.mode = EP.Mode()

                this.results = [
                     {
                        type:'Interaction', 
                        heading : 'Combined', 
                        actual1 : this.Vu, allowable1 : this.Vu, title1 :'Shear',
                        actual2 :  this.Nu, allowable2 : EP.fNn(), title2 :'Tension',
                        tooltip:"Shear + Tension Interaction"
                    },
                    {
                        type:'Check', 
                        symbol:'', title : 'Tension',
                        subscript:'', superscript : '',
                        actual : this.Nu, allowable : EP.fNn(), decimal:3, 
                        tooltip:"Tension Capacity"
                    },
                    {
                        type:'Check', 
                        symbol:'', title : 'Shear',
                        subscript:'', superscript : '',
                        actual : this.Vu, allowable : this.Vu, decimal:2, 
                        tooltip:"Shear Capacity"
                    },
                ]

                this.parameters =[
                    _.merge({ Group : 'Stud Tension' }, { List : EP.studTensionParams() }),
                    _.merge({ Group : 'Stud Shear' }, { List : EP.studShearParams() }),
                    _.merge({ Group : 'Concrete Tension Breakout' }, { List : EP.concTensionBreakoutParams() }),
                    _.merge({ Group : 'Concrete Tension Pullout' }, { List : EP.concTensionPulloutParams() }),
                    _.merge({ Group : 'Concrete Tension Blowout' }, { List : EP.concTensionBlowoutParams() }),
                    _.merge({ Group : 'Concrete Shear Front' }, { List : EP.concShearFrontParams() }),
                    _.merge({ Group : 'Concrete Shear Corner' }, { List : EP.concShearCornerParams() }),
                    _.merge({ Group : 'Concrete Shear Side' }, { List : EP.concShearSideParams() }),
                    _.merge({ Group : 'General' }, { List : EP.generalParams() })
                ]

                this.messages = [
                   {status : true, type : 'info', title: 'Failure Mode', value : this.mode },
                   {status : true, type : 'info', title: 'Tension Failure', value : EP.tensionDuctility() },
                   {status : true, type : 'info', title: 'Shear Failure', value : EP.shearDuctility() },
                   {status : this.T < 0, type : 'warning', title: 'Input', value : 'T cannot be negative'},
                   {status : this.V < 0, type : 'warning', title: 'Input', value : 'V cannot be negative'},
                ]
            },//DESIGN

        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>