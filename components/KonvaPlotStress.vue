<template>
    <div>
        <v-path 
            :config="{
                x : xo,
                y : yo,
                data : computedData,
                rotation : rotation,
                stroke: '#0000FF',
                strokeWidth : 1,
                //fill : '#0000FF',
                scale: {
                    x: 1,
                    y: 1
                }
            }"
        >
        </v-path>
    </div>
</template>

<script>


export default {
    name:'KonvaPlotStress',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        rotation : {type:Number,default:0},
        q1 : {type:Number,default:0},
        q2 : {type:Number,default:0},
        length : {type:Number,default:10},
        SF : {type:Number,default:10},
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
        computedData(){
            return `M0,0 v${this.q1} l${this.length},${-(this.q1-this.q2)} v${-this.q2} Z`
        }
   
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


