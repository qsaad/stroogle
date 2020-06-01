<template>
    <module-card :root="root" :title="title">
         <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Sds" v-model="Sds" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Wp" v-model="Wp" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="ap" v-model="ap" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Rp" v-model="Rp" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Ip" v-model="Ip" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="z" v-model="z" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h" v-model="h" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
          {{calculate}}
            <v-flex xs12>
                <value-number title="F" subscript="p" :value="Fp" unit="" :decimal=0 tooltip="Component Seismic Load"></value-number>
            </v-flex>
            
         </v-layout>
    </module-card>
</template>

<script>
    import SeismicComponent from '@/classes/seismic/clsSeismicComponent'
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'

    import _ from 'lodash'

    export default {
        components:{
                ModuleCard,ValueNumber
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                Sds:0.625,
                Wp:100,
                ap: 2.5,
                Rp : 6,
                Ip : 1,
                z : 15,
                h : 15,
                siteClassList : ['A','B','C','D'],
                //OUTPUT VALUES
                Fp:'',
                Fpmin:'',
                Fpmax:'',
               

            
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
                    Sds : this.Sds,
                    Wp : this.Wp,
                    ap : this.ap,
                    Rp : this.Rp,
                    Ip : this.Ip,
                    z : this.z,
                    h : this.h,
                }//data

            let OB = new SeismicComponent(inputData)

            this.Fp = OB.Fp()
            //this.Fpmin = OB.Fpmin()
            //this.Fpmax = OB.Fpmax()
           
            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>