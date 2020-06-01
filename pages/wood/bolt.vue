<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">FASTENER</p>
                        <v-combobox label="Type" :items="categoryList" v-model="category" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="No Rows" v-model="noRow" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="No Columns" v-model="noCol" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Row Spacing (in)" v-model="rowSpa" class="pa-0 ma-0" v-if="noRow > 1"></v-text-field>
                        <v-text-field label="Col Spacing (in)" v-model="colSpa" class="pa-0 ma-0" v-if="noCol > 1"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">SIDE MBR</p>
                        <v-text-field label="ts (in)" v-model="ts" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="bs (in)" v-model="bs" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Gs " v-model="Gs" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Es (psi)" v-model="Es" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="theta_s (deg)" v-model="theta_s" class="pa-0 ma-0"></v-text-field>
                        <!-- <v-text-field label="Edge Dist (in)" v-model="edge_s" class="pa-0 ma-0"></v-text-field> -->
                        <v-text-field label="End Dist (in)" v-model="end_s" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3 v-if="category !='Wood to Concrete'">
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">MAIN MBR</p>
                        <v-text-field label="tm (in)" v-model="tm" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="bm (in)" v-model="bm" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Gm " v-model="Gm" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Em (psi)" v-model="Em" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="theta_m (deg)" v-model="theta_m" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Edge Dist (in)" v-model="edge_m" class="pa-0 ma-0" v-if="theta_m == 90"></v-text-field>
                        <v-text-field label="End Dist (in)" v-model="end_m" class="pa-0 ma-0" v-else></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <p class="text-xs-left title">PARAMETERS</p>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Shear Plane" :items="shearPlaneList" v-model="shearPlane" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Moisture" :items="moistureList" v-model="moisture" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Temperature" :items="temperatureList" v-model="temperature" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Duration" :items="durationList" v-model="duration" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            {{design}}
             <v-flex xs12>
                <v-tabs fixed-tabs>
                    <v-tab ripple>Capacities</v-tab>
                    <v-tab ripple>Factors</v-tab>
                    <v-tab ripple>Parameters</v-tab>
                    <v-tab ripple>Spacing</v-tab>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="Z" subscript="n" superscript="''" :value="fZn"  :decimal=0 unit="lb" tooltip="Shear Capacity"></value-number>
                                    </v-flex>
                                    <v-flex xs6 v-if="type == 'Lag Bolts'"> 
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
                                        <td>{{v.Cg == 0 ? "-" : v.Cg.toFixed(2)}}</td>
                                        <td>{{v.C_delta == 0 ? "-" : v.C_delta.toFixed(2)}}</td>
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
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                              <v-layout row wrap>
                                    <v-flex> Parallel to Grain</v-flex>
                                    <v-flex xs4 v-for="(value,key) in spacing_par" :key="key"> 
                                        <value-parameter :title=key :value=value :decimal=2 unit=""></value-parameter>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>

                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex>Perpendicular to Grain</v-flex>
                                    <v-flex xs4 v-for="(value,key) in spacing_per" :key="key"> 
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
    
    import Bolt from '@/classes/wood/clsBolt'
    import * as LagBolts from '@/data/wood/LagBolts'
    import * as HexBolts from '@/data/wood/HexBolts'
   
    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage
            },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                categoryList :['Wood to Wood','Metal to Wood','Panel to Wood','Wood to Concrete'],
                category : 'Wood to Wood',
                typeList :['Lag Bolts','Hex Bolts'],
                type : 'Hex Bolts',
                //FASTENER
                sizeList:[],
                size :'3/4',
                //Spa : 4,
                noRow : 1,
                rowSpa : 3,
                noCol : 1,
                colSpa : 4,
               
                //SIDE
                bs : 5.5,
                ts : 1.5,
                Es : 1400000,
                Gs : 0.43,
                theta_s : 0,
                edge_s : 2,
                end_s : 4.5,
                //MAIN
                bm : 9,
                tm : 3.125,
                Em : 1700000,
                Gm : 0.5,
                theta_m : 45,
                edge_m : 4.5,
                end_m : 7,
                
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
                    { text: 'C<sub>g</sub>', value: 'Cg' },
                    { text: 'C<sub>&Delta;</sub>', value: 'C_delta' },
                    { text: 'C<sub>eg</sub>', value: 'Ceg' },
                    { text: 'K<sub>F</sub>', value: 'KF' },
                    { text: '&phi;', sub:'', value: 'phi' },
                    { text: '&lambda;', sub:'', value: 'TE' },
                ],//HEADERS
                adjustmentFactors : [],
                messages : [],
                spacing_par : [],
                spacing_per : []
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
            _.forEach(LagBolts.List,item =>{
                this.sizeList.push(item)
            }) 
        },//MOUNTED
        computed:{
             sizeItems(){
                this.sizeList = []
                switch(this.type){
                    case ('Lag Bolts'):
                        _.forEach(LagBolts.List,item =>this.sizeList.push(item)) 
                        this.size = '1/4 x 2'
                        break
                    case ('Hex Bolts'):
                        _.forEach(HexBolts.List,item =>this.sizeList.push(item)) 
                        this.size = '1'
                        break
                }
                return _.map(this.sizeList, 'size')
            },//ITEMS
            design(){
                let inputData = {
                        //FASTENER
                        category : this.category,
                        type : this.type,
                        size : this.size,
                        noRow : this.noRow,
                        noCol : this.noCol,
                        rowSpa : this.rowSpa,
                        colSpa : this.colSpa,
                       //IDE MEMBER
                        bs : this.bs,
                        ts : this.ts,
                        Gs : this.Gs,
                        Es : this.Es,
                        theta_s : this.theta_s,
                        end_s : this.end_s,
                        //edge_s : this.edge_s,
                        //MAIN MEMBER
                        bm : this.bm,
                        tm : this.tm,
                        Gm : this.Gm,
                        Em : this.Em,
                        theta_m : this.theta_m,
                        end_m : this.end_m,
                        //edge_m : this.edge_m,
                        //PARAMETER
                        method : this.method,
                        shearPlane : this.shearPlane == 'Single' ? 1 : 2,
                        duration : this.duration,
                        moisture : this.moisture,
                        temperature : this.temperature,
                }

                let B = new Bolt(inputData)

                this.fZn = B.fZn()
                this.fWn = B.fWn()
                //MESSAGES
                this.messages = [
                    //{status : B.p() < 6 * B.D ? true : false, type : 'warning', title: 'Inadequate Penetration', value : 'p < 6D'},
                    //{status : B.p() < 10 * B.D ? true : false, type : 'warning', title: 'Partial Penetration', value : 'p < 10D'},
                ]

                this.adjustmentFactors = B.adjustmentFactors()
                this.params = B.params()
                this.spacing_par = B.Spacing_Par()
                this.spacing_per = B.Spacing_Per()
            },//DESIGN
            processHTML(text){
                return 
            }
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
