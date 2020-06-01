<template>
    <module-card :root="root" :title="title">
    <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- GRAPHICS -->
    <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center class="pa-0 ma-0">
            <v-flex xs12 md6>
                 <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-0 ma-0">
                       <svg :width="width" :height="height">
                            <!-- GRID -->
                            <line v-for="(x,i) in xGrid" :key="i+'x'" x1="0" :y1="x" :x2="width" :y2="x" stroke="blue" stroke-width="0.1"/>
                            <line v-for="(y,i) in yGrid" :key="i+'y'" :x1="y" y1="0" :x2="y" :y2="height" stroke="blue" stroke-width="0.1"/>
                            <!-- AXIS -->
                            <!-- <line x1="0" :y1="height/2" :x2="width" :y2="height/2" stroke="red" stroke-width="1"/>
                            <line :x1="width/2" y1="0" :x2="width/2" :y2="height" stroke="red" stroke-width="1"/> -->
                            <!-- MODIFICATION FACTOR TOOLBAR -->
                            <use xlink:href="/buttons/wood.svg#temperature" x="75" y="0" width="50" height="50" @click="edit('temperature')"/>
                            <use xlink:href="/buttons/wood.svg#moisture" x="125" y="0" width="50" height="50" @click="edit('moisture')"/>
                            <use xlink:href="/buttons/wood.svg#duration" x="175" y="0" width="50" height="50" @click="edit('duration')"/>
                            <use xlink:href="/buttons/wood.svg#method" x="225" y="0" width="50" height="50" @click="edit('method')"/>
                            <!-- SIDE MEMBER --> 
                            <path id="side" :d="memberPath(0.1*width,height/2,-ts,0.6*width)" stroke="black" fill="white" stroke-width="3" @click="edit('Gs')"/>
                                <text x="250" y="145" stroke="blue" @click="edit('ts')">ts : {{ts}} in</text>
                            <!-- MAIN MEMBER -->
                            <path id="main" :d="memberPath(0.3*width,height/2,tm,0.6*width)" stroke="black" fill="white" stroke-width="3" @click="edit('Gm')"/>
                                <text x="20" y="215" stroke="blue" @click="edit('tm')">tm : {{tm}} in</text>
                            <!-- NAIL -->
                            <path id="nail" :d="nailPath({xo:width/2,yo:height/2,ts:ts,ds:D,ls:L,dh:Dh,th:H})" stroke="black" fill="white" stroke-width="1" @click="edit('size')"/>
                            <text x="140" y="65" stroke="blue" @click="edit('size')">NAIL : {{size}} </text>

                            <text x="140" y="340" stroke="blue" >Penetration : {{pd}} </text>
                        </svg>
                        
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- INPUT -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center class="pa-0 ma-0">
            <v-flex xs12 >
                <v-combobox flat single-line outline :items="sizeItems" v-model="size" v-if="isEdit == 'size'" class="pa-0 ma-0"></v-combobox>
                <v-text-field flat single-line outline v-model="ts" suffix="in"  v-if="isEdit == 'ts'" class="pa-0 ma-0"></v-text-field>
                <v-text-field flat single-line outline v-model="tm" suffix="in" v-if="isEdit == 'tm'" class="pa-0 ma-0"></v-text-field>
                <v-text-field flat single-line outline v-model="Gs" v-if="isEdit == 'Gs'" class="pa-0 ma-0"></v-text-field>
                <v-text-field flat single-line outline v-model="Gm" v-if="isEdit == 'Gm'" class="pa-0 ma-0"></v-text-field>
                <v-combobox flat single-line outline :items="temperatureList" v-model="temperature" v-if="isEdit == 'temperature'" class="pa-0 ma-0"></v-combobox>
                <v-combobox flat single-line outline :items="moistureList" v-model="moisture" v-if="isEdit == 'moisture'" class="pa-0 ma-0"></v-combobox>
                <v-combobox flat single-line outline :items="durationList" v-model="duration" v-if="isEdit == 'duration'" class="pa-0 ma-0"></v-combobox>
                <v-combobox flat single-line outline :items="methodList" v-model="method" v-if="isEdit == 'method'" class="pa-0 ma-0"></v-combobox>
            </v-flex>
        </v-layout>
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- OUTPUT -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        {{design}}
        <v-layout row wrap justify-center class="pa-0 ma-0">
            <v-flex xs12 >
                <value-number :method="method" title="Z" subscript="n" superscript="''" :value="fZn"  :decimal=0 unit="lb" tooltip="Shear Capacity"></value-number>
            </v-flex>
        </v-layout>
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- MESSAGES -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center>
            <v-flex xs12 v-for="(item,key) in messages" :key="key">
                    <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
            </v-flex>
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
                                <th v-for="(v,k) in headers" :key="k" v-html="v.text"></th>
                            </tr>
                            <tr v-for="(v,k) in adjustmentFactors" :key="k" class="text-xs-center">
                                <td v-html="v.name"></td>
                                <td>{{v.adjusted.toFixed(0)}}</td>
                                <td>{{v.actual.toFixed(0)}}</td>
                                <td>{{v.CD == 0 ? "-" : v.CD.toFixed(2)}}</td>
                                <td>{{v.CM == 0 ? "-" : v.CM.toFixed(2)}}</td>
                                <td>{{v.Ct == 0 ? "-" : v.Ct.toFixed(2)}}</td>
                                <td>{{v.Ctn == 0 ? "-" : v.Ctn.toFixed(2)}}</td>
                                <td>{{v.Ceg == 0 ? "-" : v.Ceg.toFixed(2)}}</td>
                                <td>{{v.KF == 0 ? "-" : v.KF.toFixed(2)}}</td>
                                <td>{{v.phi == 0 ? "-" : v.phi.toFixed(2)}}</td>
                                <td>{{v.TE == 0 ? "-" : v.TE.toFixed(2)}}</td>
                            </tr>
                        </table>
                    </v-card-text>
                </v-card>
            </v-flex >
            <v-flex xs12 >
                <v-card>
                    <v-card-text class="pa-0 ma-0">
                        <table>
                            <tr class="text-xs-center">
                                <th col="3">CALCULATION</th>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">Nails Size</td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.D}} Dia x {{params.L}}</td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">Penetration</td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.pd}} </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">F<sub>yb</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.Fyb}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">F<sub>es</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.Fes}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">F<sub>em</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.Fem}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">R<sub>e</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.Re}}  </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">R<sub>t</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.Rt}}  </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">k<sub>1</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.k1}}  </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">k<sub>2</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.k2}}  </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">k<sub>3</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.k3}}  </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">K<sub>D</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.KD}}  </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>

                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">I<sub>s</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.Is}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">I<sub>m</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.Im}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">II</td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.II}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">III<sub>s</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.IIIs}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">III<sub>m</sub></td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.IIIm}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                            <tr>
                                <td width="20%" align="left" style="margin-left: 5px">IV</td>
                                <td width="70%" align="left" style="margin-left: 5px">{{params.IV}} psi </td>
                                <td width="10%" align="left" style="margin-left: 5px"></td>
                            </tr>
                        </table>
                    </v-card-text>
                </v-card>

                <!-- <v-layout row wrap>
                    <v-flex xs4 v-for="(value,key) in params" :key="key"> 
                        <value-parameter :title=key :value=value :decimal=2 unit=""></value-parameter>
                    </v-flex>
                </v-layout> -->
            </v-flex>
        </v-layout>
    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'

    import {wood} from '@/mixins/woodMixin'

    import Nail from '@/classes/wood/clsNail'
    import * as CommonNails from '@/data/wood/CommonNails'
    import * as BoxNails from '@/data/wood/BoxNails'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage
            },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                width : 350,
                height : 350,
                panel: [true, true],
                categoryList :['Wood to Wood','Metal to Wood','Panel to Wood'],
                category : 'Wood to Wood',
                typeList :['Common Nails','Box Nails'],
                type : 'Common Nails',
                sizeList:[],
                size :'10d',
                directionList :['Side','Toenail','Endgrain'],
                direction : 'Side',
                ts : 1.5,
                tm : 1.5,
                Gs : 0.5,
                Gm : 0.5,
                L : 0,
                D : 0,
                H : 0,
                Dh : 0,
                params : [],
                fZn : 0,
                fWn : 0,
                headers: [
                    { text: 'Type', value: 'name' },
                    { text: 'Adjusted', value: 'adjusted' },
                    { text: 'Actual', value: 'actual' },
                    { text: 'C<sub>D</sub>', value: 'CD' },
                    { text: 'C<sub>M</sub>', value: 'CM' },
                    { text: 'C<sub>t</sub>', value: 'Ct' },
                    { text: 'C<sub>tn</sub>', value: 'Ctn' },
                    { text: 'C<sub>eg</sub>', value: 'Ceg' },
                    { text: 'K<sub>F</sub>', value: 'KF' },
                    { text: '&phi;', sub:'', value: 'phi' },
                    { text: '&lambda;', sub:'', value: 'TE' },
                ],//HEADERS
                adjustmentFactors : [],
                messages : [],

                isEdit: 'ts',
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
            _.forEach(CommonNails.List,item =>{
                this.sizeList.push(item)
            }) 
        },//MOUNTED
        computed:{
            yGrid(){
    	        return _.range(0,this.width,10)
            },
            xGrid(){
                console.log(_.range(0,this.height,10))
                return _.range(0,this.height,10)
            },
           
            sizeItems(){
                this.sizeList = []
                switch(this.type){
                    case ('Common Nails'):
                        _.forEach(CommonNails.List,item =>this.sizeList.push(item)) 
                        this.size = '10d'
                        break
                    case ('Box Nails'):
                        _.forEach(BoxNails.List,item =>this.sizeList.push(item)) 
                        this.size = '12d'
                        break
                }
                return _.map(this.sizeList, 'size')
            },//ITEMS

            sizeProps(){
                let data = _.filter(this.sizeList, {size : this.size})
                //this.L = data.L
                return data
            },
            design(){
                let inputData = {
                        shearPlane : this.shearPlane == 'Single' ? 1 : 2,
                        category : this.category,
                        type : this.type,
                        method : this.method,
                        size : this.size,
                        duration : this.duration,
                        moisture : this.moisture,
                        temperature : this.temperature,
                        ts : this.ts,
                        tm : this.tm,
                        Gs : this.Gs,
                        Gm : this.Gm,
                        direction : this.direction
                }

                let N = new Nail(inputData)

                this.L = N.L
                this.D = N.D
                this.Dh = 2*N.D
                this.H = N.H
                this.pd = N.pd()

                this.params = N.params()
                this.fZn = N.fZn()
                this.fWn = N.fWn()

                this.adjustmentFactors = N.adjustmentFactors()

                //MESSAGES
                this.messages = [
                    {status : N.p() < 6 * N.D ? true : false, type : 'warning', title: 'Inadequate Penetration', value : 'p < 6D'},
                    {status : N.p() < 10 * N.D ? true : false, type : 'warning', title: 'Partial Penetration', value : 'p < 10D'},
                ]
            }//DESIGN
        },//COMPUTED
        methods:{
            edit(val){
                this.isEdit = val
            },
            memberPath(xo, yo, h, w){
                let path = ''
                let YF = 0
                switch(true){
                    case this.ts < 3 :
                        YF = 30
                        break
                    case this.ts < 4 :
                        YF = 25
                        break
                    case this.ts <= 5 :
                        YF = 20
                        break
                    default :
                        YF = 15
                        break
                }
                path = `M${xo},${yo} h${w} v${h*YF} h${-w} Z`
                return path
            },
            nailPath({xo=0, yo=0,ts=1.5, ds=0.25, ls=4, dh=0.5, th=0.25}){
                let data = this.sizeProps
                
                let YF = 0
                switch(true){
                    case this.ts < 3 :
                        YF = 30
                        break
                    case this.ts < 4 :
                        YF = 25
                        break
                    case this.ts <= 5 :
                        YF = 20
                        break
                    default :
                        YF = 15
                        break
                }
                

                let path = `M${xo},${yo - ts*YF } 
                            h${-dh*YF/2} 
                            v${-th*YF/2} 
                            h${dh*YF} 
                            v${th*YF/2} 
                            h${-(dh/2-ds/2)*YF} 
                            v${0.9*ls*YF} 
                            l${-ds/2*YF},${0.1*ls*YF} 
                            l${-ds/2*YF},${-0.1*ls*YF}
                            v${-0.9*ls*YF}
                            Z`
                return path
            },
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

    

    /* tr:hover {background-color: #f5f5f5;} */

    tr:nth-child(even) {background-color: #f2f2f2;}

</style>
