<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" :items="rebarGradeList" v-model.number="rebarGrade" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Location" :items="locationList" v-model.number="location" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Coating" :items="coatingList" v-model.number="coating" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Type" :items="concreteTypeList" v-model.number="concreteType" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Cover (in)" v-model.number="cov" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Spacing (in)" v-model.number="spa" class="pa-0 ma-0"></v-text-field>
                       
                    </v-card-text>
                </v-card>
            </v-flex>
           
          {{calculate}}
        
             <v-flex xs12>
                <v-tabs fixed-tabs>
                    <v-tab ripple>Capacities</v-tab>
                    <v-tab ripple>Parameters</v-tab>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <value-number
                                            title ="L"
                                            subscript="d"
                                            :value="Ld"
                                            decimal="2"
                                            unit="in"
                                            tooltip="Tension Development Length"
                                        >
                                        </value-number>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-number
                                            title ="L"
                                            subscript="dh"
                                            :value="Ldh"
                                            decimal="2"
                                            unit="in"
                                            tooltip="Tension Development Length with Standard Hook"
                                        >
                                        </value-number>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-number
                                            title ="L"
                                            subscript="dc"
                                            :value="Ldc"
                                            decimal="2"
                                            unit="in"
                                            tooltip="Compression Development Length"
                                        >
                                        </value-number>
                                    </v-flex>
                                    <v-flex xs12>
                                        <message-list :messages="messages"></message-list>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <params-list :dataList="parameters" selectedParam ="Rebar">
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
    import ValueMessage from '@/components/ValueMessage.vue'
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import ParamsList from '@/components/ParamsList.vue'
    import MessageList from '@/components/MessageList.vue'

    import DevelopmentLength from '@/classes/concrete/clsDevelopmentLength'
    import {concrete} from '@/mixins/concreteMixin'


    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction,
                ParamsList, MessageList
            },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                cov:1.5,
                spa:12,
                Ld : 0,
                Ldc : 0,
                Ldh : 0,
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
            
        },//MOUNTED
        computed:{
            calculate(){
                //console.log(this.thickness)
                let inputData = {
                    rebarSize : this.rebarSize,
                    Fy : this.rebarGrade,
                    fc : this.fc,
                    Fy : this.rebarGrade,
                    location: this.location,
                    coating: this.coating,
                    concreteType: this.concreteType,
                    cov : this.cov,
                    spa : this.spa
                }
                let DL = new DevelopmentLength(inputData)
                this.Ld = DL.Ld()
                this.Ldc = DL.Ldc()
                this.Ldh = DL.Ldh()
               
                this.params = DL.params()

                this.parameters =[
                    _.merge({ Group: 'Rebar' }, { List: DL.rebarParams() }),
                  
                ]
               
                this.messages = [
                   {status : this.cov < 0.75 , type : 'warning', title: 'Input', value : 'Cover cannot be < 3/4'},
                  
                ]
        
                
            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>