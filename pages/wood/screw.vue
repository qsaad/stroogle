<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Type" :items="categoryList" v-model="category" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Shear Plane" :items="shearPlaneList" v-model="shearPlane" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="ts (in)" v-model="ts" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="tm (in)" v-model="tm" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Gs " v-model="Gs" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Gm " v-model="Gm" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Moisture" :items="moistureList" v-model="moisture" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Temperature" :items="temperatureList" v-model="temperature" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Duration" :items="durationList" v-model="duration" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <!-- <v-combobox label="Toe Nail" :items="toenailList" v-model="toenail" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="End Grain" :items="endgrainList" v-model="endgrain" class="pa-0 ma-0"></v-combobox> -->
                        <v-combobox label="Nail Direction" :items="directionList" v-model="direction" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            {{design}}
             <v-flex xs12>
                <v-tabs fixed-tabs>
                    <v-tab ripple>Capacities</v-tab>
                    <v-tab ripple>Factors</v-tab>
                    <v-tab ripple>Parameters</v-tab>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="Z" subscript="n" superscript="''" :value="fZn"  :decimal=0 unit="lb" tooltip="Shear Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="W" subscript="n" superscript="''" :value="fWn"  :decimal=0 unit="lb" tooltip="Withdrawal Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-layout row wrap justify-center>
                                            <v-flex xs12 v-for="(item,key) in messages" :key="key">
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
                               <table>
                                    <tr>
                                        <th v-for="(v,k) in headers" :key="k" v-html="v.text"></th>
                                    </tr>
                                    <tr v-for="(v,k) in adjustmentFactors" :key="k">
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
                    </v-tab-item>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                              <v-layout row wrap>
                                    <v-flex xs4 v-for="(value,key) in params" :key="key"> 
                                        <value-parameter :title=key :value=value :decimal=2 unit=""></value-parameter>
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

    import {wood} from '@/mixins/woodMixin'

    import Screw from '@/classes/wood/clsScrew'
    import * as WoodScrews from '@/data/wood/WoodScrews'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage
            },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                categoryList :['Wood to Wood','Metal to Wood','Panel to Wood'],
                category : 'Wood to Wood',
                typeList :['Wood Screws'],
                type : 'Wood Screws',
                sizeList:[],
                size :'10d',
                directionList :['Side','Toenail','Endgrain'],
                direction : 'Side',
                ts : 1.5,
                tm : 1.5,
                Gs : 0.5,
                Gm : 0.5,
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
            _.forEach(WoodScrews.List,item =>{
                this.sizeList.push(item)
            }) 
        },//MOUNTED
        computed:{
             sizeItems(){
                this.sizeList = []
                switch(this.type){
                    case ('Wood Screws'):
                        _.forEach(WoodScrews.List,item =>this.sizeList.push(item)) 
                        this.size = '#8 x 4'
                        break
                }
                return _.map(this.sizeList, 'size')
            },//ITEMS
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

                let S = new Screw(inputData)

                this.params = S.params()
                this.fZn = S.fZn()
                this.fWn = S.fWn()

                this.adjustmentFactors = S.adjustmentFactors()

                //MESSAGES
                this.messages = [
                    {status : S.p() < 6 * S.D ? true : false, type : 'warning', title: 'Inadequate Penetration', value : 'p < 6D'},
                    {status : S.p() < 10 * S.D ? true : false, type : 'warning', title: 'Partial Penetration', value : 'p < 10D'},
                ]
            }//DESIGN
        },//COMPUTED
        methods:{
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
