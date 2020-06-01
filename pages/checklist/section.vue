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
                    {title : 'Elevation Marker', description:'',  completed : false},
                    {title : 'Specify Anchor', description:'',  completed : false},
                    {title : 'Specify Welds - Field or Shop', description:'', completed : false},
                    {title : 'Specify Rebar size and spacing', description:'',  completed : false},
                    {title : 'Edge of Slab', description:'',  completed : false},
                    {title : 'Floor Framing System', description:'',  completed : false},
                    {title : 'Gravity load transfer', description:'',  completed : false},
                    {title : 'Lateral load transfer', description:'',  completed : false},
                    {title : 'Release non-loading bearing elements', description:'',  completed : false},
                    {title : 'Cladding element attachment', description:'',  completed : false},
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