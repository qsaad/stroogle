<template>
    <div>
        <v-arrow 
            :config="{
                x: xo,
                y: yo,
                points: computedPoints,
                pointerLength: 5,
                pointerWidth: 4,
                fill: 'green',
                stroke: 'green',
                strokeWidth: 4
            }"
        >
        </v-arrow>
    </div>
</template>

<script>


export default {
    name:'KonvaArrow',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        length : {type:Number,default:0},
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
        computedPoints(){
            switch(true){
                case (this.rotation == 0) : 
                    return [0, 0, 0, this.length]
                    break
                case (this.rotation ==  90) : 
                    return [0, 0, -this.length, 0]
                    break
                case (this.rotation == 180) : 
                    return [0, 0, this.length, 0]
                    break
                case (this.rotation == 270) : 
                    return [0, 0, 0, -this.length]
                    break

            }
        }
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


