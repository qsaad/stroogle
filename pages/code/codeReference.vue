<template>
    <div>
        <module-card :root="root" :title="title">
            <v-layout row wrap justify-center>
                <v-flex xs12 md12>
                    <v-card hover height="100%">
                        <v-card-text class="text-xs-center pa-3">
                            <v-select label="Year" :items="filteredYearList" v-model="selectedYear"></v-select>
                        </v-card-text>
                    </v-card>
                </v-flex>
                
                <v-flex xs12 md12>
                    <v-card hover v-for="(value, key) in filteredCodeList" :key="key" class="mt-1 mb-1">
                        <v-card-text class="pa-2">
                            <v-layout row space-between align-center>
                                <v-flex xs6 class="body-1 font-weight-thin black--text pa-0">{{key}}</v-flex>
                                <v-flex xs6 class="body-1 font-weight-thin red--text pa-0">{{value}}</v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
               
            </v-layout>
        </module-card>
    </div>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                selectedYear : '2000',
                codes : [
                            {
                                year:'2000',
                                codeList:{
                                    Load:'ASCE 7-98',
                                    Steel :'AISC 1989-ASD',
                                    Concrete :'ACI 318-99',
                                    Masonry :'SEI 530-99',
                                    Wood:'NDS 1997',
                                    Coldform:'AISI 1996',
                                }
                            },
                            {
                                year:'2003',
                                codeList:{
                                    Load:'ASCE 7-02',
                                    Steel:'AISC 1989-ASD',
                                    Concrete:'ACI 318-02',
                                    Masonry:'SEI 530-02',
                                    Wood:'NDS 2001',
                                    Coldform:'AISI 2001',
                                }
                            },
                            {
                                year:'2006',
                                codeList:{
                                    Load:'ASCE 7-05',
                                    Steel:'AISC 360-05',
                                    Concrete:'ACI 318-05',
                                    Masonry:'SEI 530-05',
                                    Wood:'NDS 2005',
                                    Coldform:'AISI 2001',
                                }
                            },
                            {
                                year:'2009',
                                codeList:{
                                    Load:'ASCE 7-05',
                                    Steel:'AISC 360-05',
                                    Concrete:'ACI 318-08',
                                    Masonry:'SEI 530-08',
                                    Wood:'NDS 2008',
                                    Coldform:'AISI S100-07',
                                }
                            },
                            {
                                year:'2012',
                                codeList:{
                                    Load:'ASCE 7-10',
                                    Steel:'AISC 360-10',
                                    Concrete:'ACI 318-11',
                                    Masonry:'SEI 530-11',
                                    Wood:'NDS 2012',
                                    Coldform:'AISI S100-07',
                                }
                            },
                            {
                                year:'2015',
                                codeList:{
                                    Load:'ASCE 7-10',
                                    Steel:'AISC 360-10',
                                    Concrete:'ACI 318-14',
                                    Masonry:'SEI 530-14',
                                    Wood:'NDS 2012',
                                    Coldform:'AISI S100-12',
                                }
                            },
                ],
            
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
            filteredYearList(){
                return _.map(this.codes,'year')
            },

            filteredCodeList(){
                let arr = _.find(this.codes, ['year', this.selectedYear])
                return arr.codeList
                //return JSON.parse(arr.codeList)
            }
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>