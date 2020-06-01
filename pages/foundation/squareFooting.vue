<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Base Size</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Length (ft)" v-model="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Thickness (in)" v-model="T" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md2>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Base Rebar</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Rebar" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-select>
                        <v-text-field label="Qty" v-model="rebarQty" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Pier Size</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Width (in)" v-model="C" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Height (in)" v-model="H" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            
            
            <v-flex xs4 md2>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Pier Rebar</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Rebar" :items="rebarSizeList" v-model="pierRebarSize" class="pa-0 ma-0"></v-select>
                        <v-text-field label="Qty" v-model="pierRebarQty" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md2>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Pier Stirrup</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Rebar" :items="rebarSizeList" v-model="pierStirrupSize" class="pa-0 ma-0"></v-select>
                        <v-text-field label="Spa (in)" v-model="pierStirrupSpa" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Axial Load</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field v-model="PD" class="pa-0 ma-0">
                            <template slot="label">P <sub>DL</sub> (k)</template>
                        </v-text-field>
                        <v-text-field v-model="PL" class="pa-0 ma-0">
                            <template slot="label">P <sub>LL</sub> (k)</template>
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
             <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Moment Load</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field v-model="MD" class="pa-0 ma-0">
                            <template slot="label">M <sub>DL</sub> (k-ft)</template>
                        </v-text-field>
                        <v-text-field v-model="ML" class="pa-0 ma-0">
                            <template slot="label">M <sub>LL</sub> (k-ft)</template>
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
             <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Shear Load</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field v-model="VD" class="pa-0 ma-0">
                            <template slot="label">V <sub>DL</sub> (k)</template>
                        </v-text-field>
                        <v-text-field v-model="VL" class="pa-0 ma-0">
                            <template slot="label">V <sub>LL</sub> (k)</template>
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 blue--text">Parameters</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="fc (psi)" v-model="fc" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="SBC (ksf)" v-model="SBC" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
           
            <v-flex xs6 md3>
                {{calculate}}
                <value-percentage title="M" subscript="f" :actual="Ma" :allowable="fMn" tooltip="Flexural Capacity"></value-percentage>
            </v-flex>
            <v-flex xs6 md3>
                <value-percentage title="V" subscript="f1" :actual="V1a" :allowable="fVn" tooltip="Oneway Shear"></value-percentage>
            </v-flex>
            <v-flex xs6 md3>
                <value-percentage title="V" subscript="fp" :actual="Vpa" :allowable="fVnp" tooltip="Punch Shear"></value-percentage>
            </v-flex>
            <v-flex xs6 md3>
                <value-percentage title="q" subscript="f" :actual="qmax" :allowable="SBC" tooltip="Base Pressure"></value-percentage>
            </v-flex>
           
            <v-layout row wrap>
                <v-flex xs6 md4>
                    <value-parameter method="LRFD" title="M" subscript="n" :value="fMn" :decimal=0 unit="k-ft" ></value-parameter>
                </v-flex>
                <v-flex xs6 md4>
                    <value-parameter method="LRFD" title="V" subscript="n" :value="fVn" :decimal=0 unit="k" ></value-parameter>
                </v-flex>
                <v-flex xs6 md4>
                    <value-parameter method="LRFD" title="V" subscript="np" :value="fVnp" :decimal=0 unit="k" ></value-parameter>
                </v-flex>
                <v-flex xs6 md4>
                    <value-parameter title="q" subscript="max" :value="qmax" :decimal=2 unit="ksf" ></value-parameter>
                </v-flex>
                <v-flex xs6 md4>
                    <value-parameter title="q" subscript="min" :value="qmin" :decimal=2 unit="ksf" ></value-parameter>
                </v-flex>
            </v-layout>

         </v-layout>
    </module-card>
</template>

<script>
    import SquareFooting from '@/classes/foundation/clsSquareFooting'
    import ConcretePier from '@/classes/foundation/clsConcretePier'
    import BasePressure from '@/classes/analysis/clsBasePressure'
    import LoadCombination from '@/classes/analysis/clsLoadCombination'
    
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValuePercentage from '@/components/ValuePercentage.vue'
    import ValueParameter from '@/components/ValueParameter.vue'

    import {concrete} from '@/mixins/concreteMixin'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValuePercentage, ValueParameter
            },//COMPONENTS
        mixins : [concrete],
        data(){
            return{
                L : 6,
                T : 12,
                C : 18,
                H : 24,
                fc : 3000,
                SBC : 2,
                rebarSize : '#5',
                rebarQty : 5,
                pierRebarSize : '#6',
                pierRebarQty : 8,
                pierStirrupSize : '#3',
                pierStirrupSpa : 12,
                PD : 10,
                PL : 0,
                MD : 10,
                ML : 0,
                VD : 0,
                VL : 0,
                P : 10,
                M : 20,

                fMn : 0,
                fVn : 0,
                fVnp : 0,
                qmax : 0,
                qmin : 0,
                Ma : 0,
                V1a : 0,
                Vpa : 0,

                xf : 0,
                xv : 0
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
                let dataLoadCombination ={
                    PD : this.PD,
                    PL : this.PL,
                    MD : this.MD + this.VD*this.H/12,
                    ML : this.ML + this.VL*this.H/12,
                    VD : this.VD,
                    VL : this.VL,
                    method : 'LRFD',
                    loadcase : 1
                }

                let LC = new LoadCombination(dataLoadCombination)

                let dataSquareFooting = {
                    b : this.L * 12,
                    h : this.T,
                    C : this.C,
                    fc : this.fc,
                    rebarQty: this.rebarQty,
                    rebarSize: this.rebarSize,
                    cov : 3,
                    Fy : 60,
                    L : this.L,
                    B: this.B,
                    H : 0,
                    P : LC.P(),
                    M : LC.M(),
                    V : 0
                }

                let dataConcetePier = {
                    b : this.C,
                    h : this.C,
                    C : this.C,
                    fc : this.fc,
                    rebarQty: this.rebarQty,
                    rebarSize: this.rebarSize,
                    cov : 3,
                    Fy : 60,
                    P : LC.P(),
                    M : LC.M()
                }

                let dataBasePressure = {
                    L : this.L,
                    B : this.L,
                    P : this.PD,
                    M : this.MD,
                }

                let BP = new BasePressure(dataBasePressure)
                //INJECT BP Instance into the SF Instance
                //let SF = new SquareFooting(dataSquareFooting,BP)
                let SF = new SquareFooting(dataSquareFooting)

                this.messages = [
                    {status : SF.Ast() < SF.Asmin(), type : 'warning', title: '', value : 'As < As min'},
                ]
        
                this.fMn = SF.flexureCapacity()
                this.fVn = SF.onewayShearCapacity()
                this.fVnp = SF.punchingShearCapacity()
                this.qmax = SF.qmax()
                this.qmin = SF.qmin()

                this.Ma = SF.Ma()
                this.V1a = SF.V1a()
                this.Vpa = SF.Vpa()

                this.xf = SF.Xf()
                this.xv = SF.Xv()

            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>