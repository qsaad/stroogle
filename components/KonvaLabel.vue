<template>
    <div>
        <v-label @click="$emit('selected-text', name)" @touchstart="$emit('selected-text', name)"
            :config="{
                x : xo,
                y : yo,
            }"  
        >
            <v-tag 
                v-if="pointer != ''"
                :config="{
                    fill: '#AA00FF',
                    stroke: '#AA00FF',
                    lineJoin: 'round',
                    pointerDirection: pointer,
                    pointerWidth: 10,
                    pointerHeight: 10,
                    cornerRadius: 2
                }"
            ></v-tag>
            <v-tag 
                v-else
                :config="{
                    fill: '#AA00FF',
                    stroke: '#AA00FF',
                    lineJoin: 'round',
                    cornerRadius: 2
                }"
            ></v-tag>
            <v-text 
                :config="{
                    text: computedText,
                    fontSize: 12,
                    padding: 3,
                    fill: 'white'
                }"
            ></v-text>
        </v-label>
    </div>
</template>

<script>

export default {
    name:'KonvaLabel',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        name : {type:String,default:''},
        text : {type:[Number,String],default:0},
        title : {type:String,default:''},
        decimal : {type:Number,default:2},
        unit : {type:String,default:''},
        pointer : {type:String,default:'up'},
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
            if(this.unit != ''){
                return this.text == '' ? this.title + ' ' + this.text + ' ' + this.unit : this.title + ' ' + (this.text).toFixed(this.decimal) + ' ' + this.unit
            }
            else{
                return this.title + ' ' + this.text
            }
            
        },
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


