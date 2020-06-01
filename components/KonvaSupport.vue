<template>
    <div>
        <v-regular-polygon @click="$emit('selected-text', name)" @touchstart="$emit('selected-text', name)"
            :config="{
                x: xo,
                y: yo,
                sides: 3,
                radius: radius,
                fill: 'green',
                stroke: 'green',
                strokeWidth: 3,
                rotation : rotation
            }"
        ></v-regular-polygon>
    </div>
</template>

<script>

export default {
    name:'KonvaSupport',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        radius : {type:Number,default:10},
        rotation : {type:Number,default:0},
        name : {type:String,default:''},
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


