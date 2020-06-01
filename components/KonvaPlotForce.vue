<template>
    <div>
        {{plotData}}
        <v-line 
            :config="{
                points : plotBase,
                stroke: fill,
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round'
            }"
        >
        </v-line>
        <v-line 
            :config="{
                points : plotData,
                stroke: fill,
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round',
                fill : fill,
                closed : true,
                opacity : opacity
            }"
        >
        </v-line>
    </div>
</template>

<script>


export default {
    name:'KonvaPlotForce',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        name : {type:String,default:''},
        L : {type:Number,default:100},
        orientation : {type:String,default:'Horizontal'},
        dataPoints:{type:Array,default:[]},
        type : {type:String,default:'M'},
        fill : {type:String,default:'red'},
        opacity : {type:Number,default:1},
        SF : {type:Number,default:1},
    },
    data(){
        return{
            color : 'yellow'
           
        }//RETURN
    },//DATA
    created(){
       
    },//CREATED
    mounted(){
        
    },//MOUNTED
    computed:{
        plotBase(){
        if(this.orientation == 'Horizontal'){
                return [this.xo, this.yo, this.xo + this.L, this.yo]
           }
           else{
               return [this.xo, this.yo, this.xo, this.yo + this.L]
           }
        },
       plotData(){
           let NP = this.dataPoints.length
           let seg = this.L/(NP-1)


           let xArr = []
           let yArr = this.dataPoints
           xArr[0] = 0
            for (let i = 1; i < NP ; i++) {
                xArr[i] = xArr[i-1] + seg
            }

            let arrayCombined = _.map(xArr, (x, i) => {
                return [this.xo + x, this.yo + yArr[i] * this.SF];
            })

            arrayCombined.unshift(this.xo +0,this.yo +0)
            arrayCombined.push(this.xo + xArr[NP-1],this.yo +0)

            // if(this.type == 'V'){
            //     arrayCombined.unshift(this.xo +0,this.yo +0)
            //     arrayCombined.push(this.xo + xArr[NP-1],this.yo +0)
            // }

            return _.flatten(arrayCombined)
       }

      
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


