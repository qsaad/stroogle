<template>
    <div>
        <v-text 
            v-if="symbol != ''"
            :config="{
                fontSize: 16,
                fontFamily: 'Calibri',
                fontStyle : 'Bold',
                fill: 'black',
                x : xo-27,
                y : yo,
                text : symbol + ' : ',
                rotation : rotation
            }"
        >
        </v-text>
        <v-text 
            :config="{
                fontSize: 16,
                fontFamily: 'Calibri',
                fontStyle : 'Bold',
                fill: 'red',
                x : xo,
                y : yo,
                text : computedText,
                rotation : rotation
            }"
        >
        </v-text>
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
        name : {type:String,default:''},
        symbol : {type:String,default:''},
        text : {type:Number,default:0},
        unit : {type:String,default:''},
        rotation : {type:Number,default:0},
        decimal : {type:Number,default:2},
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
        computedText(){
            return this.text == '' ? this.text + ' ' + this.unit :  (this.text).toFixed(this.decimal) + ' ' + this.unit
        },
   
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


