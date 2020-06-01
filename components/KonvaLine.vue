<template>
    <div>
        <v-line 
            :config="{
                points: [xo,yo,xo+x,yo+y],
                stroke: 'black',
                strokeWidth: 3,
                lineCap: 'round',
                lineJoin: 'round'
            }"
        >
        </v-line>
    </div>
</template>

<script>


export default {
    name:'KonvaSpan',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        x : {type:Number,default:10},
        y : {type:Number,default:0},
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


