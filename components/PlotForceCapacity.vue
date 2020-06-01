<template>
    <!-- <div id="drawing">{{regenerate}}</div> -->
    <svg :width="width" :height="height">
        <circle :cx="x" :cy="y" :r="r" />
        <text x="30" y="50">{{txt}}</text>
    </svg>
</template>

<script>
import * as SVG from 'svg.js/dist/svg';

export default {
    name:'PlotForceCapacity',
    middleware: [],
    components:{
    },//COMPONENTS
    props:{
        txt : {type:String},
        x : {type:Number},
        y : {type:Number},
        r : {type:Number}, 
        height : {type:Number},
        width : {type:Number},
        length : {type:Number},
        forceCoord:{type:Array},
        capacityCoord:{type:Array},
    },
    
    data(){
        return{
            
           
            }//RETURN
        },//DATA
        created(){
            
        },//CREATED
        mounted(){
            //this.init()
        },//MOUNTED
        watch:{
           

        },//WATCH
        computed:{
           regenerate(){
               let draw = SVG('drawing').size(300, 200)
                //let boundary = draw.rect(300, 200)

                let XO = 25
                let YO = 100   
                let XF = 250/this.length
                let YF = 10

                //DRAW BASE LINE
                let line = draw.line(XO, YO, this.length * XF + XO, YO).stroke({ width: 1 })

                //DRAW TICK MARKER
                _.map(this.forceCoord, item =>{
                    draw.line(item.x* XF + XO, 95, item.x* XF + XO, 105).stroke({ width: 1 })
                })

                //DRAW FORCE LINE
                let forceArr = []
                forceArr = _.map(this.forceCoord, item =>{
                    return (item.x* XF + XO)+' '+ (item.y*YF + YO)
                })

                draw.polyline(forceArr).fill('none').stroke({ width: 1 })
           }
        },//COMPUTED
        methods:{
          init(){
                let draw = SVG('drawing').size(300, 200)
                //let boundary = draw.rect(300, 200)

                let XO = 25
                let YO = 100   
                let XF = 250/this.length
                let YF = 10

                //DRAW BASE LINE
                let line = draw.line(XO, YO, this.length * XF + XO, YO).stroke({ width: 1 })

                //DRAW TICK MARKER
                _.map(this.forceCoord, item =>{
                    draw.line(item.x* XF + XO, 95, item.x* XF + XO, 105).stroke({ width: 1 })
                })

                //DRAW FORCE LINE
                let forceArr = _.map(this.forceCoord, item =>{
                    return (item.x* XF + XO)+' '+ (item.y*YF + YO)
                })

                draw.polyline(forceArr).fill('none').stroke({ width: 1 })


           }//RENDER
        }//METHODS

}
</script>

<style>

</style>
