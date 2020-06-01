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
                    <v-flex xs4 class="px-3">
                        <v-text-field label="Y0(k)" v-model.number="Y0" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Y1(k)" v-model.number="Y1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Y2(k)" v-model.number="Y2" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Y3(k)" v-model.number="Y3" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs4 class="px-3">
                        <v-text-field label="Y4(k)" v-model.number="Y4" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Y5(k)" v-model.number="Y5" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A3" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A4" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-1">
                <v-layout row wrap class="mt-3">
                    <v-flex xs4 class="px-3">
                        <v-text-field label="DL(psf)" v-model.number="A1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A2" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs4 class="px-3">
                        <v-text-field label="DL(psf)" v-model.number="A1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A2" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A3" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs4 class="px-3">
                        <v-text-field label="DL(psf)" v-model.number="A1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A2" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A3" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A4" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="tab-2">
                <v-layout row wrap class="mt-3">
                    <v-flex xs4 class="px-3">
                        <v-text-field label="DL(psf)" v-model.number="A1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A2" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A3" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A4" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs4 class="px-3">
                        <v-text-field label="DL(psf)" v-model.number="A1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A4" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex xs4 class="px-3">
                        <v-text-field label="DL(psf)" v-model.number="A1" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="DL(psf)" v-model.number="A2" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                </v-layout>
            </template>

            <template slot="graphic-1">
                <v-layout row wrap class="mt-3">
                    <v-flex>
                        Diagram
                    </v-flex>
                </v-layout>
            </template>
            <template slot="graphic-2">
                <v-layout row wrap class="mt-3">
                    <v-flex>
                        <plot-force-capacity
                            :txt="hellow"
                            :x="Y0"
                            :y="Y1"
                            :r="Y2"
                            :height=100
                            :width=400
                            :length = "length"
                            :forceCoord = "forceCoord"
                            :capacityCoord = "capacityCoord"
                        ></plot-force-capacity>
                    </v-flex>
                </v-layout>
            </template>
        </module-content>
    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import ModuleContent from '@/components/ModuleContent.vue'

    import PlotForceCapacity from '@/components/PlotForceCapacity.vue'

    import TemplateClass from '@/classes/general/clsTemplate'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ModuleContent,
                PlotForceCapacity
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                Y0 : 0,
                Y1 : 7,
                Y2 : 9,
                Y3 : -3,

                Y4 : -5,
                Y5 : 0,
                B3 : 0.25,

                C1 : 18,
                C2 : 7,
                C3 : 0.25,

                //LISTS
                parameters : [],
                messages : [],
                results :[],

                //PLOT FORCE CAPACITY
                length : 5,
                //forceCoord :[{x:0,y:0},{x:1,y:3},{x:2,y:6},{x:3,y:-6},{x:4,y:-3},{x:5,y:0}],
                forceCoord : [],
                capacityCoord : [{x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5},{x:5,y:5}]
            
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
            
        },//MOUNTED
        computed:{
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
                    {id : 2 , title : 'Diagrams'},
                    {id : 3 , title : 'Forces'},
                ]
            },
            design(){
                this.forceCoord = [{x:0,y:this.Y0},{x:1,y:this.Y1},{x:2,y:this.Y2},{x:3,y:this.Y3},{x:4,y:this.Y4},{x:5,y:this.Y5}]

                let classData = {
                    A1: this.A1,
                    A2: this.A2,
                    A3: this.A3,
                }

                let OBJ = new TemplateClass(classData)

                this.fMn = OBJ.fMn()
                this.Mu = OBJ.Mu()

                this.results = [
                    {
                        type:'Interaction', 
                        heading : 'Combined', 
                        actual1 : 20, allowable1 : 30, title1 :'Shear',
                        actual2 : 20, allowable2 : 30, title2 :'Tension',
                        tooltip:"Shear + Tension Interaction"
                    },
                    {
                        type:'Check', 
                        symbol:'&delta;', title : '',
                        subscript:'', superscript : '',
                        actual : 0.23, allowable : 0.25, decimal:2, 
                        tooltip:"Deflection Check"
                    },
                    {
                        type:'Computed', 
                        method : 'ASD',
                        symbol:'', title : 'V',
                        subscript:'n', superscript : '',
                        value : 20, decimal:2, unit :'k',
                        tooltip:"Shear Force"
                    },
                    {
                        type:'Number', 
                        symbol:'', title : 'V',
                        subscript:'n', superscript : '',
                        value : 20, decimal:2, unit :'k',
                        tooltip:"Shear Force"
                    },
                    {
                        type:'String', 
                        symbol:'', title : 'Position',
                        subscript:'n', superscript : '',
                        value : 'End', unit :'',
                        tooltip:"Governing Case"
                    },
                    {
                        type:'Percentage', 
                        symbol:'', title : 'V', 
                        subscript:'n', superscript : '',
                        actual : 20, allowable : 40,
                        tooltip:"Shear Force"
                    },
                ]

                this.parameters =[
                    _.merge({ Group : 'One' }, { List : OBJ.oneParams() }),
                    _.merge({ Group : 'Two' }, { List : OBJ.twoParams() }),
                    _.merge({ Group : 'Three' }, { List : OBJ.threeParams() }),
                ]

                this.messages = [
                   {status : this.A1 > this.A2, type : 'warning', title: 'Parameter Check', value : "A1 > A2" },
                ]
            }
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>