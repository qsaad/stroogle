<template>
    <div>
        <v-rect 
            :config="{
                x: xo,
                y: yo,
                width: width,
                height: height,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 2,
                opacity : 0.75,
                rotation : rotation,
            }"  
        >
        </v-rect>
    </div>
</template>

<script>


export default {
    name:'KonvaUniformLoad',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        width : {type:Number,default:0},
        height : {type:Number,default:0},
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


