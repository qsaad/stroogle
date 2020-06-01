<template>
    <module-card :root="root" :title="title">
       <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="L (ft)" v-model.number="L" class="pa-0 ma-0 text-xs-center"></v-text-field>
                        <v-text-field label="E (ksi)" v-model.number="E" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="I (in^4)" v-model.number="I" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
             </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="w (k/ft)" v-model.number="w" class="pa-0 ma-0"></v-text-field>
                        <v-combobox label="No P" :items="NPList" v-model.number="NP" class="pa-0 ma-0"></v-combobox>
                        <v-text-field label="P (k)" v-model.number="P" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-combobox label="Support Type" :items="supportTypeList" v-model="supportType" class="pa-0 ma-0"></v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            {{design}}
             <v-flex xs12>
                <v-tabs fixed-tabs>
                    <v-tab ripple>Forces</v-tab>
                    <v-tab ripple>Plots</v-tab>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                                <v-layout row wrap>
                                    <v-flex xs12 md4 v-if="supportType == 'Fixed'">
                                        <value-computed   title="M" subscript="n" :value="Mn"  :decimal=2 unit="k-ft" tooltip="Negative Moment"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md4 v-else>
                                        
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        <value-computed   title="M" subscript="p" :value="Mp"  :decimal=2 unit="k-ft" tooltip="PositiveMoment"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md4 v-if="supportType != 'Simple'">
                                        <value-computed   title="M" subscript="n" :value="Mn"  :decimal=2 unit="k-ft" tooltip="Negative Moment"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md4 v-else>
                                        
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        <value-computed   title="RL" subscript="" :value="RL"  :decimal=2 unit="k" tooltip="Left Reaction"></value-computed>
                                    </v-flex>
                                     <v-flex xs12 md4>
                                        <value-computed  :symbol="'&Delta;'" title="" subscript="max" :value="D"  :decimal=2 unit="in" tooltip="Deflection"></value-computed>
                                    </v-flex>
                                    <v-flex xs12 md4>
                                        <value-computed   title="RR" subscript="" :value="RL"  :decimal=2 unit="k" tooltip="Right Reaction"></value-computed>
                                    </v-flex>
                                   
                                  
                                    <v-flex xs12>
                                        <v-layout row wrap justify-center>
                                            <v-flex xs12 v-for="(item,key) in messages" :key="key">
                                                <value-message :title="item.title" :value="item.value" :type="item.type" v-if="item.status"></value-message>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card hover>
                            <v-card-text class="text-xs-center">
                               <v-layout row wrap>
                                    <v-flex>
                                        <v-combobox label="Parameter" :items="paramsList" v-model="param" class="pa-0 ma-0"></v-combobox>
                                    </v-flex>
                                </v-layout>
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
    import ValueComputed from '@/components/ValueComputed.vue'
    import ValueInteraction from '@/components/ValueInteraction.vue'

    import EquivalentLoadBeam from '@/classes/analysis/clsEquivalentLoadBeam'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                L : 12,
                E : 29000,
                I : 200,
                NPList : [0,1,2,3,4],
                NP : 0,
                P : 0,
                w : 1,
                paramsList : ['Moment','Shear','Deflection'],
                param : 'Moment',
                supportTypeList : ['Simple','Propped','Fixed'],
                supportType : 'Simple',
                momentParams : [],
                shearParams : [],
                deflectionParams: [],
                messages : [],
                Mp : 0,
                Mn : 0,
                RL : 0,
                RR : 0,
                D : 0

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
            
        },//MOUNTED
        computed:{
             params(){
                switch(this.param){
                    case ('Moment'):
                        return this.momentParams
                        break
                    case ('Shear'):
                        return this.shearParams
                        break
                    case ('Deflection'):
                        return this.deflectionParams
                        break
                }//SWITCH
            },//PARAMS

            design(){
                 let inputData = {
                    L : this.L,
                    w : this.w,
                    NP : this.NP,
                    P : this.P,
                    I : this.I,
                    E : this.E,
                    supportType : this.supportType
                }
                let ELB = new EquivalentLoadBeam(inputData)

                // this.Mp = ELB.totalForces().Mp
                // this.Mn = ELB.totalForces().Mn
                // this.RL = ELB.totalForces().RL
                // this.RR = ELB.totalForces().RR
                // this.D = ELB.totalForces().D

                this.Mp = ELB.uniformForces().Mp
                this.Mn = ELB.uniformForces().Mn
                this.RL = ELB.uniformForces().RL
                this.RR = ELB.uniformForces().RR
                this.D = ELB.uniformForces().D

                // this.Mp = ELB.pointForces().Mp
                // this.Mn = ELB.pointForces().Mn
                // this.RL = ELB.pointForces().RL
                // this.RR = ELB.pointForces().RR
                // this.D = ELB.pointForces().D

                this.momentParams = ELB.uniformCoeff()
                this.shearParams = ELB.pointCoeff()
               
            }//DESIGN

             
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>