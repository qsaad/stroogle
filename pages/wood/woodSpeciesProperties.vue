<template>
        <module-card :root="root" :title="title">
            <v-layout row wrap justify-center>
            <v-flex xs6 md6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Select Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Select Section" :items="items" v-model="species" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          
            <v-flex xs12>
                <v-container grid-list-md fluid class="pa-0 mt-3">
                    <v-layout row wrap>
                        <v-flex xs12 v-if="speciesList.length < 0">
                            No List Found
                        </v-flex>
                        <v-flex xs6 sm4 md3 v-else v-for="(value, key) in properties" :key="key">
                            <v-card hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs6 class="body-1 font-weight-thin black--text">{{key}}</v-flex>
                                        <v-flex xs6 class="body-1 font-weight-thin red--text">{{value}}</v-flex>
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
    import * as SawnSpecies from '@/data/WoodSawnSpecies'
    
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueString from '@/components/ValueString.vue'

    import _ from 'lodash'

    export default {
        components:{
                ModuleCard, ValueNumber, ValueString
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                typeList : ['Sawn','Glulam','Engineered'],
                type : 'Sawn',
                speciesList:[],
                species :'DFL#2'
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
            _.forEach(SawnSpecies.List,item =>{
                this.speciesList.push(item)
            }) 
        },//MOUNTED
        computed:{
            items(){
                this.speciesList = []
                switch(this.type){
                    case ('Sawn'):
                        _.forEach(SawnSpecies.List,item =>this.speciesList.push(item)) 
                        break
                    case ('Glulam'):
                        //_.forEach(Data_WT.ShapeList,item =>this.ShapeList.push(item)) 
                        break
                    case ('Engineered'):
                        //_.forEach(Data_HSS.ShapeList,item =>this.ShapeList.push(item)) 
                        break
                }
                return _.map(this.speciesList, 'species')
            },//DATA
            properties(){
                return _.omit(_.find(this.speciesList, {'species': this.species}),['species','name'])
            },//PROPERTIES
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>