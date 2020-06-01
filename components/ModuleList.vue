<template>
    <v-layout row wrap justify-center>
        <v-flex xs12>
            <v-toolbar dark color="teal lighten-4">
                <v-toolbar-title class="black--text">{{capitalizeTitle}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field append-icon="search" label="Search" single-line hide-details clearable v-model="search" color="black" class="mb-1 pb-0"></v-text-field>
                <v-btn icon @click="isList = true">
                    <v-icon color="black">view_headline</v-icon>
                </v-btn>
                <v-btn icon @click="isList = false">
                    <v-icon color="black">apps</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card>
                
            <v-card-text>
                <!-- ++++++++++++++++++++++++++++++++++++++++++++ -->
                <!-- MODULES -->
                <!-- ++++++++++++++++++++++++++++++++++++++++++++ -->
                <v-container grid-list-md fluid class="pa-0 ma-0" v-if="!isList">
                    <v-layout row wrap justify-start align-center>
                        <v-flex v-for="(item,i) in filteredItems" :key="i" xs4 sm3 md2>
                            <v-card hover :class="computedColor(item.active)" height="100%" @click="goto(item)">
                                <v-card-text class="text-xs-center">
                                    <v-layout column justify-center align-center>
                                        <v-img :src="item.image" width=40></v-img>
                                        <v-flex xs12 class="body-2 font-weight-bold black--text text-truncate">
                                            {{item.title}}
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
                
                <!-- ++++++++++++++++++++++++++++++++++++++++++++ -->
                <!-- LIST -->
                <!-- ++++++++++++++++++++++++++++++++++++++++++++ -->
                 <v-container grid-list-md fluid class="pa-0 ma-0" v-else>
                    <v-data-iterator 
                        column 
                        loading
                        :items="items"
                        :rows-per-page-items="rowsPerPageItems"
                        :pagination.sync="pagination"  
                        :search="search"
                    >
                        <v-list two-line slot="item" slot-scope="props" class="pa-0 ma-0">
                            <v-list-tile @click="goto(props.item)" class="pa-0 ma-0">
                                <v-list-tile-avatar color="red" size="30" v-if="props.item.active == true">
                                    <v-icon color="white">check</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-avatar color="teal" size="30" v-else>
                                    <v-icon color="white">close</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{props.item.title}}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{description(props.item.description)}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                <span class="body-2 green--text hidden-xs-only">{{props.item.reference}}</span>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-data-iterator>
                 </v-container>
            </v-card-text>
        </v-card>

        </v-flex>
        
    </v-layout>   
 
</template>

<script>
import _ from 'lodash'

export default {
    name:'ModuleList',
    layout:'default',
    middleware: ['auth'],
    components:{
               
    },//COMPONENTS
    props:['root','pagesList'],
    data(){
        return{
            window: {
                width: 0,
                height: 0
            },
            search : '',
            dialog: false,
            rowsPerPageItems: [5, 10, 15],
            pagination: {
                rowsPerPage: 10
            },
            paginationModules: {
                rowsPerPage: -1
            },
            isList : false,
            list : []
            //root : 'analysis'
        }//RETURN
    },//DATA
    created(){
        window.addEventListener('resize', this.description)
        //this.handleResize()
    },//CREATED
    mounted(){
        
    },//MOUNTED
    computed:{
        items(){
            return _.orderBy(_.filter(this.pagesList,{'category':this.root}),['title','active'],['asc'])
        },//ITEMS
        filteredItems(){
            return  _.orderBy(_.filter(this.pagesList,{'category':this.root}),['title','active'],['asc'])
        },
        capitalizeTitle(){
           return _.upperCase(this.root) + ' MODULES'
       },//CAPITALIZE TITLE
    },//COMPUTED
    methods:{
        computedColor(status){
            return status ? 'activeClass' : 'dormantClass'
        },
        itemCount(){
            let arr = this.items()
            return arr.length
        },
        goto(item){
            this.$router.push({path: '/' + this.root + '/' + item.link}) 
        },//GOTO

        description(text){
            this.window.width = window.innerWidth
            this.window.height = window.innerHeight

            switch(true){
                case (this.window.width < 600) :
                    return  _.truncate(text,{length : 30}) 
                case (this.window.width < 950) :
                    return  _.truncate(text,{length : 40}) 
                case (this.window.width < 1300) :
                    return  text 
                case (this.window.width < 1750) :
                    return  text
                case (this.window.width > 1750) :
                    return  text
            }//SWITCH  
        },//HANDLE RESIZE

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>
.activeClass  {
    background-color : red;
    color : blue;
}
.dormantClass  {
    background-color : rgba(162, 162, 162, 0.3);
    color : white;
}

</style>
