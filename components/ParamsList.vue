<template>
    <v-layout row wrap>
        <v-flex xs12 class="px-3">
            <v-combobox label="" :items="comboList" v-model="selectedParam" class="pa-0 ma-0"></v-combobox>
        </v-flex>
        <v-layout row wrap class="px-3 pb-3"> 
            <v-flex xs6 sm4 md3 v-for="(item,key) in filteredParamsList" :key="key"> 
                <v-card hover>
                    <v-card-text>
                        <v-layout row wrap class="pa-0">
                            <v-flex xs5 v-html="item.name" class="font-weight-bold"></v-flex>
                            <v-flex xs4 class="red--text">  {{computedValue(item.value,item.decimal)}} </v-flex>
                            <v-flex xs3 v-html="item.unit" class="font-weight-bold">  </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
export default {
    name:'ParamsList',
    components:{
        
    },//COMPONENTS
    props:{
        dataList:{type:Array,default:[]},
    },
    data(){
        return{
           selectedParam : ''
        }//RETURN
    },//DATA
    created(){
        let arr = _.map(this.dataList,'Group')
        this.selectedParam = arr[0]
    },//CREATED
    mounted(){
    },//MOUNTED
    computed:{
        comboList(){
            return _.map(this.dataList,'Group')
        },
        filteredParamsList(){
            let arr =  _.filter(this.dataList,{'Group' : this.selectedParam })
            return arr[0].List
        }
      
    },//COMPUTED
    methods:{
      computedValue(value,decimal){
            let val = value
            return _.isString(val) ?  val : val.toFixed(decimal)
        },
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


