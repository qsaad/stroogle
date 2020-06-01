<template>
        <module-card :root="root" :title="title">
            1
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
        data(){
            return{
               
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

</style>