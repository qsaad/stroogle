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
                    {title : 'Floor Framing Notes', description:'',  completed : false},
                    {title : 'Floor Framing Type', description:'',  completed : false},
                    {title : 'Floor Elevation', description:'',  completed : false},
                    {title : 'Grids and Dimensions', description:'',  completed : false},
                    {title : 'Edge of Slab', description:'',  completed : false},
                    {title : 'Framing Size and elevation', description:'',  completed : false},
                    {title : 'Lateral load system', description:'',  completed : false},
                    {title : 'Floor openings', description:'',  completed : false},
                    {title : 'Key Plan', description:'',  completed : false},
                    {title : 'North Arrow', description:'',  completed : false},
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