<template>
    <div>
        <v-line 
            :config="{
                points : plotData,
                stroke: fill,
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round',
                dash: [10, 7]
            }"
        >
        </v-line>
    </div>
</template>

<script>


export default {
    name:'KonvaPlotDeflection',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        name : {type:String,default:''},
        L : {type:Number,default:100},
        orientation : {type:String,default:'Horizontal'},
        dataPoints:{type:Array,default:[]},
        fill : {type:String,default:'blue'},
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
                return [this.xo + x, this.yo + yArr[i] * 10];
            })

            return _.flatten(arrayCombined)
       }

      
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


