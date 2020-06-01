<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Weld Length" v-model="weldLength" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Sheet Thickness" :items="sheetThicknessList" v-model="t" class="pa-0 ma-0"></v-select>
                        
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Weld Grade" :items="weldGradeList" v-model="weldGrade" class="pa-0 ma-0"></v-select>
                        <v-select label="Weld Type" :items="grooveWeldTypeList" v-model="grooveWeldType" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            
            <v-flex xs6 md6>
                {{calculate}}
                <value-number :method="method" title="P" subscript="L" :value="fPL" :decimal=0 unit="lb" tooltip="Longitudinal Shear Capacity"></value-number>
            </v-flex>
            <v-flex xs6 md6>
                <value-number :method="method" title="P" subscript="T" :value="fPT" :decimal=0 unit="lb" tooltip="Transverse Shear Capacity"></value-number>
            </v-flex>

        </v-layout>
    </module-card>
</template>

<script>
    import GrooveWeldCapacity from '@/classes/coldform/clsGrooveWeldCapacity'
    import {coldform} from '@/mixins/coldformMixin'
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber
            },//COMPONENTS
        mixins : [coldform],
        data(){
            return{
                weldLength : 1,
                t : '20',
                fPL : 0,
                fPT : 0
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
                    weldLength : this.weldLength,
                    weldGrade : this.weldGrade,
                    grooveWeldType : this.grooveWeldType,
                    t : this.t,
                    method : this.method
                }

                let GW = new GrooveWeldCapacity(inputData)

                this.fPL = GW.fPL()
                this.fPT = GW.fPT()
            }//CALCULATE
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>