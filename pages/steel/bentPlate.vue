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
                    <v-flex xs5 class="px-3">
                        <v-combobox label="Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="DL(psf)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (psf)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs4 class="px-3">
                        <v-text-field label="Fv (lb)" v-model.number="Fv" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Fh (lb)" v-model.number="Fh" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs3 class="px-3">
                        <v-text-field label="ev (in)" v-model.number="ev" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="eh (in)" v-model.number="eh" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-1">
                <v-layout row wrap class="mt-3">
                    <v-flex xs6 class="px-3">
                        <v-text-field label="Lp (in)" v-model.number="Lp" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="tp (in)" v-model.number="tp" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Fy" :items="plateGradeList" v-model="plateGrade" class="pa-0 ma-0"></v-combobox>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-text-field label="ts (in)" v-model.number="ts" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="hd (in)" v-model.number="hd" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Orientation" :items="orientationList" v-model="orientation" class="pa-0 ma-0"></v-combobox>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-2">
                <v-layout row wrap class="mt-3">
                    <v-flex xs6 class="px-3">
                        <v-combobox label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="Spacing (in)" v-model.number="rebarSpacing" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="px-3">
                        <v-text-field label="cov (in)" v-model.number="cov" class="pa-0 ma-0"></v-text-field>
                        
                    </v-flex>
                </v-layout>
            </template>
        </module-content>

    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import ModuleContent from '@/components/ModuleContent.vue'

    import * as Data_W from '@/data/Data_W' 
    import Bentplate from '@/classes/steel/clsSteelBentplate'

    import {steel} from '@/mixins/steelMixin'
    import {concrete} from '@/mixins/concreteMixin'
    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
            ModuleCard, ModuleContent, 
        },//COMPONENTS
        mixins : [concrete,steel],
        data(){
            return{
                ShapeList:[],
                Shape :'W12X96',
                Fy : 50,
                Lp : 18,
                ts : 7,
                tp : 0.25,
                hd : 1.5,
                fc : 3500,
                orientationList : ["Parallel", "Perpendicular"],
                orientation : "Parallel",
                DL : 50,
                LL : 80,
                Fv : 0,
                Fh : 0,
                ev : 0,
                eh : 0,
                rebarSize : "#5",
                rebarSpacing : 12,
                rebarGrade : 60,
                cov : 0.75,
                 //DESIGN
                parameters : [],
                messages : [],
                results : []
               
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
            items(){
                return _.map(this.ShapeList, 'Shape')
            },//ITEMS
            inputs(){
                return [
                    {id : 1 , title : 'Load', url : '../images/steel/bentplate-load.svg'},
                    {id : 2 , title : 'Slab', url : '../images/steel/bentplate-slab.svg'},
                    {id : 3 , title : 'Rebar', url : '../images/steel/bentplate-rebar.svg'},
                ]
            },
            graphics(){
                return [
                    {id : 1 , title : 'Graphics'},
                ]
            },
            design(){
                let bentplateData = {
                    section : _.find(this.ShapeList, {'Shape': this.Shape}),
                    //LOAD
                    DL : this.DL,
                    LL : this.LL,
                    Fv : this.Fv,
                    Fh : this.Fh,
                    ev : this.ev,
                    eh : this.eh,
                    //PLATE
                    Lp: this.Lp,
                    tp : this.tp,
                    Fyp : this.plateGrade,
                    //SLAB
                    ts : this.ts,
                    hd : this.hd,
                    orientation : this.orientation,
                    fc : this.fc,
                    //REBAR
                    rebarSize : this.rebarSize,
                    rebarSpacing : this.rebarSpacing,
                    cov : this.cov
                }
      
                let BP = new Bentplate(bentplateData)
                
                this.results = [
                    {
                        type:'Check', 
                        symbol:'&delta;', title : '',
                        subscript:'p', superscript : '',
                        actual : BP.Dp(), allowable : 0.125, decimal:3, 
                        tooltip:"Plate Deflection"
                    },
                    {
                        type:'Check', 
                        symbol:'', title : 'M',
                        subscript:'u', superscript : '',
                        actual : BP.Mu(), allowable : BP.fMnp(), decimal:2, 
                        tooltip:"Plate Flexure"
                    },
                ]

                this.parameters = [
                    _.merge({ Group : 'Plate' }, { List : BP.plateParams() }),
                    _.merge({ Group : 'Slab' }, { List : BP.slabParams() }),
                    _.merge({ Group : 'Load' }, { List : BP.loadParams() }),
                ]

                this.messages = [
                   {status : BP.Dp() > 0.125, type : 'warning', title: 'Plate Deflection', value : "&Delta;<sub>p</sub> > 1/8" },
                ]
            },
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>