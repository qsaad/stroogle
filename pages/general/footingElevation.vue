<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Top of Slab (ft)" v-model="T_slab" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Frost Depth (in)" v-model="H_frost" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Footing Thick (in)" v-model="H_footing" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Top of Site (ft)" v-model="T_site" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="Top of Grade (ft)" v-model="T_grade" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
           
          
            <v-flex xs12>
                {{calculate}}
                <value-string title="T/FTG" :value="elevFrac" tooltip="Top of Footing Elevation" class="pa-0 ma-0"></value-string>
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
                T_slab:100,
                T_site:763,
                T_grade:761,
                H_frost:36,
                H_footing:12,
                T_footing:'',

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
        mounted(){
            
        },//MOUNTED
        computed:{
            calculate(){
                this.T_footing = (this.T_slab-(this.T_site-this.T_grade))-(this.H_frost/12) + (this.H_footing/12)

                this.elevFrac = deciToFrac(this.T_footing),
                this.elevDeci = (this.T_footing).toFixed(2)
            }
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>