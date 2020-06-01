<template>
    <div>
        <v-ring
            :config="{
                x: xo,
                y: yo,
                innerRadius: computedSize.Ri,
                outerRadius: computedSize.Ro,
                stroke: '#eee',
                strokeWidth: 3,
            }"
        >

        </v-ring>
        <v-arc 
            :config="{
                x: xo,
                y: yo,
                innerRadius: computedSize.Ri,
                outerRadius: computedSize.Ro,
                angle: computedDeg,
                fill: computedFill,
                stroke: computedFill,
                strokeWidth: 3,
                rotation : 270
            }"
        >
        </v-arc>

        <v-text 
            :config="{
                x: xo-computedSize.Ro/2,
                y: yo-computedSize.Ro/2,
                width : computedSize.Ro,
                height : computedSize.Ro,
                align : 'center',
                verticalAlign : 'middle',
                text: val,
                fontSize: computedSize.percentFontSize,
                fontStyle:'bold',
                fontFamily: 'Calibri',
                fill: 'blue'
            }"
        >
        </v-text>
+ 
        <v-text 
            :config="{
                x: xo-1.2*computedSize.Ro,
                y: yo + computedSize.Ro + 5,
                width : 2.4* computedSize.Ro,
                height : 20,
                align : 'center',
                verticalAlign : 'middle',
                text: title,
                fontSize: computedSize.titleFontSize,
                fontStyle:'bold',
                fontFamily: 'Calibri',
                fill: 'black'
            }"
        >
        </v-text>

    </div>
</template>

<script>


export default {
    name:'KonvaPercentDonut',
    components:{
        
    },//COMPONENTS
    props:{
        xo : {type:Number,default:0},
        yo : {type:Number,default:0},
        val : {type:Number,default:0},
        title : {type:String,default:''},
        size : {type:String,default:'large'},
    },
    data(){
        return{
           Ri : 25,
           Ro : 40,
           fontSizeTitle : 12,
           fontSizePercent : 24

        }//RETURN
    },//DATA
    created(){
       
    },//CREATED
    mounted(){
        
    },//MOUNTED
    computed:{
        computedSize(){
            switch(this.size){
                case ('large'):
                    return {
                        Ri : 25, 
                        Ro : 40, 
                        titleFontSize : 12, 
                        percentFontSize : 24
                    }
                    break
                case ('medium'):
                    return {
                        Ri : 18.75, 
                        Ro : 30, 
                        titleFontSize : 12, 
                        percentFontSize : 18
                    }
                    break
                case ('small'):
                    return {
                        Ri : 12.5, 
                        Ro : 20, 
                        titleFontSize : 12, 
                        percentFontSize : 12
                    }
                    break
            }
        },
        computedFill(){
            return this.val < 100 ? 'yellow' : 'red'
        },
        computedDeg(){
            if(this.val >= 100){
                return 360
            }
            else{
                return this.val * 360/100
            }
        }
   
    },//COMPUTED
    methods:{

    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


