<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 v-for="(item,key) in filteredMessages" :key="key">
            <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
        </v-flex>
    </v-layout>
</template>

<script>
import ValueMessage from '@/components/ValueMessage.vue'

export default {
    name:'ParamsList',
    components:{
        ValueMessage
    },//COMPONENTS
    props:{
        messages:{type:Array,default:[]},
    },
    data(){
        return{
           
        }//RETURN
    },//DATA
    created(){
       
    },//CREATED
    mounted(){
        
    },//MOUNTED
    computed:{
       filteredMessages(){
                return _.filter(this.messages,{status : true})
        },//FILTERED MESSAGES

      
    },//COMPUTED
    methods:{
     
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


