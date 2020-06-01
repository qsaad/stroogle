<template>
    <div>
        <v-line 
            :config="{
                x : xo,
                y : yo,
                points: [0, 0, computedX, computedY],
                stroke: 'black',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
            }"
        >
        </v-line>
        <v-circle
            :config="{
                x: xo,
                y: yo,
                radius: 3,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 1
            }"
        >
        </v-circle>
        <v-circle
            :config="{
                x: xo + computedX,
                y: yo + computedY,
                radius: 3,
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
    name:'KonvaDim',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        L : {type:Number,default:0},
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
        computedX(){
            switch(true){
                case (this.rotation == 0):
                    return this.L
                    break
                case (this.rotation == 90):
                    return 0
                    break
                case (this.rotation == 180):
                    return -this.L
                    break
                case (this.rotation == 270):
                    return 0
                    break
            }
        },
        computedY(){
            switch(true){
                case (this.rotation == 0):
                    return 0
                    break
                case (this.rotation == 90):
                    return -this.L
                    break
                case (this.rotation == 180):
                    return 0
                    break
                case (this.rotation == 270):
                    return this.L
                    break
            }
        },
   
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>