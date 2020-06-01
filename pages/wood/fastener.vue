<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover>
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Size" :items="sizeItems" v-model="size" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="ts (in)" v-model="ts" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="tm (in)" v-model="tm" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Gs " v-model="Gs" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Gm " v-model="Gm" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md3>
                <v-card hover>
                    <v-card-text class="text-xs-center pa-3">
                        
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
                                
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                              
                            </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                              
                               
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

    import Nail from '@/classes/wood/clsNail'
    import * as NailSize from '@/data/wood/Nails'


    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                typeList :['Common Nails','Wood Screws','Lag bolts'],
                type : 'Common Nails',
                sizeList:[],
                size :'10d',
                ts : 1.5,
                tm : 1.5,
                Gs : 0.5,
                Gm : 0.5
            
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
            _.forEach(NailSize.List,item =>{
                this.sizeList.push(item)
            }) 
        },//MOUNTED
        computed:{
             sizeItems(){
                this.sizeList = []
                switch(this.type){
                    case ('Common Nails'):
                        _.forEach(NailSize.List,item =>this.sizeList.push(item)) 
                        this.size = '10d'
                        break
                    case ('Wood Screws'):
                        _.forEach(NailSize.List,item =>this.sizeList.push(item)) 
                        this.size = '12d'
                        break
                    case ('Lag bolts'):
                        _.forEach(NailSize.List,item =>this.sizeList.push(item)) 
                        this.size = '8d'
                        break
                }
                return _.map(this.sizeList, 'size')
            },//ITEMS
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>