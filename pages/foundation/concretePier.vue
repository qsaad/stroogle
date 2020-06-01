<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="b (in)" v-model="b" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h (in)" v-model="h" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
             <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="fc (psi)" v-model="fc" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="cov (in)" v-model="cov" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Rebar Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-select>
                        <v-select label="Qty Each End" :items="rebarQtyList" v-model="rebarQty" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Stirrup Size" :items="rebarSizeList" v-model="stirrupSize" class="pa-0 ma-0"></v-select>
                        <v-text-field label="Spa (in)" v-model="stirrupSpa" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          
            <v-flex xs12 md4>
                {{calculate}}
                <value-number symbol="&phi;" title="M" subscript="n" :value="fMn" unit="k-ft" :decimal=0 tooltip="Flexural Capacity"></value-number>
            </v-flex>
            <v-flex xs12 md4>
                <value-number symbol="&phi;" title="V" subscript="n" :value="fVn" unit="k" :decimal=0 tooltip="Shear Capacity"></value-number>
            </v-flex>
            <v-flex xs12 md4>
                <value-number symbol="&phi;" title="P" subscript="n" :value="fPn" unit="k" :decimal=0 tooltip="Axial Capacity"></value-number>
            </v-flex>

            <v-flex xs12>
                <v-layout row wrap justify-center>
                    <v-flex xs6 sm4 md3 v-for="(item,key) in messages" :key="key">
                        <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs6>
                <value-parameter  title="L" subscript="d" :value="Ld" unit="in" :decimal=2></value-parameter>
            </v-flex>
            <v-flex xs6>
                <value-parameter  title="L" subscript="dh" :value="Ldh" unit="in" :decimal=2></value-parameter>
            </v-flex>

         </v-layout>
    </module-card>
</template>

<script>
    import ConcretePier from '@/classes/foundation/clsConcretePier'
    import {concrete} from '@/mixins/concreteMixin'
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage
            },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                b: 20,
                h: 28,
                fc : 4000,
                cov : 1.5,
                rebarSize : '#7',
                rebarQtyList : [2,3,4,5,6,7,8,9,10],
                rebarQty : 4,
                stirrupSize : '#3',
                stirrupSpa : 12,

                fMn : 0,
                fVn : 0,
                fPn : 0,
                Ld : 12,
                Ldh : 0,

                messages : [],
            
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
                let dataConcretePier = {
                    b : this.b,
                    h : this.h,
                    fc : this.fc,
                    cov : this.cov,
                    rebarSize : this.rebarSize,
                    rebarQty : this.rebarQty,
                    stirrupSize : this.stirrupSize,
                    stirrupSpa : this.stirrupSpa
                }

                let CP = new ConcretePier(dataConcretePier)

                //VALUES
                this.fMn = CP.flexureCapacity()
                this.fPn = CP.axialCapacity()
                this.fVn = CP.shearCapacity()

                //PARAMETERS
                this.Ld = CP.developmentLength()
                this.Ldh = CP.hookedDevelopmentLength()

                //MESSAGES
                this.messages = [
                    {status : CP.Ast() < CP.AsminFlexure(), type : 'warning', title: '', value : 'As < As min'},
                    {status : CP.clearSpacing() < 0.75, type : 'warning', title: '', value : 'Decrease Rebar Qty'},
                ]

            }
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>