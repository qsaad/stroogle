<template>
    <div>
        <v-circle 
            :config="{
                x: xo,
                y: yo,
                radius: radius,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 1
            }"
        >
        </v-circle>
    </div>
</template>

<script>


export default {
    name:'KonvaText',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        radius: {type:Number,default:3},
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


