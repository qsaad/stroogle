<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3" >
                        <v-combobox label="Size" :items="boltSizeList" v-model="boltSize" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Grade" :items="boltGradeList" v-model="boltGrade" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
           
           {{calculate}}
            <v-flex xs6>
                <value-number title="V" subscript="b" :value="V" :decimal=2 tooltip="Shear Capacity" unit="k"></value-number>
            </v-flex>
            <v-flex xs6>
                <value-number title="T" subscript="b" :value="T" :decimal=2 tooltip="Tension Capacity" unit="k"></value-number>
            </v-flex>

          
         </v-layout>
    </module-card>
</template>

<script>
    import SteelBolt from '@/classes/steel/clsSteelBolt'
    import {steel} from '@/mixins/steelMixin'
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber
            },//COMPONENTS
        mixins : [steel],
        data(){
            return{
                V : 0,
                T : 0,
                Fnv : 0
            
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
                    grade : this.boltGrade,
                    size : this.boltSize,
                    method : this.method
                }

                let SB = new SteelBolt(inputData)

                this.V = SB.shearCapacity()
                this.T = SB.tensionCapacity()

            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>