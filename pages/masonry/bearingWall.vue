<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center class="pa-0 ma-0">
             <v-flex xs12 md6>
                 <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-0 ma-0">
                        <v-stage :config="{width:width, height:height}">
                            <v-layer ref="layer">
                                <!-- LOAD --> 
                                <konva-arrow :xo="0.375*width + computedEccentricity" :yo="0.05*height" :length="60" :rotation="0"></konva-arrow>
                                <konva-label :xo="0.375*width + computedEccentricity" :yo="0.08*height" :text="DL" :unit="'lb/ft'" :name="'DL'" :pointer="'left'" title="DL :" :decimal="0" @selected-text="edit"></konva-label>
                                <konva-label :xo="0.375*width + computedEccentricity" :yo="0.17*height" :text="LL" :unit="'lb/ft'" :name="'LL'" :pointer="'left'" title="LL :" :decimal="0" @selected-text="edit"></konva-label>
                                <konva-label :xo="0.375*width + computedEccentricity" :yo="0.13*height" :text="ew" :unit="'in'" :name="'ew'" :pointer="'right'" title="e :" @selected-text="edit"></konva-label>

                                <!-- WIND LOAD --> 
                                <konva-uniform-load :xo="0.2*width" :yo="0.85*height" :width="0.6*width" :height="0.5*WL" :rotation="270"></konva-uniform-load>
                                <konva-label :xo="0.2*width " :yo="0.55*height" :text="WL" :unit="'psf'" :name="'WL'" :pointer="'right'" @selected-text="edit"></konva-label>

                                <!-- WALL --> 
                                <konva-rect :xo="0.35*width" :yo="0.25*height" :width="0.05*width" :height="0.6*height"></konva-rect>
                                <konva-label :xo="0.45*width " :yo="0.25*height + computedTopSupport/5" :text="hp" :unit="'ft'" :name="'hp'" :pointer="''" @selected-text="edit" v-if="hp != 0"></konva-label>
                                <konva-label :xo="0.45*width " :yo="0.52*height" :text="h" :unit="'ft'" :name="'h'" :pointer="''" @selected-text="edit"></konva-label>
                                
                                <!-- TOP REACTION --> 
                                <konva-support :xo="0.43*width" :yo="0.25*height + computedTopSupport" :radius="10" :rotation="270" :name="'hp'" @selected-text="edit">></konva-support>
                                <konva-text :xo="0.47*width" :yo="0.25*height + computedTopSupport - 4" :text="RT" :unit="'lb'" :decimal="0"></konva-text>

                                <!-- BOTTOM REACTION --> 
                                <konva-support :xo="0.43*width" :yo="0.85*height" :radius="10" :rotation="270"></konva-support>
                                <konva-text :xo="0.47*width" :yo="0.83*height" :text="RB" :unit="'lb'" :decimal="0"></konva-text>
                                
                               <!-- REQUIRED MOMENT --> 
                               <konva-text :xo="0.45*width" :yo="0.6*height " :text="Mr" :unit="'lb-ft'" :decimal="0"></konva-text>

                               <!-- INTERACTION CHECK --> 
                               <konva-percent-donut :xo="0.82*width" :yo="0.15*height" :val="interaction"  title="FLEXURE + AXIAL"></konva-percent-donut>
                               <konva-percent-donut :xo="0.75*width" :yo="0.40*height" :val="flexure"  title="FLEXURE" size="small"></konva-percent-donut>
                               <konva-percent-donut :xo="0.9*width" :yo="0.40*height" :val="axial"  title="AXIAL" size="small"></konva-percent-donut>
                               
                                <!-- BLOCK --> 
                                <konva-rect :xo="0.7*width" :yo="0.65*height" :width="0.26*width" :height="0.14*height"></konva-rect>
                                <konva-rect :xo="0.72*width" :yo="0.67*height" :width="0.1*width" :height="0.1*height"></konva-rect>
                                <konva-rect :xo="0.84*width" :yo="0.67*height" :width="0.1*width" :height="0.1*height"></konva-rect>
                                
                                <!-- THICKNESS -->
                                <konva-label :xo="0.7*width " :yo="0.72*height" :text="thickness" :unit="''" :name="'thickness'" :pointer="'right'" title="t :" @selected-text="edit"></konva-label>
                                
                                <!-- REBAR --> 
                                <konva-rebar :xo="0.77*width " :yo="0.69*height" v-if="rebarLoc == 'Edge'"></konva-rebar>
                                <konva-rebar :xo="0.77*width " :yo="0.75*height" v-if="rebarLoc == 'Edge'"></konva-rebar>
                                <konva-rebar :xo="0.77*width " :yo="0.72*height" v-else></konva-rebar>
                                <konva-label :xo="0.77*width " :yo="0.8*height" :text="rebarSize +' @ '+ rebarSpa" :unit="''" :name="'rebar'" :pointer="'up'" @selected-text="edit"></konva-label>
                            </v-layer>
                        </v-stage>
                    </v-card-text>
                 </v-card>
             </v-flex>
            {{calculate}}
             <v-flex xs12 md3>
                  <v-card hover height="100%" class="pa-2">
                    <v-card-title class="font-weight-bold title px-1 pt-0 pb-2 ma-0">
                        INPUT
                    </v-card-title>
                    <v-card-text class="text-xs-center pa-0 ma-0">
                        <v-text-field label="DL (plf)" flat outline v-model.number="DL" v-if="isEdit == 'DL'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="LL (plf)" flat outline v-model.number="LL" v-if="isEdit == 'LL'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="e (in)" flat outline v-model.number="ew" v-if="isEdit == 'ew'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="WL (psf)" flat outline v-model.number="WL" v-if="isEdit == 'WL'" class="pa-0 ma-0"></v-text-field>

                        <v-combobox label="t (in)" flat outline :items="thicknessList" v-model="thickness" v-if="isEdit == 'thickness'" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="fm (psi)" flat outline v-model.number="fm" v-if="isEdit == 'thickness'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h (ft)" flat outline v-model.number="h" v-if="isEdit == 'h'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="hp (ft)" flat outline v-model.number="hp" v-if="isEdit == 'hp'" class="pa-0 ma-0"></v-text-field>

                        <v-combobox label="Rebar Location" flat outline :items="rebarLocList" v-if="isEdit == 'rebar'" v-model="rebarLoc" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Spacing (in)" flat outline :items="rebarSpaList" v-if="isEdit == 'rebar'" v-model="rebarSpa" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" flat outline :items="rebarSizeList" v-if="isEdit == 'rebar'" v-model="rebarSize" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" flat outline :items="rebarGradeList" v-if="isEdit == 'rebar'" v-model.number="rebarGrade" class="pa-0 ma-0"></v-combobox>

                    </v-card-text>
                 </v-card>
            </v-flex>

        </v-layout>

        <v-layout row wrap justify-center>
           
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
                                            :actual1="Mr"
                                            :allowable1="fMn"
                                            :title1 ="'Flexure'"
                                            :actual2="Pr"
                                            :allowable2="fPn"
                                            :title2 ="'Axial'"
                                            tooltip="Combined Flexure + Axial Check"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="max" :value="Dmax"  :decimal=3 unit="in" tooltip="Max Deflection"></value-computed>
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
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import KonvaRect from '@/components/KonvaRect.vue'
    import KonvaLabel from '@/components/KonvaLabel.vue'
    import KonvaArrow from '@/components/KonvaArrow.vue'
    import KonvaText from '@/components/KonvaText.vue'
    import KonvaDim from '@/components/KonvaDim.vue'
    import KonvaSupport from '@/components/KonvaSupport.vue'
    import KonvaPercentDonut from '@/components/KonvaPercentDonut.vue'
    import KonvaUniformLoad from '@/components/KonvaUniformLoad.vue'
    import KonvaRebar from '@/components/KonvaRebar.vue'

    import MasonryWall from '@/classes/masonry/clsMasonryWall'
    import {masonry} from '@/mixins/masonryMixin'
    import {graphics} from '@/mixins/graphicsMixin'

    import {singleCantileverUniformLoad, PDelta_Deflection, I_effective} from '@/library/analysis'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction,
                KonvaRect, KonvaLabel, KonvaArrow, KonvaText, KonvaDim, KonvaSupport, 
                KonvaPercentDonut, KonvaUniformLoad, KonvaRebar
            },//COMPONENTS
        mixins : [masonry, graphics],
        data(){
            return{
                h : 12,
                hp : 0,
                ew : 1,
                DL : 300,
                LL : 300,
                WL : 15,
                SDS : 0.11,
                fMn : 0,
                Mr : 0,
                Pr : 0,
                e : 0,
                Mw : 0,
                Me : 0,
                Mp : 0,
                RB : 0,
                RT : 0,

                isEdit : 'h',
                interaction : 0,
                flexure : 0,
                axial : 0,
                
                messages : [],
                paramsList : ['Properties','Forces','Flexure','Axial','Shear'],
                param : 'Flexure',
                propsParams : [],
                flexureParams : [],
                axialParams : [],
                shearParams : [],

                Im : 0,
                Em : 0,
                wt : 0,
                tf : 0,
                kd : 0,
                e : 0,
                ea : 0,
                BA : {},
                rho : 0,
                rho_b : 0,
                Dmax : 0,
                Icr : 0,
                Ie : 0,
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
            computedEccentricity(){
                let b = 0.05*this.width
                let t = this.thickness
                let e = this.ew

                return e*(b/t)
            },
            computedTopSupport(){
                let b = 0.6*this.height
                let hw = this.h + this.hp
                let hp = this.hp

                return hp * (b/hw)
            },
            params(){
                switch(this.param){
                    case ('Properties'):
                        return this.propsParams
                        break
                    case ('Flexure'):
                        return this.flexureParams
                        break
                    case ('Forces'):
                        return {
                            Mw : this.Mw,
                            Me : this.Me,
                            Mp : this.Mp,
                            Dw : this.Dw,
                            Dp : this.Dp,
                            Ie : this.Ie
                        }
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
                //console.log(this.thickness)
                let inputData = {
                    thickness : this.thickness,
                    h : this.h,
                    fm : this.fm,
                    Fy : this.rebarGrade,
                    rebarLoc: this.rebarLoc,
                    rebarSpa: this.rebarSpa,
                    rebarSize: this.rebarSize
                }
                let MW = new MasonryWall(inputData)
                this.fMn = MW.fMn()
                this.fPn = MW.fPn()
                this.Ig = MW.Ig
                this.Ag = MW.Ag
                this.S = MW.S
                this.Icr = MW.Icr()
                this.Mcr = MW.Mcr()
                this.h_t = MW.h_t()
                this.Em = MW.Em * 1000
                this.wt = MW.wt
                this.tf = MW.tf
                this.kd = MW.kd()
                this.ea = MW.e()
                this.fs1 = MW.fs1()
                this.Fs = MW.Fs()
                this.rho = MW.rho()
                this.rho_b = MW.rho_b()
                
                this.propsParams = MW.propsParams()
                this.flexureParams = MW.flexureParams()
                this.axialParams = MW.axialParams()
                this.shearParams = MW.shearParams()

                let Mmax = this.WL*(this.rebarSpa/12)*Math.pow(this.h,2)/8
                this.Ie = I_effective({M:Mmax, Mcr:this.Mcr, Ig:this.Ig, Icr:this.Icr})

                this.BA = singleCantileverUniformLoad({w : this.WL,L : this.h, a : this.hp, E : this.Em, I : this. Ie})

                this.Mw = this.BA.Ms*(this.rebarSpa/12)
                this.Dw = this.BA.Ds
                this.RB = this.BA.RL
                this.RT = this.BA.RR

                this.Me = (this.DL+this.LL)*this.ew/(2*12)

                this.Pr = (this.DL + this.LL + (this.h/2 + this.hp)*this.wt)*(this.rebarSpa/12)

                if(this.h_t < 24){
                    this.Dp = 0
                    this.Mp = 0
                    this.Mr = this.Mw + this.Me
                    this.Dmax = this.Dw
                }
                else{
                    this.Dp = PDelta_Deflection({M: (this.Mw + this.Me), L: this.h, Mcr: this.Mcr, E: this.Em, Ig: this.Ig, Icr: this.Icr})
                    this.Mp = this.Pr*this.Dp/12
                    this.Mr = this.Mw + this.Me + this.Mp
                    this.Dmax = this.Dw + this.Dp
                }

                this.qmax = this.Pr/this.Ag + (this.Mr*12)/this.S
                this.qmin = this.Pr/this.Ag - (this.Mr*12)/this.S

                this.e = this.Mr*12/(this.Pr*(this.rebarSpa/12))

                this.interaction = _.toNumber(((this.Mr/this.fMn + this.Pr/this.fPn)*100).toFixed(0))
                this.flexure = _.toNumber(((this.Mr/this.fMn)*100).toFixed(0))
                this.axial = _.toNumber(((this.Pr/this.fPn)*100).toFixed(0))

                this.messages = [
                   // {status : MW.Ast() < MW.Asmin(), type : 'warning', title: '', value : 'As < As min'},
                   {status : this.DL < 0, type : 'error', title: 'DL', value : 'Cannot be negative'},
                   {status : this.LL < 0, type : 'error', title: 'LL', value : 'Cannot be negative'},
                   {status : this.WL < 0, type : 'error', title: 'WL', value : 'Cannot be negative'},
                   {status : this.fm < 0, type : 'error', title: 'fm', value : 'Cannot be negative'},
                   {status : this.h < 0, type : 'error', title: 'h', value : 'Cannot be negative'},
                   {status : this.hp < 0, type : 'error', title: 'hp', value : 'Cannot be negative'},
                   {status : this.h_t > 24, type : 'info', title: 'Slender Wall', value : 'h/t > 24'},
                   {status : this.kd > this.tf, type : 'info', title: 'Neutral Axis', value : 'kd > FST'},
                   {status : this.rho >= this.rho_b, type : 'info', title: 'Masonry Capacity Controls', value : `&rho; > &rho;<sub>b</sub>`},
                   {status : this.rho < this.rho_b, type : 'info', title: 'Steel Capacity Controls', value : `&rho; < &rho;<sub>b</sub>`},
                   {status : this.e > this.ea, type : 'info', title: 'Eccentricity', value : 'e > t/6'},
                   {status : Mmax > this.Mcr, type : 'info', title: 'Cracked Deflection', value : 'M > Mcr'},
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