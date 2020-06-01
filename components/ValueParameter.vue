<template>
    <v-card hover>
        <v-card-text>
            <!-- <span v-bind:style="{ color: fontColor.title, fontSize: fontSize.title + 'px' }" v-html="computedTitle" ></span> 
            <span v-bind:style="{ color: fontColor.symbol, fontSize: fontSize.title + 'px' }" > : </span>  -->
            <!-- <span v-bind:style="{ color: fontColor.value, fontSize: fontSize.value + 'px' }">{{value.toFixed(decimal)}}</span> -->
            <!-- <span v-bind:style="{ color: fontColor.value, fontSize: fontSize.value + 'px' }">{{computedValue}}</span>
            <span v-bind:style="{ color: fontColor.unit, fontSize: fontSize.unit + 'px' }">{{unit}}</span> -->
        <v-layout row>
            <v-flex xs5 v-bind:style="{ color: fontColor.title, fontSize: fontSize.title + 'px' }" v-html="computedTitle">

            </v-flex>
            <v-flex xs4 v-bind:style="{ color: fontColor.value, fontSize: fontSize.value + 'px' }">
                {{computedValue}}
            </v-flex>
            <v-flex xs3 v-bind:style="{ color: fontColor.unit, fontSize: fontSize.unit + 'px' }">
                {{unit}}
            </v-flex>
        </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
import _ from 'lodash'

export default {
    middleware: [],
    name:'ValueParameter',
    props:{
        method:{type:String,default:''},
        title:{type:String,default:''},
        symbol:{type:String,default:''},
        subscript:{type:String,default:''},
        superscript:{type:String,default:''},
        value:{type:[Number,String],default:100,},
        unit:{type:String,default:''},
        decimal:{type:Number,default:0},
    }, 
    data(){
        return{
            window: {
                width: 0,
                height: 0
            },
            fontColor:{
                title : 'teal',
                symbol : 'teal',
                value : 'teal',
                unit : 'teal',
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
        computedValue(){
            let val = this.value
            return _.isString(val) ?  val : val.toFixed(this.decimal)
        },
        computedTitle(){
           if(this.method != ''){
               return (this.method=='LRFD') ?  '&phi;' + this.title + '<sub>' +this.subscript + '</sub>' : this.title + '<sub>' + this.subscript + '</sub>' + '/'+'&Omega;'
           }
           else{
               return this.symbol + this.title + '<sub>' + this.subscript + '</sub>'
           }
       }
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
            }//SWITCH   
        },//HANDLE RESIZE
        textResize(){

        }
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


