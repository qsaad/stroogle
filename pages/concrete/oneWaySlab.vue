<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="t (in)" v-model="h" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="fc (psi)" v-model="fc" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Fy (ksi)" :items="rebarGradeList" v-model="Fy" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Spacing (in)" v-model="rebarSpa" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-select>
                        <v-text-field label="cov (in)" v-model="cov" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          
            <v-flex xs12 md8>
                {{calculate}}
                <value-number symbol="&phi;" title="M" subscript="n" :value="fMn" :decimal=0 unit="k-ft" tooltip="Flexural Capacity"></value-number>
            </v-flex>

            <v-flex xs12>
                <v-layout row wrap justify-center>
                    <v-flex xs6 sm4 md3 v-for="(item,key) in messages" :key="key">
                        <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
                    </v-flex>
                </v-layout>
            </v-flex>
            
         </v-layout>
    </module-card>
</template>

<script>
    import ConcreteSlab from '@/classes/concrete/clsConcreteSlab'
    import {concrete} from '@/mixins/concreteMixin'

    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueMessage from '@/components/ValueMessage.vue'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueMessage
            },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                b: 12,
                h: 8,
                rebarSpa: 12,
                rebarSize: "#5",
                fc : 3000,
                Fy : 60,
                cov : 0.75,

                fMn : 0,
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
                let inputData = {
                    b: this.b,
                    h: this.h,
                    cov : this.cov,
                    fc : this.fc,
                    Fy : this.Fy,
                    rebarSpa: this.rebarSpa,
                    rebarSize: this.rebarSize
                }
                let CS = new ConcreteSlab(inputData)


                this.messages = [
                    {status : CS.Ast() < CS.Asmin(), type : 'warning', title: '', value : 'As < As min'},
                ]
        
                this.fMn = CS.flexuralCapacity()
               
            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>