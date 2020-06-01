<template>
    <div>
        {{render}}
        <v-stage ref="stage" :config="configStage">
            <v-layer ref="layer">
                <v-rect :config="configBackground"></v-rect>
                <v-rect :config="configSpan"></v-rect>
                <v-text :config="configSpanText"></v-text>

                <v-text :config="configRLDL"></v-text>
                <v-text :config="configRLLL"></v-text>
                <v-text :config="configRLTL"></v-text>
                <v-text :config="configLeftReaction"></v-text>

                <v-text :config="configMDL"></v-text>
                <v-text :config="configMLL"></v-text>
                <v-text :config="configMTL"></v-text>
                <v-text :config="configMoment"></v-text>

                <v-text :config="configDDL"></v-text>
                <v-text :config="configDLL"></v-text>
                <v-text :config="configDTL"></v-text>
                <v-text :config="configDeflection"></v-text>

                <v-text :config="configRRDL"></v-text>
                <v-text :config="configRRLL"></v-text>
                <v-text :config="configRRTL"></v-text>
                <v-text :config="configRightReaction"></v-text>

                <v-regular-polygon :config="configLeftSupport"></v-regular-polygon>
                <v-regular-polygon :config="configRightSupport"></v-regular-polygon>

                <v-rect :config="configUDL"></v-rect>
                <v-text :config="configUDLText"></v-text>
                <v-rect :config="configULL"></v-rect>
                <v-text :config="configULLText"></v-text>
                <v-arrow :config="item" v-for="(item,i) in configPD" :key="i"></v-arrow>
                <v-arrow :config="item" v-for="(item,i) in configPL" :key="i"></v-arrow>
            </v-layer>
        </v-stage>
    </div>
</template>

<script>
import Beam from '@/classes/analysis/clsSimpleBeam'

let b = {}

export default {
    name:'PlotLoads',
    middleware: [],
    components:{
    },//COMPONENTS
    props:['type','L','E','Ix','method','UDL','ULL','PTL'],
    data(){
        return{
                //KONVA GRAPH CONFIGURATIONS
                configPD:[],
                configPL:[],
                configStage : {width:350,height:220,},
                configBackground:{x:0,y:0,width:350,height:220,fill:''},
                //SPAN
                configSpan: {x:15,y:100,width:285,height:5,fill:'white'},
                configSpanText: {x:145,y:120,text:'',fontSize:12,fill:'white'},
                //MOMENT
                configMDL: {x:90,y:140,text:'',fontSize:12,fill:'teal'},
                configMLL: {x:90,y:160,text:'',fontSize:12,fill:'green'},
                configMTL: {x:90,y:180,text:'',fontSize:12,fill:'white'},
                configMoment: {x:85,y:200,text:'Moment',fontSize:12,fill:'black'},
                //DEFLECTION
                configDDL: {x:180,y:140,text:'',fontSize:12,fill:'teal'},
                configDLL: {x:180,y:160,text:'',fontSize:12,fill:'green'},
                configDTL: {x:180,y:180,text:'',fontSize:12,fill:'white'},
                configDeflection: {x:175,y:200,text:'Deflection',fontSize:12,fill:'black'},
                //SUPPORTS
                configLeftSupport: {x:15,y:115,sides:3,radius:10,fill:'white'},
                configRightSupport: {x:300,y:115,sides:3,radius:10,fill:'white'},
                //LEFT REACTION
                configRLDL: {x:10,y:140,text:'',fontSize:12,fill:'teal'},
                configRLLL: {x:10,y:160,text:'',fontSize:12,fill:'green'},
                configRLTL: {x:10,y:180,text:'',fontSize:12,fill:'white'},
                configLeftReaction: {x:2,y:200,text:'Reaction',fontSize:12,fill:'black'},
                //RIGHT REACTION
                configRRDL: {x:290,y:140,text:'',fontSize:12,fill:'teal'},
                configRRLL: {x:290,y:160,text:'',fontSize:12,fill:'green'},
                configRRTL: {x:290,y:180,text:'',fontSize:12,fill:'white'},
                configRightReaction: {x:275,y:200,text:'Reaction',fontSize:12,fill:'black'},
                //UNIFORM LOAD
                configUDL: {x:15,y:80,width:285,height:15,fill:'teal'},
                configUDLText: {x:135,y:82,text:'',fontSize:11,fill:'white'},
                configULL: {x:15,y:60,width:285,height:15,fill:'green'},
                configULLText: {x:135,y:62,text:'',fontSize:11,fill:'white'},
            }//RETURN
        },//DATA
        created(){
            
        },//CREATED
        mounted(){
            
        },//MOUNTED
        watch:{
            PTL: function (data) {
                this.configPD = []
                this.configPL = []
                _.forEach(data, P =>{
                    let x = (P.PX/this.L)*285
                    let pointerPD = P.PD > 0 ? 7 : 0
                    let pointerPL = P.PL > 0 ? 7 : 0
                    this.configPD.push({x:x, y:30, points: [0,0, 0, 20], pointerLength: pointerPD, pointerWidth : pointerPD, fill: 'teal'})
                    this.configPL.push({x:x, y:10, points: [0,0, 0, 20], pointerLength: pointerPL, pointerWidth : pointerPL, fill: 'green'})
                })
            },

        },
        computed:{
            render(){
                let data = {
                    L : this.L,
                    UDL : this.UDL,
                    ULL : this.ULL,
                    PTL : this.PTL,
                    Ix : this.Ix,
                    E : this.E,
                    method : this.method
                }

                let B = new Beam(data)

                this.configSpanText.text = 'L = ' + this.L + ' ft'
                this.configUDLText.text = 'UDL = ' + this.UDL + ' k/ft'
                this.configULLText.text = 'ULL = ' + this.ULL + ' k/ft'

                this.configMDL.text = (B.MDL()).toFixed(0) + ' k-ft'
                this.configMLL.text = (B.MLL()).toFixed(0) + ' k-ft'
                this.configMTL.text = (B.MTL()).toFixed(0) + ' k-ft'

                this.configDDL.text = (B.DDL()).toFixed(3) + ' in'
                this.configDLL.text = (B.DLL()).toFixed(3) + ' in'
                this.configDTL.text = (B.DTL()).toFixed(3) + ' in'

                this.configRLDL.text = (B.RLDL()).toFixed(0) + ' k'
                this.configRLLL.text = (B.RLLL()).toFixed(0) + ' k'
                this.configRLTL.text = (B.RLTL()).toFixed(0) + ' k'

                this.configRRDL.text = (B.RRDL()).toFixed(0) + ' k'
                this.configRRLL.text = (B.RRLL()).toFixed(0) + ' k'
                this.configRRTL.text = (B.RRTL()).toFixed(0) + ' k'
            },//DESIGN

        },//COMPUTED
        methods:{
          
           
        }//METHODS

}
</script>

<style>

</style>
