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
                                <!-- AXIAL --> 
                                <konva-arrow :xo="0.5*width" :yo="0.05*height" :length="30" :rotation="0"></konva-arrow>
                                <konva-label :xo="0.52*width" :yo="0.07*height" :text="P" :unit="'k'" :name="'P'" :pointer="'left'" @selected-text="edit"></konva-label>
                                <!-- MOMENT --> 
                                <konva-label :xo="0.35*width" :yo="0.11*height" :text="M" :unit="'k-ft'" :name="'M'" :pointer="'right'" @selected-text="edit"></konva-label>
                                <!-- SHEAR --> 
                                <konva-arrow :xo="0.68*width" :yo="0.15*height" :length="30" :rotation="90"></konva-arrow>
                                <konva-label :xo="0.70*width" :yo="0.15*height" :text="V" :unit="'k'" :name="'V'" :pointer="'up'" @selected-text="edit"></konva-label>

                                <!-- PIER --> 
                                <konva-rect :xo="0.425*width" :yo="0.15*height" :width="0.15*width" :height="0.2*width"></konva-rect>
                                <konva-label :xo="0.8*width" :yo="0.35*height" :text="H" :unit="'ft'" :name="'H'" :pointer="'left'" @selected-text="edit"></konva-label>
                                <!-- BASE -->
                                <konva-rect :xo="0.25*width" :yo="0.35*height" :width="0.5*width" :height="0.18*width"></konva-rect>
                                <konva-label :xo="0.5*width" :yo="0.53*height" :text="L" :unit="'ft'" :name="'L'" :pointer="'up'" @selected-text="edit"></konva-label>
                            
                                <!-- PRESSURE -->
                                <konva-plot-stress :xo="0.25*width" :yo="0.77*height" :length="0.5*width" :q1="qmax" :q2="qmin" :SF="5"></konva-plot-stress>
                                <konva-text :xo="0.05*width" :yo="0.77*height" :text="qmax" :unit="'ksf'"></konva-text>
                                <konva-text :xo="0.8*width" :yo="0.77*height" :text="qmin" :unit="'ksf'"></konva-text>
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
                        <v-text-field label="L" flat outline v-model.number="L" suffix="ft" v-if="isEdit == 'L'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="B" flat outline v-model.number="B" suffix="ft" v-if="isEdit == 'L'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="H" flat outline v-model.number="H" suffix="ft" v-if="isEdit == 'H'" class="pa-0 ma-0"></v-text-field>
                    
                        <v-text-field label="P" flat outline v-model.number="P" suffix="k" v-if="isEdit == 'P'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="M" flat outline v-model.number="M" suffix="k-ft" v-if="isEdit == 'M'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="V" flat outline v-model.number="V" suffix="k" v-if="isEdit == 'V'" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>

        </v-layout>
 
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- MESSAGES -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center>
            <message-list :messages="messages"></message-list>
            <!-- <v-flex xs12 v-for="(item,key) in messages" :key="key">
                    <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
            </v-flex> -->
        </v-layout>
          <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- CALCULATIONS -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center>
            <v-flex xs12 >
                <v-card>
                    <v-card-text class="pa-0 ma-0">
                        <table>
                            <tr class="text-xs-center">
                                <th col="3">CALCULATION</th>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">e</td>
                                <td width="70%" align="left" style="margin-left: 5px">{{e.toFixed(2)}} in</td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">e/6</td>
                                <td width="70%" align="left" style="margin-left: 5px">{{(e/6).toFixed(2)}} in</td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">y</td>
                                <td width="70%" align="left" style="margin-left: 5px">{{y.toFixed(2)}} ft</td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                          
                        </table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>

        </module-card>
</template>

<script>
    import BasePressure from '@/classes/analysis/clsBasePressure'
    import {deciToFrac} from '@/library/functions'
    
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import MessageList from '@/components/MessageList.vue'

    import KonvaRect from '@/components/KonvaRect.vue'
    import KonvaLabel from '@/components/KonvaLabel.vue'
    import KonvaArrow from '@/components/KonvaArrow.vue'
    import KonvaText from '@/components/KonvaText.vue'
    import KonvaPlotStress from '@/components/KonvaPlotStress.vue'
    

    import {graphics} from '@/mixins/graphicsMixin'

    import _ from 'lodash'

    export default {
        components:{
                ModuleCard, ValueNumber, ValueParameter, MessageList,
                KonvaRect, KonvaLabel, KonvaArrow, KonvaText, KonvaPlotStress
            },//COMPONENTS
        mixins : [graphics],
        data(){
            return{
                // width : 350,
                // height : 350,
                L: 6,
                B: 6,
                H : 0,
                P : 45,
                M : 14,
                V : 0,

                qmax : 0,
                qmin : 0,
                e : 0,
                y : 0,

                isEdit: 'P',

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
                // this.configKonva.width = this.width
                // this.configKonva.height = this.height

                let inputData = {
                    L : this.L,
                    B : this.B,
                    H : this.H,
                    P : this.P,
                    M : this.M,
                    V : this.V,
                }

                let BP = new BasePressure(inputData)

                this.qmax = BP.qmax()
                this.qmin = BP.qmin()
                this.y = BP.Y()

                this.e = BP.e()

                this.messages = [
                    {status : this.L < 2, type : 'error', title: 'Length', value : 'Too Small'},
                ]

            },

        },//COMPUTED
        methods:{
            rectPath({xo=0, yo=0, h=100, w=50}){
                let path = ''
                path = `M${xo},${yo} h${-w/2} v${h} h${w} v${-h} Z`
                return path
            },
            pressurePath({xo=0, yo=0, hmax=100,hmin=30, w=50, y=6, L=6}){
                let path = ''
                let SF = 10
                if(y > 0){
                    path = `M${xo + w/2},${yo} h${-w} v${hmax*SF} l${3*y*SF},${-hmax*SF}`
                }
                else{
                    path = `M${xo + w/2},${yo} h${-w} v${hmax*SF} l${w},${-(hmax-hmin)*SF} Z`
                }
                
                return path
            }
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>
table {
        
    border-collapse: collapse;
    width: 100%;
    }

    table, th, td {
        border-bottom: 1px solid #ddd;
    /* border: 1px solid black; */
        padding-top: 5px;
        padding-bottom: 5px;
    }

.axial:hover {
  stroke: red;
  stroke-width : 3
}

</style>