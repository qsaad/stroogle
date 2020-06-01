<template>
    <div>
        {{render}}
        <v-group  @click="$emit('selected-text', name)" @touchstart="$emit('selected-text', name)">
            <v-circle :config="configCircle" > </v-circle>
            <v-text :config="configText"></v-text>
        </v-group>
    </div>
</template>

<script>


export default {
    name:'KonvaAddPointLoad',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        name : {type:String,default:''},
    },
    data(){
        return{
            configCircle : {
                x : '',
                y : '',
                radius: 20,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 4
            },
            configText : {
                text: '+P',
                fontSize: 16,
                fontStyle: 'bold',
                padding: 4,
                fill: 'white',
            }
           
        }//RETURN
    },//DATA
    created(){
       
    },//CREATED
    mounted(){
        
    },//MOUNTED
    computed:{
       render(){
            this.configCircle.x = this.xo
            this.configCircle.y = this.yo

            this.configText.x = this.xo-15
            this.configText.y = this.yo-11
           
       }//RENDER TEXT

          
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


