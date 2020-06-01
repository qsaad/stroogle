<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="DL (plf)" v-model.number="DL" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (plf)" v-model.number="LL" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Level Type" :items="levelTypeList" v-model="levelType" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="fm (psi)" v-model.number="fm" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="b (in)" :items="thicknessList" v-model="thickness" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="h (in)" v-model.number="h" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Brg (in)" v-model.number="Lbrg" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Rebar Qty " v-model.number="rebarQty" class="pa-0 ma-0"></v-text-field>
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
                                        <value-check title="M" :actual="Mr" :allowable="fMn"  :decimal=0 unit="lb-ft" tooltip="Flexure Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="V" :actual="Vr" :allowable="fVn"  :decimal=0 unit="lb" tooltip="Shear Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="R" :actual="Rr" :allowable="fRn"  :decimal=0 unit="lb" tooltip="Bearing Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check :symbol="'&Delta;'" title="" subscript="LL" :actual="DLL" :allowable="DLLa"  :decimal=3 unit="in" tooltip="LL Deflection"></value-check>
                                    </v-flex>
                                     <v-flex xs12> 
                                        <value-check :symbol="'&Delta;'" title="" subscript="TL" :actual="DTL" :allowable="DTLa"  :decimal=3 unit="in" tooltip="TL Long Term Deflection"></value-check>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="DL" :value="DDL"  :decimal=3 unit="in" tooltip="DL Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="LL" :value="DLL"  :decimal=3 unit="in" tooltip="LL Deflection"></value-computed>
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

    import MasonryLintel from '@/classes/masonry/clsMasonryLintel'
    import {masonry} from '@/mixins/masonryMixin'

    import {simpleBeamUniformLoadDeflection, I_effective} from '@/library/analysis'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction
            },//COMPONENTS
        mixins : [masonry],
        data(){
            return{
                h : 8,
                L : 6,
                Lbrg : 8,
                fm : 1900,
                DL : 300,
                LL : 300,
                fMn : 0,
                fVn : 0,
                Mr : 0,
                Vr : 0,
                rebarQty : 2,
                levelTypeList : ['Floor', 'Roof'],
                levelType : 'Roof',

                shearReinfList : ['Yes','No'],
                shearReinf : 'No',
                stirrupSize : '#3',
                stirrupSpa : 12,
                stirrupGrade : 40,
                messages : [],
                paramsList : ['Properties','Flexure','Shear'],
                param : 'Flexure',
                propsParams : [],
                flexureParams : [],
                shearParams : [],

                Im : 0,
                Em : 0,
                wt : 0,
                DDL : 0,
                DLL : 0,
                DTL : 0,
                DLLa : 0,
                DTLa : 0,
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
                    case ('Shear'):
                        return this.shearParams
                        break
                }//SWITCH
            },//PARAMS

            calculate(){
                let inputData = {
                    thickness : this.thickness,
                    h : this.h,
                    fm : this.fm,
                    Fy : this.rebarGrade,
                    rebarQty: this.rebarQty,
                    rebarSize: this.rebarSize,
                    shearReinf : this.shearReinf == 'Yes' ? true : false,
                    stirrupSize : this.stirrupSize,
                    stirrupSpa : this.stirrupSpa,
                    stirrupGrade : this.stirrupGrade
                }

                let ML = new MasonryLintel(inputData)

                this.fMn = ML.fMn()
                this.fVn = ML.fVn()
                this.fRn = ML.fRn()
                this.d = ML.d()
                this.Ig = ML.Ig
                this.wt = ML.wt
                this.Icr = ML.Icr()
                this.Mcr = ML.Mcr()
                this.rho = ML.rho()
                this.rho_b = ML.rho_b()
                this.Em = ML.Em * 1000
                this.fs1 = ML.fs1()
                this.Fs = ML.Fs()
                this.propsParams = ML.propsParams()
                this.flexureParams = ML.flexureParams()
                this.shearParams = ML.shearParams()

                this.Mr = (this.DL + this.wt + this.LL)*Math.pow(this.L,2)/8
                this.Vr = (this.DL + this.wt + this.LL)*(this.L-this.d/12)/2
                this.Rr = (this.DL + this.wt + this.LL)*(this.L-this.Lbrg/12)/2

                this.Ie = I_effective({M:this.Mr, Mcr:this.Mcr, Ig:this.Ig, Icr:this.Icr})

                this.DDL = simpleBeamUniformLoadDeflection({w:this.DL, L:this.L, E:this.Em, I:this.Ie})
                this.DLL = simpleBeamUniformLoadDeflection({w:this.LL, L:this.L, E:this.Em, I:this.Ie})
                this.DTL = 3*this.DDL + this.DLL

                this.DLLa = this.levelType == 'Floor' ? this.L*12/360 : this.L*12/240
                this.DTLa = this.levelType == 'Floor' ? this.L*12/240 : this.L*12/180

                this.messages = [
                    {status : this.DL < 0, type : 'error', title: 'DL', value : 'Cannot be negative'},
                    {status : this.LL < 0, type : 'error', title: 'LL', value : 'Cannot be negative'},
                    {status : this.WL < 0, type : 'error', title: 'WL', value : 'Cannot be negative'},
                    {status : this.fm < 0, type : 'error', title: 'fm', value : 'Cannot be negative'},
                    {status : this.h < 0, type : 'error', title: 'h', value : 'Cannot be negative'},
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