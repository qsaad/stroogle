<template>
    <div>
        <v-line 
            :config="{
                points: [xo,yo,xo+length,yo+height],
                stroke: 'green',
                strokeWidth: 5,
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
        length : {type:Number,default:10},
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


