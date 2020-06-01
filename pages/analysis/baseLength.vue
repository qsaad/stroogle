<template>
        <module-card :root="root" :title="title">
            <v-layout row wrap justify-center>
                <v-flex xs6 md4>
                    <v-card hover height="100%">
                        <v-card-text class="text-xs-center pa-3">
                            <v-text-field label="B (ft)" v-model="B" class="pa-0 ma-0"></v-text-field>
                            <v-text-field label="SBC (ksf)" v-model="SBC" class="pa-0 ma-0"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs6 md4>
                    <v-card hover height="100%">
                        <v-card-text class="text-xs-center pa-3">
                            <v-text-field label="P (k)" v-model="P" class="pa-0 ma-0"></v-text-field>
                            <v-text-field label="M (k-ft)" v-model="M" class="pa-0 ma-0"></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>
                 <v-flex xs12 md4>
                    <v-card hover height="100%">
                        <v-card-text class="text-xs-center pa-3">
                           <v-layout row wrap class="">
                                <v-flex xs12>
                                    <v-img src="../images/analysis/analysis-baselength.svg" width=200 ></v-img>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
           
                {{calculate}}
                
                <v-flex xs12>
                    <value-string title="L" subscript="min" :value="Lmin" tooltip="Minimum Length required"></value-string>
                </v-flex>
                <v-flex xs12>
                    <value-check  title="e" :actual="e" :allowable="kern"  unit="ft" :decimal=2 tooltip="Eccentricity"></value-check>
                </v-flex>

                <v-flex xs12 md3>
                    <value-parameter  title="e"  :value="e" unit="ft" :decimal=2></value-parameter>
                </v-flex>
                <v-flex xs12 md3>
                    <value-parameter  title="L/6"  :value="kern" unit="ft" :decimal=2 ></value-parameter>
                </v-flex>
                <v-flex xs12 md3>
                    <value-parameter  title="3Y"  :value="3*Y" unit="ft" :decimal=2></value-parameter>
                </v-flex>
                <v-flex xs12 md3>
                    <value-parameter  title="q" subscript="i" :value="qi" unit="ksf" :decimal=2></value-parameter>
                </v-flex>
               
            
         </v-layout>
        </module-card>
</template>

<script>
    import BaseLength from '@/classes/analysis/clsBaseLength'
    import {deciToFrac} from '@/library/functions'
    
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueString from '@/components/ValueString.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueCheck from '@/components/ValueCheck.vue'

    import _ from 'lodash'

    export default {
        components:{
                ModuleCard, ValueNumber, ValueString, ValueParameter, ValueCheck
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                SBC: 3,
                B: 3,
                P : 1,
                M : 5,

                Lmin : 0,
                e : 0,
                Y : 0,
                qi : 0,
                kern : 0
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
                let inputData = {
                    SBC : this.SBC,
                    B : this.B,
                    P : this.P,
                    M : this.M,
                }

                let BP = new BaseLength(inputData)

                this.Lmin =  deciToFrac(BP.Lmin())
                this.e = BP.e()
                this.Y = BP.Y
                this.qi = BP.qi
                this.kern = BP.kern
            }
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>