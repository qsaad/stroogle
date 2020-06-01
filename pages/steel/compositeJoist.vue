<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">LOADS</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="DL(psf)" v-model="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="CL(psf)" v-model="CL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="SDL(psf)" v-model="SDL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL(psf)" v-model="LL" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">JOIST</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Dj (in)" v-model="Dj" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lj (ft)" v-model="Lj" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Sj (in)" v-model="Sj" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Top Chord" :items="items" v-model="ShapeTop" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Bot Chord" :items="items" v-model="ShapeBot" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">SLAB</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                       <v-text-field label="hs (in)" v-model="hs" class="pa-0 ma-0"></v-text-field>
                       <v-select label="hd (in)" :items="deckHeightList" v-model="hd" class="pa-0 ma-0"></v-select>
                       <v-text-field label="Fc (psi)" v-model="Fc" class="pa-0 ma-0"></v-text-field>
                       <v-text-field label="Bay Width (ft)" v-model="bay_width" class="pa-0 ma-0"></v-text-field>
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
                                        <value-check title="Composite" :allowable="fMn_c" :actual="Mu_c" :decimal=0 tooltip="Flexure" unit=""></value-check>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-check title="Non-Composite" :allowable="fMn_nc" :actual="Mu_nc" :decimal=0 tooltip="Flexure" unit=""></value-check>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-check title="Screw Qty" :allowable="Nr" :actual="Ns" :decimal=0 tooltip="Flexure" unit=""></value-check>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-check title="ap/g" :allowable="0.5" :actual="ap_g" :decimal=3 tooltip="Peak Acceleration" unit=""></value-check>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-check :symbol="'&Delta;'" subscript="LL" title="" :allowable="Lj*12/360" :actual="DLL_c" :decimal=2 tooltip="Composite Live Load Deflection " unit="in"></value-check>
                                    </v-flex>

                                    <v-flex xs12>
                                         <value-computed symbol="&Delta;"  subscript="c" :value="DLL_c" :decimal=2 tooltip="Composite Live Load Deflection" unit="in"></value-computed>
                                    </v-flex>
                                   
                                  
                                    <v-flex xs12>
                                        <v-layout row wrap justify-center>
                                            <v-flex xs12 v-for="(item,key) in filteredMessages" :key="key" class="py-1 ma-0">
                                                <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                               <v-layout row wrap>
                                    <v-flex>
                                        <v-combobox label="Parameter" :items="paramsList" v-model="param" class="pa-0 ma-0"></v-combobox>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs4 v-for="(value,key) in params" :key="key"> 
                                        <value-parameter :title=key :value=value :decimal=4 unit=""></value-parameter>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>
    </module-card>
</template>

<script>
    import SteelCompositeJoist from '@/classes/steel/clsSteelCompositeJoist'
    import {steel} from '@/mixins/steelMixin'
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import * as Data_LU from '@/data/Data_LU'
    import * as Data_L from '@/data/Data_L'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction
            },//COMPONENTS
        mixins : [steel],
        data(){
            return{
                //LOADS
                DL : 42,
                CL : 25,
                SDL : 15,
                LL : 55,
                //JOIST
                Dj : 16,
                Lj : 30,
                Sj : 48,
                ShapeList:[],
                ShapeTop :'L2X2X3/8',
                ShapeBot :'L2X2X3/8',
                //SLAB
                hs : 3.5,
                deckHeightList : [1, 1.5],
                hd : 1,
                Fc : 3000,
                locationList : ['Interior','End'],
                location : 'Interior',
                bay_width : 143,

                messages : [],
                paramsList : ['Properties','Composite','Non-Composite'],
                param : 'Properties',
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
            _.forEach(Data_L.ShapeList,item =>{
                this.ShapeList.push(item)
            }) 
        },//MOUNTED
        computed:{
            params(){
                switch(this.param){
                    case ('Properties'):
                        return {

                        }
                        break
                    case ('Composite'):
                        return {

                        }
                        break
                    case ('Non-Composite'):
                        return {
                            
                        }
                        break
                }//SWITCH
            },//PARAMS
            items(){
                return _.map(this.ShapeList, 'Shape')
            },
            calculate(){
               let inputData = {
                    DL : this.DL,
                    CL : this.CL,
                    SDL : this.SDL,
                    LL : this.LL,
                    Dj : this.Dj,
                    Lj : this.Lj,
                    Sj : this.Sj,
                    hs : this.hs,
                    hd : this.hd,
                    Fc : this.Fc,
                    ShapeTop : this.ShapeTop,
                    ShapeBot : this.ShapeBot,
                    bay_width : this.bay_width
                }

                let SCJ = new SteelCompositeJoist(inputData)

                this.Mu_nc = SCJ.Mu_nc()
                this.Mu_c = SCJ.Mu_c()

                this.deff_nc = SCJ.deff_nc()
                this.deff_c = SCJ.deff_c()

                this.fMn_nc = SCJ.fMn_nc()
                this.fMn_c = SCJ.fMn_c()

                this.Tbc = SCJ.TensionBottomChord()
                this.Ns = 2*SCJ.Ns()
                this.Nr = SCJ.Nr()
                this.Qn = SCJ.Qn()

                this.DDL_nc = SCJ.Deflection_DL_NonComposite()
                this.DLL_c = SCJ.Deflection_LL_Composite()

                this.ap_g = SCJ.ap_g()

                this.ws = SCJ.ws()
                this.Fj = SCJ.Fj()
            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>