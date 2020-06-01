<template>
    <module-card :root="root" :title="title">
      <v-layout row wrap justify-center>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">BEAM</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Select Section" :items="items" v-model="Shape" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0"></v-text-field> 
                        <v-text-field label="S (ft)" v-model.number="S" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Method" :items="methodList" v-model="method" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
             </v-flex>
            <v-flex xs6 md3>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">SLAB</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="tc (in)" v-model.number="tc" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="hd (in)" v-model.number="hd" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="fc (psi)" v-model.number="fc" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="wc (pcf)" v-model.number="wc" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md2>
                <v-card hover height="100%">
                    <v-card-title class="subheading pl-2 pt-1 pb-0 ma-0 black--text font-weight-bold">STUD</v-card-title>
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Qty in half span" v-model.number="NS" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="ds (in)" v-model.number="ds" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="hs (in)" v-model.number="hs" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="Location" :items="studLocationList" v-model="studLocation" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
             <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-img src="../images/steel/steel-compositecapacity.svg" max-width=200 ></v-img>
                            </v-flex>
                        </v-layout>
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
                                    <v-flex xs12> 
                                        <value-number :method="method" title="M" subscript="n" :value="fMn"  :decimal=0 unit="k-ft" tooltip="Flexural Capacity"></value-number>
                                    </v-flex>
                                                
                                    <v-flex xs12>
                                        <message-list :messages="messages"></message-list>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <params-list :dataList="parameters">
                        </params-list>
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
    import ValueCheck from '@/components/ValueCheck.vue'
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import ParamsList from '@/components/ParamsList.vue'
    import MessageList from '@/components/MessageList.vue'

    import SteelCompositeCapacity from '@/classes/steel/clsSteelCompositeCapacity'
    import * as Data_W from '@/data/Data_W' 

    import {steel} from '@/mixins/steelMixin'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueCheck, ValueComputed, 
                ValueInteraction,
                ParamsList, MessageList
            },//COMPONENTS
        mixins : [steel],
        data(){
            return{
                ShapeList:[],
                Shape :'W16X26',
                method:'LRFD',
                L: 30,
                S : 10,
                    
                tc : 3.5,
                hd : 3,
                fc : 3500,
                wc : 145,
                
                NS : 20,
                ds : 0.75,
                hs : 4.5,
                studLocationList : ['Strong','Weak'],
                studLocation : 'Strong',
            
                params : [],
                parameters : [],
                messages : []
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
            _.forEach(Data_W.ShapeList,item =>{
                this.ShapeList.push(item)
            }) 
            
        },//MOUNTED
        computed:{
            items(){
                return _.map(this.ShapeList, 'Shape')
            },//ITEMS
             design(){
                let beamData = {
                    section : _.omit(_.find(this.ShapeList, {'Shape': this.Shape}),['Shape']),
                    L : this.L,
                    S : this.S,
                    method : this.method,
                    tc : this.tc ,
                    hd : this.hd,
                    fc : this.fc,
                    wc : this.wc,
                    NS : this.NS,
                    ds : this.ds,
                    hs : this.hs,
                    studLocation : this.studLocation
                }
      
                let BM = new SteelCompositeCapacity(beamData)

                this.fMn = BM.fMn()
                this.PNA = BM.PNA()
                this.mode = BM.mode()
                this.composite = BM.composite()
                this.Nmin = BM.Nmin()
                this.Nfull = BM.Nfull().toFixed(0)

                this.parameters =[
                    _.merge({ Group: 'Beam' }, { List: BM.beamParams() }),
                    _.merge({ Group: 'Slab' }, { List: BM.slabParams() }),
                    _.merge({ Group: 'Stud' }, { List: BM.studParams() }),
                ]

                this.messages = [
                   {status : this.PNA == 'Slab', type : 'info', title: 'PNA', value : 'Slab'},
                   {status : this.PNA == 'Flange', type : 'info', title: 'PNA', value : 'Flange'},
                   {status : this.PNA == 'Web', type : 'info', title: 'PNA', value : 'Web'},
                   {status : true, type : 'info', title: 'Composite', value : this.composite},
                   {status : this.NS < this.Nmin, type : 'warning', title: 'Studs', value : 'Increase No of Studs'},
                   {status : this.NS < this.Nfull, type : 'info', title: 'Studs', value : `${this.NS} <  ${this.Nfull}`},
                   {status : this.hs -this.hd < 1.5, type : 'warning', title: 'Studs Height', value : 'Increase Stud height'},
                   {status : this.tc  < 2, type : 'warning', title: 'Concrete Thickness', value : 'Increase Concrete thickness'},
                  
                ]
            },//DESIGN

        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>