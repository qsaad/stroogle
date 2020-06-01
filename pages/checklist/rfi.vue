<template>
    <module-card :root="root" :title="title">
        <v-card hover>
            <v-card-text class="pa-2 ma-0">
                <v-list>
                    <v-list-tile v-for="(item,i) in items" :key="i" @click="1">
                        <v-list-tile-action> 
                            <v-checkbox v-model="item.completed"></v-checkbox>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.title" :class="item.completed ? 'completedClass'  : 'incompleteClass'"></v-list-tile-title>
                            <!-- <v-list-tile-sub-title v-html="item.description" :class="item.completed ? 'completedClass'  : 'incompleteClass'"></v-list-tile-sub-title> -->
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-card-text>
        </v-card>
    </module-card>
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
                items : [
                    {title : 'Answer each question', description:'', completed : false},
                    {title : 'Reference Construction Document', description:'',  completed : false},
                    {title : 'Provide Sketch if required', description:'',  completed : false},
                    {title : 'Specify Limit of Applicability', description:'',  completed : false},
                    {title : 'Provide all necessary dimensions', description:'',  completed : false},
                    {title : 'Qualify as Clarification / Omission / Error / Substitution', description:'',  completed : false},
                    {title : 'Solution to Minimum Change Order', description:'',  completed : false},
                    {title : 'Name', description:'',  completed : false},
                    {title : 'Date', description:'',  completed : false},
                    {title : 'Make note of RFI on CA set', description:'',  completed : false},
                ]
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
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>
.completedClass {
    text-decoration: line-through;
    color : gray;
}
.incompleteClass {
    color : black;
}
</style>