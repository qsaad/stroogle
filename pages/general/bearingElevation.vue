<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field   
                            label="High Elevation"
                            v-model="Eu"
                            hint="Format xx-xx-xx"
                            persistent-hint
                        >
                        </v-text-field>
                        <v-text-field   
                            label="Low Elevation"
                            v-model="El"
                            hint="Format xx-xx-xx"
                            persistent-hint
                        >
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field   
                            label="Distance Between"
                            v-model="L"
                            hint="Format xx-xx-xx"
                            persistent-hint
                        >
                        </v-text-field>
                        <v-text-field   
                            label="Distance To"
                            v-model="Lt"
                            hint="Format xx-xx-xx"
                            persistent-hint
                        >
                        </v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="From" :items="fromList" v-model="from" class="pa-0 ma-0"></v-select>
                        <v-select label="Type" :items="typeList" v-model="type" class="pa-0 ma-0"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
          
            <v-flex xs12>
                {{calculate}}
                <value-string title="EL" :value="elevFrac" tooltip="Computed Elevation"></value-string>
            </v-flex>
            
         </v-layout>
    </module-card>
</template>

<script>
    import {deciToFrac} from '@/library/functions'

    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueString from '@/components/ValueString.vue'

    import _ from 'lodash'

    export default {
        components:{
                ModuleCard, ValueNumber, ValueString
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                Eu:'4-0-0',
                El:'2-0-0',
                L:'5-0-0',
                Lt:'1-0-0',
                type:'Interpolate',
                from:'Low',
                En:'',
                slopeDeg : '',
                slopeInFt : '',
                isSlope : false,
                typeList: ['Interpolate','Extrapolate'],
                fromList: ['High','Low'],

                elevFrac :'',
                elevDeci :''
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
        computed:{
            calculate(){
                let eu_arr = String(this.Eu).split("-",3)
                let eu = parseFloat(eu_arr[0]) + (parseFloat(eu_arr[1])+parseFloat(eu_arr[2])/16)/12
                let el_arr = String(this.El).split("-",3)
                let el = parseFloat(el_arr[0]) + (parseFloat(el_arr[1])+parseFloat(el_arr[2])/16)/12
                let l_arr = String(this.L).split("-",3)
                let l = parseFloat(l_arr[0]) + (parseFloat(l_arr[1])+parseFloat(l_arr[2])/16)/12
                let lt_arr = String(this.Lt).split("-",3)
                let lt = parseFloat(lt_arr[0]) + (parseFloat(lt_arr[1])+parseFloat(lt_arr[2])/16)/12
                let d = eu-el;
                let slope = d/l;

                this.slopeDeg = Math.atan(slope)*(180/Math.PI)
                this.slopeInFt = (12*Math.tan(this.slopeDeg*(Math.PI/180)));

                    switch(this.type){
                        case "Interpolate":
                            if( this.from == 'Low'){
                                this.En = el + lt*slope
                            }
                            else{
                                this.En = eu - lt*slope
                            }
                            break;
                        case "Extrapolate":
                            if( this.from == 'Low'){
                                this.En = el - lt*slope
                            }
                            else{
                                this.En = eu + lt*slope
                            }
                            break;
                    }//SWITCH

                    
                        this.elevFrac = deciToFrac(this.En),
                        this.elevDeci = (this.En).toFixed(2)
                    
            }//CALCULATE

        },//COMPUTED
        methods:{

        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>