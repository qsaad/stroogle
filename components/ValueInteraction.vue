<template>
    <div>
        <v-tooltip bottom @click="show = !show">
            <v-card hover slot="activator" class="pa-0 ma-0">
                <v-card-text :class="computedColor" class="pa-0 ma-0">
                    <v-layout row wrap class="pa-0 ma-0">
                        <v-flex xs12 class="text-xs-left black--text subheading font-weight-bold pl-2">
                            {{heading}}
                        </v-flex>
                        <v-flex xs3>
                            <v-layout column justify-center align-center fill-height>
                               <v-flex xs3 class="underlineClass pb-0 mb-0">{{ actual1.toFixed(decimal) }}</v-flex>
                               <v-flex xs3 class="pt-0 mt-0">{{ allowable1.toFixed(decimal) }}</v-flex>
                               <v-flex xs3 black--text>{{ title1 }} : {{ computedPercentage1 }} </v-flex>
                           </v-layout>
                        </v-flex> 
                        <v-flex xs1>
                            <v-layout column >
                               <v-flex xs3></v-flex>
                               <v-flex xs3> + </v-flex>
                               <v-flex xs3></v-flex>
                           </v-layout>
                        </v-flex>
                        <v-flex xs3>
                             <v-layout column justify-center align-center fill-height>
                               <v-flex class="underlineClass pb-0 mb-0">{{ actual2.toFixed(decimal) }}</v-flex>
                               <v-flex class="pt-0 mt-0">{{ allowable2.toFixed(decimal) }}</v-flex>
                               <v-flex black--text>{{ title2 }} : {{ computedPercentage2 }}</v-flex>
                           </v-layout>
                        </v-flex>
                        <v-flex xs1>
                            <v-layout column >
                               <v-flex></v-flex>
                               <v-flex> = </v-flex>
                               <v-flex></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs1>
                            <v-layout column >
                               <v-flex></v-flex>
                               <v-flex class="black--text font-weight-bold"> {{ computedInteraction }} </v-flex>
                               <v-flex></v-flex>
                           </v-layout>
                        </v-flex>
                        <v-flex xs1 v-if="computedInteraction <= 1">
                            <v-layout  column justify-center align-center>
                               <v-flex></v-flex>
                               <v-flex> &lt; </v-flex>
                               <v-flex></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs1 v-if="computedInteraction > 1">
                            <v-layout column justify-center align-center>
                               <v-flex></v-flex>
                               <v-flex> &gt; </v-flex>
                               <v-flex></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs1>
                            <v-layout column>
                               <v-flex></v-flex>
                               <v-flex> 1.00 </v-flex>
                               <v-flex></v-flex>
                           </v-layout>
                        </v-flex>
                        <v-flex xs1 v-if="computedInteraction <= 1" hidden-xs-only>
                            <v-layout  column >
                               <v-flex></v-flex>
                               <v-flex> ok </v-flex>
                               <v-flex></v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs1 v-if="computedInteraction > 1" hidden-xs-only>
                            <v-layout column >
                               <v-flex></v-flex>
                               <v-flex> fail </v-flex>
                               <v-flex></v-flex>
                            </v-layout>
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
    name:'ValueInteraction',
    props:{
        heading:{type:String,default:''},
        actual1:{type:Number,default:0},
        allowable1:{type:Number,default:0},
        title1:{type:String,default:''},
        actual2:{type:Number,default:0},
        allowable2:{type:Number,default:0},
        title2:{type:String,default:''},
        decimal:{type:Number,default:0},
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
        computedInteraction(){
            return (this.actual1/this.allowable1 + this.actual2/this.allowable2).toFixed(2)
        },
        computedPercentage1(){
            return ((this.actual1/this.allowable1)*100).toFixed(0) + '%'
        },
        computedPercentage2(){
            return ((this.actual2/this.allowable2)*100).toFixed(0) + '%'
        },
        computedColor(){
            let ratio = this.actual1/this.allowable1 + this.actual2/this.allowable2
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
            //return (this.actual1/this.allowable1 + this.actual2/this.allowable2 < 1) ? 'okClass' : 'failClass'
        },//BACKGROUND AND TEXT COLOR

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
.underlineClass {
    border-bottom: 1px solid #000;
}
</style>


