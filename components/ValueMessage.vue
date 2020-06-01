<template>
    <v-card hover :class="computedColor" class="pa-0 ma-0">
        <v-card-text class="pa-0 ma-0">
            <span v-bind:style="{ color: fontColor.title, fontSize: fontSize.title + 'px' }" v-html="title" ></span> 
            <span v-bind:style="{ color: fontColor.symbol, fontSize: fontSize.title + 'px' }" v-if="title !=''"> : </span> 
            <span v-bind:style="{ color: fontColor.value, fontSize: fontSize.value + 'px' }"  v-html="value"></span>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    middleware: [],
    name:'ValueMessage',
    props:{
        title:{type:String,default:''},
        value:{type:[Number,String]},
        type:{type:String,default:100},
    }, 
    data(){
        return{
            window: {
                width: 0,
                height: 0
            },
            fontColor:{
                title : 'white',
                symbol : 'white',
                value : 'white',
            },
            fontSize:{
                title : 12,
                value : 12,
                unit : 12,
            }
        }//RETURN
    },//DATA
    
    created(){
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
    },//CREATED
    mounted(){
        
    },//MOUNTED
    computed:{
        computedColor(){
            switch(this.type){
                case ('success'):
                    return 'successClass'
                    break
                case ('info'):
                    return 'infoClass'
                    break
                case ('warning'):
                    return 'warningClass'
                    break
                case ('error'):
                    return 'errorClass'
                    break
            }//SWITCH
        }//COMPUTED COLOR
       
    },//COMPUTED
    methods:{
        handleResize(){
            this.window.width = window.innerWidth
            this.window.height = window.innerHeight

            switch(true){
                case (this.window.width < 600) :
                    this.fontSize.title = 12
                    this.fontSize.value = 12
                    this.fontSize.unit = 8
                    return  this.fontSize 
                case (this.window.width < 950) :
                    this.fontSize.title = 14
                    this.fontSize.value = 14
                    this.fontSize.unit = 10
                    return  this.fontSize 
                case (this.window.width < 1300) :
                    this.fontSize.title = 16
                    this.fontSize.value = 16
                    this.fontSize.unit = 12
                    return  this.fontSize 
                case (this.window.width < 1750) :
                    this.fontSize.title = 16
                    this.fontSize.value = 16
                    this.fontSize.unit = 12
                    return  this.fontSize 
                case (this.window.width > 1750) :
                    this.fontSize.title = 16
                    this.fontSize.value = 16
                    this.fontSize.unit = 12
                    return  this.fontSize 
            }   
        },//HANDLE RESIZE
        
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>
.successClass  {
    background-color : rgba(0,255,0,0.7);
    color : white;
}
.infoClass  {
    background-color : rgba(0,0,255,0.4);
    color : white;
}
.warningClass  {
    background-color : orange;
}
.errorClass  {
    background-color : rgba(255,0,0,0.7);
    color : black;
}
</style>


