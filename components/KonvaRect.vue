<template>
    <div>
        <v-rect 
            :config="{
                x : xo,
                y : yo,
                width : width,
                height : height,
                rotation : rotation,
                stroke: '#333',
                strokeWidth : 3,
                fill : '#fff'
            }"
        >
        </v-rect>
    </div>
</template>

<script>


export default {
    name:'KonvaRect',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        width : {type:Number,default:10},
        height : {type:Number,default:10},
        rotation : {type:Number,default:0},
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
        
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


