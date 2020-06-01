<template>
    <div >
        <v-group 
            v-for="item in pointLoads" :key="item.id" 
            @click="$emit('delete-point-load', item.id)" 
            @touchstart="$emit('delete-point-load', item.id)"
        >
            <v-arrow
                :config="{
                    id:item.id, 
                    x:xo + (item.a/span)*width, 
                    y:yo, 
                    points: [0, 0, 0, 15],
                    pointerLength: 5,
                    pointerWidth: 4,
                    fill: 'black',
                    stroke: 'black',
                    strokeWidth: 2
                }"
            >
            </v-arrow>
            
            <v-text 
                :config="{
                    x:xo + (item.a/span)*width, 
                    y:yo-12, text:item.P + 'k'
                }"
            >
            </v-text>
        </v-group>
    </div>
</template>

<script>


export default {
    name:'KonvaPointLoad',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        span: {type:Number,default:0},
        width : {type:Number,default:0},
        pointLoads : {type:Array,default:[]},
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


