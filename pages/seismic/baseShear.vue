<template>
    <module-card :root="root" :title="title">
         <v-layout row wrap justify-center>
            <!-- BUTTONS -->
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Ss" v-model="Ss" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="S1" v-model="S1" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="R" v-model="R" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h (ft)" v-model="h" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Site Class" :items="siteClassList" v-model="siteClass" class="pa-0 ma-0"></v-select>
                        <v-select label="Category" :items="categoryList" v-model="category" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-select>
                        <v-select label="Period" :items="TLList" v-model="TL" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                {{calculate}}
                <value-number title="F" subscript="a" :value="Fa" unit="" :decimal=3 tooltip="Cs"></value-number>
            </v-flex>
            <v-flex xs6 md4>
                <value-number title="F" subscript="v" :value="Fv" unit="" :decimal=3 tooltip="Cs"></value-number>
            </v-flex>
            <v-flex xs6 md4>
                <value-number title="S" subscript="ms" :value="Sms" unit="" :decimal=3 tooltip="Cs"></value-number>
            </v-flex>
            <v-flex xs6 md4>
                <value-number title="S" subscript="ds" :value="Sds" unit="" :decimal=3 tooltip="Cs"></value-number>
            </v-flex>
            <v-flex xs6 md4>
                <value-number title="S" subscript="d1" :value="Sd1" unit="" :decimal=3 tooltip="Cs"></value-number>
            </v-flex>
            <v-flex xs6 md4>
                <value-number title="C" subscript="s" :value="Cs" unit="" :decimal=3 tooltip="Base Shear Coefficient"></value-number>
            </v-flex>
            <v-flex xs6 md4>
                <value-number title="I" subscript="e" :value="Ie" unit="" :decimal=3 tooltip="Importance Factor"></value-number>
            </v-flex>
         </v-layout>
         
    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import Seismic from '@/classes/seismic/clsSeismic'

    import _ from 'lodash'

    export default {
        components:{
                ModuleCard, ValueNumber
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                //INPUT PARAMETER
                Ss:0.625,
                S1:1.234,
                siteClassList : ['A','B','C','D'],
                siteClass : 'B',
                categoryList : ['I','II','III','IV'],
                category : 'II',
                TLList : [6,8,10,12],
                TL : 10,
                typeList : ['Steel SMF','Concrete SMF','Steel EBF','Steel BRBF','Others'],
                type : 'Others',
                h : 20,
                R : 3,
                W : 100,
                //OUTPUT VALUES
                SDC:'A',
                Fa:'',
                Fv:'',
                Sd1 : '',
                Sds : '',
                Sms : '',
                Sm1 : '',
                Ie : '',
                Cs : ''

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
                    Ss : this.Ss,
                    S1 : this.S1,
                    siteClass : this.siteClass,
                    category : this.category,
                    TL : this.TL,
                    type : this.type,
                    h : this.h,
                    R : this. R,
                    W : this.W,
                    
                }//data

            let OB = new Seismic(inputData)

                
            this.Fa = OB.Fa()
            this.Fv = OB.Fv()
            this.Sms = OB.Sms()
            this.Sm1 = OB.Sm1()
            this.Sds = OB.Sds()
            this.Sd1 = OB.Sd1()
            this.Ie = OB.Ie()
            this.Cs = OB.Cs()
               

            }//CALCULATE
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>