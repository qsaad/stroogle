<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="DL (lb)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (lb)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="WL (plf)" v-model.number="WL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="e (in)" v-model.number="e" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="b (in)" v-model.number="b" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h (in)" v-model.number="h" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="fm (psi)" v-model.number="fm" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Qty" :items="rebarQtyList" v-model="rebarQty" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="rebarSizeList" v-model="rebarSize" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" :items="rebarGradeList" v-model.number="rebarGrade" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Provide Stirrup" :items="shearReinfList" v-model.number="shearReinf" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="Stirrup Spacing (in) " v-model.number="stirrupSpa" class="pa-0 ma-0" v-if="shearReinf == 'Yes'"></v-text-field>
                        <v-combobox label="Stirrup Size" :items="rebarSizeList" v-model="stirrupSize" class="pa-0 ma-0"  v-if="shearReinf == 'Yes'"></v-combobox>
                        <v-combobox label="Fyv (ksi)" :items="rebarGradeList" v-model.number="stirrupGrade" class="pa-0 ma-0"  v-if="shearReinf == 'Yes'"></v-combobox>
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
                                         <value-interaction
                                            :heading="'INTERACTION CHECK'"
                                            :actual1="Pr"
                                            :allowable1="fPn"
                                            :title1 ="'Axial'"
                                            :actual2="Mr"
                                            :allowable2="fMn"
                                            :title2 ="'Flexure'"
                                            tooltip="Combined Axial + Flexure Check"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="V" :actual="Vr" :allowable="fVn"  :decimal=0 unit="lb" tooltip="Shear Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check :symbol="'&Delta;'" title="" subscript="LL" :actual="Dmax" :allowable="Da"  :decimal=3 unit="in" tooltip="WL Deflection"></value-check>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-layout row wrap justify-center>
                                            <v-flex xs12 v-for="(item,key) in filteredMessages" :key="key">
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
    import ModuleCard from '@/components/ModuleCard.vue'
     import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import MasonryColumn from '@/classes/masonry/clsMasonryColumn'
    import {masonry} from '@/mixins/masonryMixin'

    import {simpleBeamUniformLoadDeflection, PDelta_Deflection, I_effective} from '@/library/analysis'


    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction
            },//COMPONENTS
        mixins : [masonry],
        data(){
            return{
                DL : 3000,
                LL : 3000,
                WL : 500,
                e : 2,
                b : 15.625,
                h : 15.625,
                L : 12,
                fm : 1900,
                rebarQtyList : [4,8,12,16,20,24,28],
                rebarQty : 8,
                rebarSize : '#6',
                shearReinfList : ['Yes','No'],
                shearReinf : 'Yes',
                stirrupSize : '#3',
                stirrupSpa : 12,
                stirrupGrade : 40,
                messages : [],
                paramsList : ['Properties','Flexure','Axial','Shear'],
                param : 'Axial',
                propsParams : [],
                flexureParams : [],
                axialParams : [],
                fMn : 0,
                fPn : 0,
                Mr : 0,
                Pr : 0,
                Im : 0,
                Em : 0,
                wt : 0,
                Mw : 0,
                Me : 0,
                Mp : 0,
                Dw : 0,
                Dp : 0,
                Dmax : 0,
                Da : 0,
                BA : {}
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
            params(){
                switch(this.param){
                    case ('Properties'):
                        return this.propsParams
                        break
                    case ('Flexure'):
                        return this.flexureParams
                        break
                    case ('Axial'):
                        return this.axialParams
                        break
                    case ('Shear'):
                        return this.shearParams
                        break
                }//SWITCH
            },//PARAMS
            calculate(){
                let inputData = {
                    b : this.b,
                    h : this.h,
                    L : this.L,
                    fm : this.fm,
                    Fy : this.rebarGrade,
                    rebarQty: this.rebarQty,
                    rebarSize: this.rebarSize,
                    shearReinf : this.shearReinf == 'Yes' ? true : false,
                    stirrupSize : this.stirrupSize,
                    stirrupSpa : this.stirrupSpa,
                    stirrupGrade : this.stirrupGrade
                }

                let MP = new MasonryColumn(inputData)

                this.fMn = MP.fMn()
                this.fPn = MP.fPn()
                this.fVn = MP.fVn()
                this.d = MP.d()
                this.Ig = MP.Ig
                this.wt = MP.wt
                this.Icr = MP.Icr()
                this.Mcr = MP.Mcr()
                this.rho = MP.rho()
                this.rho_b = MP.rho_b()
                this.Em = MP.Em * 1000
                this.h_t = MP.h_t
                this.fs1 = MP.fs1()
                this.Fs = MP.Fs()
                this.propsParams = MP.propsParams()
                this.flexureParams = MP.flexureParams()
                this.axialParams = MP.axialParams()
                this.shearParams = MP.shearParams()

                this.Mw = this.WL *Math.pow(this.L,2)/8
                this.Me = (this.DL+this.LL)*this.e/(2*12)
                this.Vr = this.WL *this.L/2
                this.Pr = (this.DL + this.LL) + (this.wt*this.L/2)

                this.Ie = I_effective({M:this.Mr, Mcr:this.Mcr, Ig:this.Ig, Icr:this.Icr})

                this.Dw = simpleBeamUniformLoadDeflection({w:this.WL, L:this.L, E:this.Em, I:this.Ie})
                
                this.Da = 0.375

                 if(this.h_t < 24){
                    this.Dp = 0
                    this.Mp = 0
                    this.Mr = this.Mw + this.Me
                    this.Dmax = this.Dw
                }
                else{
                    this.Dp = PDelta_Deflection({M: (this.Mw + this.Me), L: this.L, Mcr: this.Mcr, E: this.Em, Ig: this.Ig, Icr: this.Icr})
                    this.Mp = this.Pr*this.Dp/12
                    this.Mr = this.Mw + this.Me + this.Mp
                    this.Dmax = this.Dw + this.Dp
                }

                this.messages = [
                    {status : this.DL < 0, type : 'error', title: 'DL', value : 'Cannot be negative'},
                    {status : this.LL < 0, type : 'error', title: 'LL', value : 'Cannot be negative'},
                    {status : this.WL < 0, type : 'error', title: 'WL', value : 'Cannot be negative'},
                    {status : this.fm < 0, type : 'error', title: 'fm', value : 'Cannot be negative'},
                    {status : this.h < 0, type : 'error', title: 'h', value : 'Cannot be negative'},
                    {status : this.h_t > 24, type : 'info', title: 'Slender Wall', value : 'h/t > 24'},
                    {status : this.rho >= this.rho_b, type : 'info', title: 'Masonry Capacity Controls', value : `&rho; > &rho;<sub>b</sub>`},
                    {status : this.rho < this.rho_b, type : 'info', title: 'Steel Capacity Controls', value : `&rho; < &rho;<sub>b</sub>`},
                    {status : this.Mr > this.Mcr, type : 'info', title: 'Cracked Deflection', value : 'M > Mcr'},
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