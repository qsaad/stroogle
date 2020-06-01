<template>
    <div>
        <v-tooltip bottom @click="show = !show">
            <v-card hover slot="activator">
                <v-card-text>
                    <span v-bind:style="{ color: fontColor.title, fontSize: fontSize.title + 'px' }" v-html="computedTitle" ></span> 
                    <span v-bind:style="{ color: fontColor.symbol, fontSize: fontSize.title + 'px' }" > : </span>
                    <span v-bind:style="{ color: fontColor.value, fontSize: fontSize.value + 'px' }">{{value.toFixed(decimal)}}</span>
                    <span v-bind:style="{ color: fontColor.unit, fontSize: fontSize.unit + 'px' }">{{unit}}</span>
                </v-card-text>
            </v-card>
            <span>{{tooltip}}</span>
        </v-tooltip>
    </div>
</template>

<script>
export default {
    name:'ValueNumber',
    props:{
        method:{type:String,default:''},
        title:{type:String,default:''},
        symbol:{type:String,default:''},
        subscript:{type:String,default:''},
        superscript:{type:String,default:''},
        value:{type:Number,default:100},
        decimal:{type:Number,default:0},
        unit:{type:String,default:''},
        tooltip:{type:String,default:''},
    },
    data(){
        return{
            window: {
                width: 0,
                height: 0
            },
            fontColor:{
                title : 'black',
                symbol : 'red',
                value : 'blue',
                unit : 'red',
            },
            fontSize:{
                title : 12,
                value : 12,
                unit : 12,
            },
            show : false
        }//RETURN
    },//DATA
    created(){
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
    },//CREATED
    mounted(){
        
    },//MOUNTED
    computed:{
       computedTitle(){
           if(this.method != ''){
               return (this.method=='LRFD') ?  '&phi;' + this.title + '<sub>' + this.subscript + '</sub>' : this.title + '<sub>' + this.subscript + '</sub>' + '/'+'&Omega;'
           }
           else{
               return this.symbol + this.title + '<sub>' + this.subscript + '</sub>' + '<sup>' + this.superscript + '</sup>'
           }
       },//COMBINED TITLE
    },//COMPUTED
    methods:{
        handleResize(){
            this.window.width = window.innerWidth
            this.window.height = window.innerHeight

            switch(true){
                case (this.window.width < 600) :
                    this.fontSize.title = 28
                    this.fontSize.value = 28
                    this.fontSize.unit = 16
                    return  this.fontSize 
                case (this.window.width < 950) :
                    this.fontSize.title = 30
                    this.fontSize.value = 30
                    this.fontSize.unit = 18
                    return  this.fontSize 
                case (this.window.width < 1300) :
                    this.fontSize.title = 32
                    this.fontSize.value = 32
                    this.fontSize.unit = 20
                    return  this.fontSize 
                case (this.window.width < 1750) :
                    this.fontSize.title = 34
                    this.fontSize.value = 34
                    this.fontSize.unit = 22
                    return  this.fontSize 
                case (this.window.width > 1750) :
                    this.fontSize.title = 36
                    this.fontSize.value = 36
                    this.fontSize.unit = 24
                    return  this.fontSize 
            }//SWITCH  
        },//HANDLE RESIZE
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


