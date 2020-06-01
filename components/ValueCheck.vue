<template>
    <div>
        <v-tooltip bottom @click="show = !show">
            <v-card hover slot="activator">
                <v-card-text :class="computedColor">
                    <v-layout row wrap>
                        <v-flex xs3>
                            <span v-bind:style="{ fontSize: fontSize.title + 'px' }" class="black--text font-weight-bold" v-html="computedTitle"></span>
                        </v-flex>
                        <v-flex xs2>
                            <span v-bind:style="{ fontSize: fontSize.value + 'px' }">{{actual.toFixed(decimal)}}</span>
                        </v-flex>
                        <v-flex xs1>
                            <span v-bind:style="{ fontSize: fontSize.title + 'px' }" v-if="actual < allowable"> &lt; </span>
                            <span v-bind:style="{ fontSize: fontSize.title + 'px' }" v-else> &gt; </span>
                        </v-flex>
                        <v-flex xs2>
                            <span v-bind:style="{ fontSize: fontSize.value + 'px' }">{{allowable.toFixed(decimal)}}</span>
                        </v-flex>
                        <v-flex xs1>
                            <span v-bind:style="{ fontSize: fontSize.title + 'px' }" v-if="actual < allowable"> ok </span>
                            <span v-bind:style="{ fontSize: fontSize.title + 'px' }" v-else> fails </span>
                        </v-flex>
                        <v-flex xs3>
                            <span v-bind:style="{ fontSize: fontSize.title + 'px' }" class="black--text font-weight-bold"> {{computedPercentage}} </span>
                        </v-flex>
                    </v-layout>
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
        actual:{type:Number,default:0},
        allowable:{type:Number,default:0},
        decimal:{type:Number,default:0},
        title:{type:String,default:''},
        symbol:{type:String,default:''},
        subscript:{type:String,default:''},
        superscript:{type:String,default:''},
        tooltip:{type:String,default:''},
    },
    data(){
        return{
            window: {
                width: 0,
                height: 0
            },
            fontSize:{
                title : 12,
                value : 12,
                unit : 12,
            },
            show : false,
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
            let ratio = this.actual/this.allowable
            switch(true){
                case ratio <= 0.9 :
                    return 'okClass'
                    break
                case ratio <= 1 :
                    return 'warningClass'
                    break
                case ratio > 1 :
                    return 'failClass'
                    break
            }
            //return (this.actual < this.allowable) ? 'okClass' : 'failClass'
        },//BACKGROUND AND TEXT COLOR
        computedTitle(){
            return this.symbol + this.title + '<sub>' + this.subscript + '</sub>' + '<sup>' + this.superscript + '</sup>'
        },//COMBINED TITLE
        computedPercentage(){
            return ((this.actual/this.allowable)*100).toFixed(0) + '%'
        }
    },//COMPUTED
    methods:{
        handleResize(){
            this.window.width = window.innerWidth
            this.window.height = window.innerHeight

            switch(true){
                case (this.window.width < 600) :
                    this.fontSize.title = 14
                    this.fontSize.value = 14
                    this.fontSize.unit = 10
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
.okClass  {
    background-color : white;
    color : blue;
}
.warningClass  {
    background-color : orange;
    color : white;
}
.failClass  {
    background-color :red;
    color : white;
}
</style>


