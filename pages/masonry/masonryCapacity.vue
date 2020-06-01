<template>
    <module-card :root="root" :title="title">
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- GRAPHICS -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center class="pa-0 ma-0">
             <v-flex xs12 md6>
                 <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-0 ma-0">
                        <v-stage :config="{width:width, height:height}">
                            <v-layer ref="layer">
                                <!-- TOOLBAR -->
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                               <!-- SPAN -->
                                <konva-span :xo="0.15*width" :yo="0.07*height" :length="0.08*width" :height="0"></konva-span>
                                <konva-label :xo="0.13*width" :yo="0.12*height" text="SIZE" :unit="''" :name="'SIZE'" :pointer="''" @selected-text="edit"></konva-label>
                               <!-- SPAN -->
                                <konva-span :xo="0.35*width" :yo="0.07*height" :length="0.08*width" :height="0"></konva-span>
                                <konva-label :xo="0.33*width" :yo="0.12*height" text="LOAD" :unit="''" :name="'LOAD'" :pointer="''" @selected-text="edit"></konva-label>
                                
                                <!-- SPAN -->
                                <konva-span :xo="0.55*width" :yo="0.07*height" :length="0.08*width" :height="0"></konva-span>
                                <konva-label :xo="0.53*width" :yo="0.12*height" text="REBAR" :unit="''" :name="'REBAR'" :pointer="''" @selected-text="edit"></konva-label>

                                <!-- GRAPHICS -->
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                              
                                <!-- SECTION -->
                                <konva-rect :xo="0.10*width" :yo="0.30*height" :width="0.25*width" :height="0.4*height"></konva-rect>
                                <konva-rect :xo="0.13*width" :yo="0.30*height" :width="0.19*width" :height="0.37*height"></konva-rect>
                                <konva-text :xo="0.05*width" :yo="0.5*height" :text="h" :decimal="2" :unit="'in'"></konva-text>
                                <konva-text :xo="0.2*width" :yo="0.75*height" :text="b" :decimal="2" :unit="'in'"></konva-text>
                                <!-- <konva-text :xo="0.15*width" :yo="0.6*height" text="rebarSize" :decimal="0" :unit="''"></konva-text> -->
                                
                               
                                <!-- STRESS DIAGRAM -->
                                <konva-text :xo="0.45*width" :yo="0.25*height" :text="0.8*fm" :decimal="0" :unit="'psi'"></konva-text>
                                <konva-text :xo="0.57*width" :yo="0.35*height" :text="a" :decimal="2" :unit="'in'"></konva-text>
                                <konva-line :xo="0.45*width" :yo="0.30*height" :x="0" :y="0.4*height"></konva-line>
                                <konva-rect :xo="0.45*width" :yo="0.30*height" :width="0.1*width" :height="(c/h)*0.4*height"></konva-rect>
                                <konva-line :xo="0.45*width" :yo="0.70*height" :x="40" :y="0"></konva-line>


                                <!-- STRAIN DIAGRAM -->
                                <konva-text :xo="0.7*width" :yo="0.25*height" :text="0.0025" :decimal="4" :unit="''"></konva-text>
                                <konva-plot-stress :xo="0.8*width" :yo="0.7*height" :length="0.4*height" :rotation="270" :q1="-es*5000" :q2="0.0025*5000" :SF="50"></konva-plot-stress>
                                <konva-text :xo="0.70*width" :yo="0.7*height" :text="es" :decimal="4" :unit="''"></konva-text>

                                <!-- CAPACITY -->
                                <konva-text :xo="0.45*width" :yo="0.85*height" :text="fMn" :decimal="0" :unit="'lb-ft'"></konva-text>
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
                        <v-text-field label="b" flat outline v-model.number="b" suffix="in" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h" flat outline v-model.number="h" suffix="in" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="fm" flat outline v-model.number="fm" suffix="psi" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>

                        <v-text-field label="Rebar Qty " flat outline v-model.number="rebarQty"  v-if="isEdit == 'REBAR'" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Size" flat outline :items="rebarSizeList" v-model="rebarSize"  v-if="isEdit == 'REBAR'" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="cov" flat outline v-model.number="cov" suffix="in" v-if="isEdit == 'REBAR'" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="pa-0 ma-0">
                        
                    </v-card-actions>
                 </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-center align-center>
            <v-flex xs12 md9>
                <output-table :items="flexureParams"></output-table>
            </v-flex>
        </v-layout>
    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import OutputTable from '@/components/OutputTable.vue'

    import KonvaSpan from '@/components/KonvaSpan.vue'
    import KonvaText from '@/components/KonvaText.vue'
    import KonvaLabel from '@/components/KonvaLabel.vue'
    import KonvaArrow from '@/components/KonvaArrow.vue'
    import KonvaRect from '@/components/KonvaRect.vue'
    import KonvaLine from '@/components/KonvaLine.vue'
    import KonvaPlotStress from '@/components/KonvaPlotStress.vue'

    import MasonryCapacity from '@/classes/masonry/clsMasonryCapacity'

    import {graphics} from '@/mixins/graphicsMixin'
    import {masonry} from '@/mixins/masonryMixin'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, OutputTable,
                KonvaPlotStress, KonvaText, KonvaLabel,  
                KonvaArrow, 
                KonvaRect, KonvaLine,KonvaSpan
            },//COMPONENTS
        mixins : [graphics,masonry],
        data(){
            return{
                //INPUT
                b : 7.625,
                h : 16,
                fm : 1500,
                rebarSize : '#4',
                rebarQty : 2,
                cov : 2,
                //OUTPUT
                flexureParams : [],
                fMn : 0,
                es : 0,
                c : 0,
                a : 0,
                
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
                    b : this.b,
                    h : this.h,
                    cov : this.cov,
                    fm : this.fm,
                    rebarSize : this.rebarSize,
                    rebarQty : this.rebarQty
                }

                let MC = new MasonryCapacity(inputData)

                this.flexureParams = MC.flexureParams()

                this.fMn = MC.fMn()
                this.es = MC.esu()

                this.c = MC.c()
                this.a = MC.a()
              
               
            },//CALCULATE

           
           
        
        },//COMPUTED
        methods:{
           
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>