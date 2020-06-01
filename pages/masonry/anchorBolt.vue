<template>
    <module-card :root="root" :title="title">
         <v-layout row wrap justify-center class="pa-0 ma-0">
             <v-flex xs12 md6>
                 <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-0 ma-0">
                        <v-stage :config="{width:width, height:height}">
                            <v-layer ref="layer">
                                <!-- TENSION --> 
                                <konva-arrow :xo="0.325*width + computedDe - 0.01*width + 3" :yo="0.17*height" :length="40" :rotation="270"></konva-arrow>
                                <konva-label :xo="0.325*width + computedDe - 0.01*width + 3" :yo="0.12*height" :text="Tr" :unit="'lb'" :name="'Tr'" :pointer="'left'" @selected-text="edit"></konva-label>
                               
                                <!-- SHEAR --> 
                                <konva-arrow :xo="0.90*width" :yo="0.25*height" :length="50" :rotation="90"></konva-arrow>
                                <konva-label :xo="0.85*width" :yo="0.25*height" :text="Vr" :unit="'lb'" :name="'Vr'" :pointer="'up'" @selected-text="edit"></konva-label>

                                <!-- BLOCK --> 
                                <konva-rect :xo="0.325*width" :yo="0.25*height" :width="0.35*width" :height="computedHb"></konva-rect>
                                <konva-rect :xo="0.325*width" :yo="0.25*height+computedHb" :width="0.35*width" :height="computedHb"></konva-rect>
                                <konva-label :xo="0.7*width" :yo="0.5*height" :text="thickness" :unit="''" :name="'thickness'" :pointer="'left'" @selected-text="edit"></konva-label>
                                
                                <!-- ANCHOR -->
                                <konva-rect :xo="0.325*width + computedDe - 0.01*width" :yo="0.20*height" :width="0.02*width" :height="0.05*width"></konva-rect>
                                <konva-rect :xo="0.325*width + computedDe - 0.02*width" :yo="0.22*height" :width="0.04*width" :height="0.025*width"></konva-rect>
                                <konva-rect :xo="0.325*width + computedDe - 0.01*width" :yo="0.25*height" :width="0.02*width" :height="computedLb"></konva-rect>
                                <konva-label :xo="0.325*width + computedDe" :yo="0.25*height + computedLb/4" :text="anchorSize" :unit="''" :name="'anchorSize'" :pointer="'right'" @selected-text="edit"></konva-label>

                                <!-- EMBEDMENT -->
                                <konva-dim :xo="0.27*width" :yo="0.25*height" :L="computedLb" :rotation="270"></konva-dim>
                                <konva-label :xo="0.27*width" :yo="0.25*height + computedLb/2" :text="Lb" :unit="'in'" :name="'Lb'" :pointer="'right'" @selected-text="edit"></konva-label>
                                
                                <!-- EDGE DISTANCE -->
                                <konva-dim :xo="0.325*width" :yo="0.25*height + computedLb + 5" :L="computedDe + 0.005*width" :rotation="0"></konva-dim>
                                <konva-label :xo="0.325*width + computedDe/2" :yo="0.25*height + computedLb + 5" :text="Le" :unit="'in'" :name="'Le'" :pointer="'up'" @selected-text="edit"></konva-label>
                            
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
                        <v-text-field label="V (lb)" flat outline v-model.number="Vr" v-if="isEdit == 'Vr'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="T (lb)" flat outline v-model.number="Tr" v-if="isEdit == 'Tr'" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Size" flat outline :items="anchorSizeList" v-model="anchorSize" v-if="isEdit == 'anchorSize'" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" flat outline :items="anchorGradeList" v-model.number="anchorGrade" v-if="isEdit == 'anchorSize'" class="pa-0 ma-0"></v-combobox>
                    
                        <v-combobox label="b (in)" flat outline :items="thicknessList" v-model="thickness" v-if="isEdit == 'thickness'" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="fm (psi)" flat outline v-model.number="fm" v-if="isEdit == 'thickness'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lb (in) " flat outline v-model.number="Lb" v-if="isEdit == 'Lb'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Le (in) " flat outline v-model.number="Le" v-if="isEdit == 'Le'" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                 </v-card>
            </v-flex>

        </v-layout>

        <v-layout row wrap justify-center>
            <!-- <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="V (lb)" v-model.number="Vr" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="T (lb)" v-model.number="Tr" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Size" :items="anchorSizeList" v-model="anchorSize" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Fy (ksi)" :items="anchorGradeList" v-model.number="anchorGrade" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="b (in)" :items="thicknessList" v-model="thickness" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="fm (psi)" v-model.number="fm" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Lb (in) " v-model.number="Lb" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Le (in) " v-model.number="Le" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-img src="../images/masonry/masonry-anchorbolt.svg" width=200 ></v-img>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex> -->
           
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
                                            :actual1="Tr"
                                            :allowable1="fTn"
                                            :title1 ="'Flexure'"
                                            :actual2="Vr"
                                            :allowable2="fVn"
                                            :title2 ="'Shear'"
                                            tooltip="Combined Tension + Shear Check"
                                        >
                                        </value-interaction>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="T" :actual="Tr" :allowable="fTn"  :decimal=0 unit="lb" tooltip="Tension Check"></value-check>
                                    </v-flex>
                                    <v-flex xs12> 
                                        <value-check title="V" :actual="Vr" :allowable="fVn"  :decimal=0 unit="lb" tooltip="Shear Check"></value-check>
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

    import KonvaRect from '@/components/KonvaRect.vue'
    import KonvaLabel from '@/components/KonvaLabel.vue'
    import KonvaArrow from '@/components/KonvaArrow.vue'
    import KonvaText from '@/components/KonvaText.vue'
    import KonvaDim from '@/components/KonvaDim.vue'

    import MasonryAnchor from '@/classes/masonry/clsMasonryAnchor'
    import {masonry} from '@/mixins/masonryMixin'
    import {graphics} from '@/mixins/graphicsMixin'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction,
                KonvaRect, KonvaLabel, KonvaArrow, KonvaText,KonvaDim
            },//COMPONENTS
        mixins : [masonry,graphics],
        data(){
            return{
                Tr : 402,
                Vr : 269,
                fm : 2000,
                Lb : 15,
                Le : 3.56,
                messages : [],
                anchorSizeList :["1/4","3/8","1/2","5/8","3/4","7/8","1","1 1/8","1 1/4","1 1/2"],
                anchorSize : "1/2",
                anchorGradeList :[30,36,50],
                anchorGrade : 30,
                paramsList : ['Tension','Shear','Anchor'],
                param : 'Tension',
                anchorParams : [],
                tensionParams : [],
                shearParams : [],

                isEdit : 'Tr'

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
            computedDe(){
                let t = this.thickness-0.625
                let b = 0.35*this.width
                // let d = (t/2 - this.Le)*(b/t)
                // return this.width/2 - d

                return this.Le*(b/t)
            },
            computedHb(){
                let t = this.thickness
                let b = 0.35*this.width
                return 8* (b/t)
            },
            computedLb(){
                let t = this.thickness
                let b = 0.35*this.width
                return this.Lb * (b/t)
            },
            params(){
                switch(this.param){
                    case ('Anchor'):
                        return this.anchorParams
                        break
                    case ('Tension'):
                        return this.tensionParams
                        break
                    case ('Shear'):
                        return this.shearParams
                        break
                }//SWITCH
            },//PARAMS
            calculate(){
                let inputData = {
                    thickness : this.thickness,
                    fm : this.fm,
                    Fyb : this.anchorGrade,
                    anchorSize: this.anchorSize,
                    Lb : this.Lb,
                    Le : this.Le,
                }

                let MA = new MasonryAnchor(inputData)

                this.fTn = MA.Ba()
                this.fVn = MA.Bv()
               
                this.anchorParams = MA.anchorParams()
                this.tensionParams = MA.tensionParams()
                this.shearParams = MA.shearParams()

                this.messages = [
                    {status : this.Lb < 0, type : 'error', title: 'Lb', value : 'Cannot be negative'},
                    {status : this.Le < 0, type : 'error', title: 'Le', value : 'Cannot be negative'},
                    {status : this.fm < 0, type : 'error', title: 'fm', value : 'Cannot be negative'},
                    {status : this.Le <= this.Lb, type : 'info', title: 'Edge Anchor', value : `L<sub>e</sub> < L<sub>b</sub>`},
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