<template>
    <v-layout row wrap justify-center align-center>
    <!-- +++++++++++++++++++++++++ -->
    <!-- USER INPUT -->
    <!-- +++++++++++++++++++++++++ -->
            <v-flex xs12 sm12 md7>
                <v-card hover height="270" >
                    <v-card-text class="pa-0 ma-0">
                        <v-tabs grow >
                            <v-tab ripple v-for="(tab,i) in inputList" :key="i" @click="selectedId = tab.id" class="font-weight-bold">{{tab.title}}</v-tab>
                            <v-tab-item v-for="(tab,i) in inputList" :key="i">
                                <slot :name="'tab-' + i"></slot>
                            </v-tab-item>
                        </v-tabs>
                    </v-card-text>
                </v-card>
            </v-flex>
    <!-- +++++++++++++++++++++++++ -->
    <!-- GRAPHICS -->
    <!-- +++++++++++++++++++++++++ -->
            <v-flex xs12 sm12 md5>
                <v-card hover height="270" >
                    <v-card-text class="pa-0 ma-0">
                        <v-tabs grow >
                            <v-tab ripple v-for="(graphic,i) in graphicList" :key="i" class="font-weight-bold">{{graphic.title}}</v-tab>
                            <v-tab-item v-for="(graphic,i) in graphicList" :key="i">
                                <slot :name="'graphic-' + i" v-if="i == 0">
                                    <v-layout row wrap class="pl-4 ml-4  pt-0 mt-0">
                                        <v-flex xs12>
                                            <v-img :src="filteredImageUrl" width=200 ></v-img>
                                        </v-flex>
                                    </v-layout>
                                </slot>
                                <slot :name="'graphic-' + i" v-else></slot>
                            </v-tab-item>
                        </v-tabs>
                    </v-card-text>
                </v-card>
            </v-flex>
    <!-- +++++++++++++++++++++++++ -->
    <!-- RESULTS -->
    <!-- +++++++++++++++++++++++++ -->
            <v-flex xs12 color="red">
                 <v-card hover>
                    <v-card-text class="pa-0 ma-0">
                        <v-tabs fixed-tabs >
                            <v-tab ripple class="font-weight-bold">RESULTS</v-tab>
                            <v-tab ripple class="font-weight-bold">CALCULATIONS</v-tab>
                            <v-tab-item>
                                <v-layout row wrap class="pt-1">
                                    <v-flex xs12 v-for="(result,i) in resultList" :key="i">
                                        <value-interaction v-if="result.type == 'Interaction'"
                                            :heading="result.heading"
                                            :actual1="result.actual1"
                                            :allowable1="result.allowable1"
                                            :title1 ="result.title1"
                                            :actual2="result.actual2"
                                            :allowable2="result.allowable2"
                                            :title2 ="result.title2"
                                            :tooltip="result.tooltip"
                                        >
                                        </value-interaction>

                                        <value-check v-if="result.type == 'Check'"
                                            :symbol="result.symbol" 
                                            :title="result.title" 
                                            :subscript="result.subscript" 
                                            :superscript="result.superscript" 
                                            :actual="result.actual"
                                            :allowable="result.allowable" 
                                            :decimal="result.decimal" 
                                            :unit="result.unit" 
                                            :tooltip="result.tooltip"
                                        ></value-check>

                                        <value-computed v-if="result.type == 'Computed'"
                                            :method="result.method"
                                            :symbol="result.symbol" 
                                            :title="result.title" 
                                            :subscript="result.subscript" 
                                            :superscript="result.superscript" 
                                            :value="result.value"  
                                            :decimal="result.decimal" 
                                            :unit="result.unit" 
                                            :tooltip="result.tooltip"
                                        ></value-computed>
                                        
                                        <value-number v-if="result.type == 'Number'"
                                            :symbol="result.symbol" 
                                            :title="result.title" 
                                            :subscript="result.subscript" 
                                            :superscript="result.superscript" 
                                            :value="result.value"  
                                            :decimal="result.decimal" 
                                            :unit="result.unit" 
                                            :tooltip="result.tooltip"
                                        ></value-number>

                                        <value-string v-if="result.type == 'String'"
                                            :symbol="result.symbol" 
                                            :title="result.title" 
                                            :subscript="result.subscript" 
                                            :superscript="result.superscript" 
                                            :value="result.value"  
                                            :unit="result.unit" 
                                            :tooltip="result.tooltip"
                                        ></value-string>

                                        <value-percentage v-if="result.type == 'Percentage'"
                                            :symbol="result.symbol" 
                                            :title="result.title" 
                                            :subscript="result.subscript" 
                                            :superscript="result.superscript" 
                                            :actual="result.actual"  
                                            :allowable="result.allowable" 
                                            :tooltip="result.tooltip"
                                        ></value-percentage>
                                    </v-flex>
    <!-- +++++++++++++++++++++++++ -->
    <!-- MESSAGES -->
    <!-- +++++++++++++++++++++++++ -->                         
                                    <v-flex xs12>
                                        <message-list :messages="messageList"></message-list>
                                    </v-flex>
                                </v-layout>
                            </v-tab-item>
    <!-- +++++++++++++++++++++++++ -->
    <!-- PARAMETERS -->
    <!-- +++++++++++++++++++++++++ -->
                            <v-tab-item>
                                <v-layout row wrap>
                                    <v-flex>
                                       <params-list :dataList="parameterList"></params-list>
                                    </v-flex>
                                </v-layout>
                            </v-tab-item>
                        </v-tabs>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
</template>

<script>
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueString from '@/components/ValueString.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValuePercentage from '@/components/ValuePercentage.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'
    import ParamsList from '@/components/ParamsList.vue'
    import MessageList from '@/components/MessageList.vue'

export default {
    name:'ModuleContent',

    components:{
        ValueNumber,ValueString, ValueParameter, 
        ValueCheck, ValueComputed, ValuePercentage,
        ValueInteraction,
        ParamsList, MessageList,
    },//COMPONENTS
    props:{
        inputList:{type:Array},
        graphicList:{type:Array},
        resultList:{type:Array},
        messageList:{type:Array},
        parameterList:{type:Array},
    },
    data(){
        return{
            selectedId : 1
        }//RETURN
    },//DATA
    created(){
    },//CREATED
    mounted(){
    },//MOUNTED
    computed:{
        filteredImageUrl(){
            let item =   _.filter(this.inputList,{'id' : this.selectedId })
            return item[0].url
        }
    },//COMPUTED
    methods:{
        
    }//METHODS

}//EXPORT DEFAULT
</script>

<style scoped>

</style>


