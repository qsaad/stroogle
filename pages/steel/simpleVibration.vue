<template>
    <module-card :root="root" :title="title">
       <v-layout row wrap justify-center>
           <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">LOAD</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="DL (psf)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">BEAM</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Select Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="Span (ft)" v-model.number="Lg" class="pa-0 ma-0"></v-text-field> 
                        <v-text-field label="Tributary Width (ft)" v-model.number="Sg" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
             </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">JOIST</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="w (lb/ft)" v-model.number="wTL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Span (ft)" v-model.number="Lj" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Spacing (in)" v-model.number="Sj" class="pa-0 ma-0"></v-text-field>
                        
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
                                        <value-number  title="f" subscript="n" :value="f"  :decimal=0 unit="Hz" tooltip="System Frequency"></value-number>
                                    </v-flex>
                                                
                                    <v-flex xs12>
                                        <message-list :messages="messages"></message-list>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <params-list :dataList="parameters" selectedParam ="Beam">
                        </params-list>
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
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import ParamsList from '@/components/ParamsList.vue'
    import MessageList from '@/components/MessageList.vue'

    import SteelSimpleVibration from '@/classes/steel/clsSteelSimpleVibration'
    import * as Data_W from '@/data/Data_W' 

    import {steel} from '@/mixins/steelMixin'


    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueCheck, ValueComputed, 
                ValueInteraction,
                ParamsList, MessageList
            },//COMPONENTS
        mixins : [steel],
        data(){
            return{
                ShapeList:[],
                Shape :'W24X94',
                DL: 45,
                Lg : 26,
                Sg : 38,
                Lj : 40,
                Sj : 30,
                wTL : 284,
                params : [],
                parameters : [],
                messages : []
            
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
             design(){
                 //-------------------------------------------
                 //PARAMETERS
                 //-------------------------------------------
                let beamData = {
                    section : _.omit(_.find(this.ShapeList, {'Shape': this.Shape}),['Shape']),
                    DL: this.DL,
                    Lg : this.Lg,
                    Sg : this.Sg,
                    Lj : this.Lj,
                    Sj : this.Sj, 
                    wTL : this.wTL,
                }
                //------------------------------------------
                //OBJECT
                //------------------------------------------
                let BM = new SteelSimpleVibration(beamData)

                this.f = BM.f()

                //------------------------------------------
                //PARAMETERS
                //------------------------------------------
                this.parameters = [
                    _.merge({ Group: 'Beam' }, { List: BM.beamParams() }),
                    _.merge({ Group: 'Joist' }, { List: BM.joistParams() }),
                ]
                //--------------------------------------------
                //MESSAGES
                //--------------------------------------------
                this.messages = [
                   {status : this.f < 4, type : 'error', title: 'f', value : 'f < 4'},
                   {status : this.f > 6, type : 'error', title: 'f', value : 'f > 6'},
                ]
            },//DESIGN
        
        },//COMPUTED
        methods:{

        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>