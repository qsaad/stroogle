<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Weld Size" v-model="weldSize" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Weld Grade" :items="weldGradeList" v-model="weldGrade" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Upper Sheet" :items="sheetThicknessList" v-model="t1" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Lower Sheet" :items="sheetThicknessList" v-model="t2" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            
            <v-flex xs12>
                {{calculate}}
                <value-number :method="method" title="P" subscript="n" :value="Pn" :decimal=0 unit="lb" tooltip="Shear Capacity"></value-number>
            </v-flex>

        </v-layout>
    </module-card>
</template>

<script>
    import PuddleWeldCapacity from '@/classes/coldform/clsPuddleWeldCapacity'
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
                weldSize : 0.625,
                Pn : 0
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
                    weldSize : this.weldSize,
                    weldGrade : this.weldGrade,
                    t1 : this.t1,
                    t2 : this.t2,
                    method : this.method
                }

                let PW = new PuddleWeldCapacity(inputData)

                this.Pn = PW.Pn()
            }//CALCULATE
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>