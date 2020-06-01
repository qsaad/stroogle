<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="V (mph)" v-model="V" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Exposure" :items="exposureList" v-model="exposure" class="pa-0 ma-0"></v-select>
                        <v-select label="Internal Pressure" :items="internalPressureList" v-model="internalPressure" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="h (ft)" v-model="z" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="L (ft)" v-model="L" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="B (ft)" v-model="B" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs6 md2>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Slope (Deg)" v-model="slope" class="pa-0 ma-0"></v-text-field>
                        <v-select label="Load Case" :items="loadCaseList" v-model="loadCase" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-img src="../images/wind/wind-mwfrslowrise.svg" max-width=200 ></v-img>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          {{calculate}}
            <v-flex xs12 md12>
                <v-container grid-list-md fluid class="pa-0">
                    <v-flex xs12 class="text-xs-left title blue--text">Wall Pressure</v-flex>
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3 v-for="(value, key) in wall" :key="key">
                            <v-card light hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs6 class="body-1 font-weight-thin black--text">{{key}}</v-flex>
                                        <v-flex xs6 class="body-1 font-weight-thin red--text">{{value | dp2}}</v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex xs12>
                <v-container grid-list-md fluid class="pa-0">
                    <v-flex xs12 class="text-xs-left title blue--text">Roof Pressure</v-flex>
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3 v-for="(value, key) in roof" :key="key">
                            <v-card light hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs6 class="body-1 font-weight-thin black--text">{{key}}</v-flex>
                                        <v-flex xs6 class="body-1 font-weight-thin red--text">{{value | dp2}}</v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex xs12>
                <v-container grid-list-md fluid class="pa-0">
                    <v-layout row wrap justify-center>
                        <v-flex xs12 class="title blue--text">Parameters</v-flex>
                        <v-flex xs6 sm4 md3 v-for="(item,key) in parameters" :key="key">
                            <v-card light hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between class="body-1 font-weight-thin teal--text">
                                        <v-flex class="pa-1 ma-0 text-sm-center text-xs-left" v-html="item.name"></v-flex>
                                        <v-flex class="pa-1 ma-0 text-xs-center">{{ item.value | dp2 }}</v-flex>
                                        <v-flex class="pa-1 ma-0 text-sm-center text-xs-right" v-html="item.unit"></v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
                </v-flex>
            
         </v-layout>
    </module-card>
</template>

<script>
    import Wind from '@/classes/wind/clsWind'
    import MwfrsLowrise from '@/classes/wind/ClsMwfrsLowrise'
    import filters from '@/mixins/filters'

    import ModuleCard from '@/components/ModuleCard.vue'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard
            },//COMPONENTS
        mixins : [filters],
        data(){
            return{
                V:115,
                z:15,
                exposureList : ['B','C','D'],
                exposure : 'B',
                internalPressureList : ['Partial','Enclosed'],
                internalPressure : 'Enclosed',
                L : 100,
                B : 50,
                slope : 2,
                loadCaseList : ['A','B'],
                loadCase : 'A',

                wall : [],
                roof : [],
                parameters : []
            
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
                    V : this.V,
                    exposure : this.exposure,
                    z : this.z,
                    L : this.L,
                    B : this. B,
                    slope : this.slope,
                    internalPressure : this.internalPressure
                }

                let WL = new MwfrsLowrise(inputData)

                this.wall = this.loadCase == 'A' ? WL.wall_A() : WL.wall_B()
                this.roof = this.loadCase == 'A' ? WL.roof_A() : WL.roof_B()

                this.parameters = [
                    { name : "K<sub>Z</sub>", value : (WL.Kz).toFixed(2), unit : ''},
                    { name : "a", value : (WL.a).toFixed(2), unit : 'ft'},
                ]


            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>