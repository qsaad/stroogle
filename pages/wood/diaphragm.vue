<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs12 md6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Type" :items="loadList" v-model="load" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 md6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Panel" :items="panelItems" v-model="panel" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Width (in)" :items="widthList" v-model="width" class="pa-0 ma-0"></v-combobox>
                        <v-combobox label="Nail Spacing (in)" :items="nailSpacingList" v-model="nailSpacing" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            {{design}}
             <v-flex xs12>
                <v-tabs fixed-tabs>
                    <v-tab ripple>Capacities</v-tab>
                    <v-tab ripple>Parameters</v-tab>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex xs6> 
                                        <value-number :method="method" title="V" subscript="n" superscript="''" :value="fVn"  :decimal=0 unit="lb" tooltip="Shear Capacity"></value-number>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                              <v-layout row wrap>
                                    <v-flex xs4 v-for="(value,key) in params" :key="key"> 
                                        <value-parameter :title=key :value=value :decimal=2 unit=""></value-parameter>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
           
        </v-layout>
    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'

    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueParameter from '@/components/ValueParameter.vue'
    import ValueMessage from '@/components/ValueMessage.vue'
    import ValueCheck from '@/components/ValueCheck.vue'

    import {wood} from '@/mixins/woodMixin'

    import Diaphragm from '@/classes/wood/clsDiaphragm'
    import * as DiaphragmBlockedWind from '@/data/wood/DiaphragmBlockedWind'
    import * as DiaphragmUnblockedWind from '@/data/wood/DiaphragmUnblockedWind'
    import * as DiaphragmBlockedSeismic from '@/data/wood/DiaphragmBlockedSeismic'
    import * as DiaphragmUnblockedSeismic from '@/data/wood/DiaphragmUnblockedSeismic'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck
            },//COMPONENTS
        mixins : [wood],
        data(){
            return{
                loadList :['Wind', 'Seismic'],
                load : 'Wind',
                typeList :['Blocked', 'Unblocked'],
                type : 'Blocked',
                panelList :[],
                panel : '15/32 Sheathing with 10d Common Nails',
                widthList : [2,3],
                width : 2,
                nailSpacingList : ['6','4','2-1/2','2'],
                nailSpacing : '6',
            }//RETURN
        },//DATA
        head(){
            return {
                title: this.title,
                meta: [
                    { hid: 'description', name: 'description', content: this.description }
                ]
            }
        },//HEAD
        asyncData({store,params,route}){
            let arr = _.split(route.path, '/')
            return{
                title : _.get(_.find(store.state.pagesList,{'category':arr[1],'link':arr[2]}),'title'),
                description : _.get(_.find(store.state.pagesList,{'category':arr[1],'link':arr[2]}),'description'),
                root : '/' + arr[1]  
            }
        },//ASYNCDATA
        created(){
            
        },//CREATED
        mounted(){
            _.forEach(DiaphragmBlockedWind.List,item =>{
                this.panelList.push(item)
            }) 
        },//MOUNTED
        computed:{
            panelItems(){
                this.panelList = []
                switch(this.load){
                    case ('Wind'):
                        if(this.type == "Blocked"){
                            _.forEach(DiaphragmBlockedWind.List,item =>this.panelList.push(item)) 
                            this.panel = '15/32 Sheathing with 10d Common Nails'
                        }
                        else{
                            _.forEach(DiaphragmUnblockedWind.List,item =>this.panelList.push(item)) 
                            this.panel = '15/32 Sheathing with 10d Common Nails'
                        }
                    case ('Seismic'):
                        if(this.type == "Blocked"){
                            _.forEach(DiaphragmBlockedSeismic.List,item =>this.panelList.push(item)) 
                            this.panel = '15/32 Sheathing with 10d Common Nails'
                        }
                        else{
                            _.forEach(DiaphragmUnblockedSeismic.List,item =>this.panelList.push(item)) 
                            this.panel = '15/32 Sheathing with 10d Common Nails'
                        }
                        break
                }//SWITCH
                return _.map(this.panelList, 'Panel')
            },//ITEMS
            design(){
                let inputData = {
                        method : this.method,
                        load : this.load,
                        type : this.type,
                        panel : this.panel,
                        width : this.width,
                        nailSpacing : this.nailSpacing,
                }

                let D = new Diaphragm(inputData)

                this.params = D.params()
                this.fVn = D.shearCapacity()

                //MESSAGES
                // this.messages = [
                //     {status : this.L / this.B > 4 ? true : false, type : 'warning', title: 'Aspect Ratio', value : 'L/B > 4'},
                //     //{status : S.p() < 10 * S.D ? true : false, type : 'warning', title: 'Partial Penetration', value : 'p < 10D'},
                // ]
            }//DESIGN
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>