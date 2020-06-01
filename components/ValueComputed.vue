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
    name:'ValueComputed',
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
            } //SWITCH  
              
        },//HANDLE RESIZE
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


