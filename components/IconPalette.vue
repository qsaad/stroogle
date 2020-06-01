<template>
    <v-container grid-list-xs fluid>
        <v-layout row wrap>
            <v-flex v-for="(item,i) in list" :key="i">
                <v-tooltip bottom>
                    <v-img :src="item.src" :height="height" :width="width"  @click="$emit('iconClick',item.dialog)" transition :alt="item.alt" slot="activator"></v-img>
                    <span>{{item.tooltip}}</span>
                </v-tooltip>
            </v-flex>
           
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name : 'IconPalette',
    components:{
        
    },//COMPONENTS
    props:['list'],
    // props:{
    //     list: {type: Array, default: []},
    // },
    data(){
        return{
                width:30,
                height:30,
                tooltipLocation:'bottom'
        }//RETURN
    },//DATA
       
    created(){
            
    },//CREATED
    mounted(){
            
    },//MOUNTED
    computed:{
        // items(){
        //     return this.list
        // }      
    },//COMPUTED
    methods:{
        imageClick(item){
            return item.dialog = true
        } 
    }//METHODS
}//EXPORT DEFAULT
</script>

<style scoped>

</style>
