<template>
    <div>  
        <module-list :root="root" :pagesList="pagesList"></module-list>
    </div>
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
            root : 'seismic'
        }//RETURN
    },//DATA
    head(){
        return {
            title: 'Seismic Modules',
            meta: [
                { hid: 'description', name: 'description', content: 'Seismic Modules' }
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
