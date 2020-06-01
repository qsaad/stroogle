<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs4 md2>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">SIZE</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="b (in)" v-model="b" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h (in)" v-model="h" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="fc (psi)" v-model="fc" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">REBAR</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Quantity" :items="rebarQtyList" v-model="rebarQty" class="pa-0 ma-0"></v-select>
                        <v-select label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-select>
                        <v-text-field label="cov (in)" v-model="cov" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">STIRRUPS</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Size" :items="rebarSizeList" v-model="stirrupSize" class="pa-0 ma-0"></v-select>
                        <v-text-field label="Spa (in)" v-model="stirrupSpa" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Legs " v-model="stirrupLegs" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-layout row wrap justify-center align-center>
                                <v-flex xs12>
                                    <v-img src="../images/concrete/concrete-beam.svg" width=200 ></v-img>
                                </v-flex>
                            </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          
            <v-flex xs6>
                {{calculate}}
                <value-number symbol="&phi;" title="M" subscript="n" :value="fMn" unit="k-ft" :decimal=0 tooltip="Flexural Capacity"></value-number>
            </v-flex>
            <v-flex xs6>
                <value-number symbol="&phi;" title="V" subscript="n" :value="fVn" unit="k" :decimal=0 tooltip="Shear Capacity"></value-number>
            </v-flex>

            <v-flex xs12>
                <v-layout row wrap justify-center>
                    <v-flex xs12 v-for="(item,key) in filteredMessages" :key="key">
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
    import ConcreteBeam from '@/classes/concrete/clsConcreteBeam'
    import {concrete} from '@/mixins/concreteMixin'

    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage
            },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                b: 12,
                h: 24,
                rebarQtyList: [2, 3, 4, 5, 6, 7, 8, 9, 10],
                rebarQty: 2,
                rebarSize: "#5",
                stirrupSize: '#3',
                stirrupSpa: 12,
                stirrupLegs: 2,
                fc : 3000,
                cov : 1.5,

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
                    rebarQty: this.rebarQty,
                    rebarSize: this.rebarSize,
                    stirrupSize: this.stirrupSize,
                    stirrupSpa: this.stirrupSpa,
                    stirrupLegs: this.stirrupLegs
                }
                let CB = new ConcreteBeam(inputData)

                //VALUES
                this.fMn = CB.flexuralCapacity()
                this.fVn = CB.shearCapacity()

                //PARAMETERS
                this.Ld = CB.developmentLength()
                this.Ldh = CB.hookedDevelopmentLength()

                //MESSAGES
                this.messages = [
                    {status : CB.Ast() < CB.AsminFlexure(), type : 'warning', title: 'Rebar', value : 'As < As min'},
                    {status : CB.clearSpacing() < 0.75, type : 'warning', title: 'Rebar Spa', value : 'Clr Spa < 3/4'},
                ]
            },//CALCULATE

            filteredMessages(){
                return _.filter(this.messages,{status : true})
            },//FILTERED MESSAGES
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>