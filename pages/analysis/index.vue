<template>
    <v-container grid-list-md text-xs-center class="pt-2 px-0 pb-0 ma-0">  
        <module-list :root="root" :pagesList="pagesList"></module-list>
    </v-container>
</template>

<script>
import ModuleList from '@/components/ModuleList.vue'
import _ from 'lodash'

export default {
    middleware: ['auth'],
    components:{
            ModuleList
    },//COMPONENTS
    data(){
        return{
            root : 'analysis'
        }//RETURN
    },//DATA
    head(){
        return {
            title: 'Analysis Modules',
            meta: [
                { hid: 'description', name: 'description', content: 'Analysis Modules' }
            ]
        }
    },//HEAD
    asyncData({store}){
       return {pagesList : store.state.pagesList}
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
