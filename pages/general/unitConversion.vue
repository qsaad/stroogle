<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Quantity" v-model="quantity"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="From" :items="fromList" v-model="from"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="To" :items="toList" v-model="to"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            
            <v-flex xs12 md9>
                {{calculate}}
                <value-number title="ANS" :value="result" :unit="to" decimal="2"></value-number>
            </v-flex>
            
         </v-layout>
    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'
    import ValueString from '@/components/ValueString.vue'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueString
            },//COMPONENTS
        mixins : [],
        data(){
            return{
                fromList : ['lb','lb-ft','psf','pcf','pci'],
                from : 'lb',
                toList : ['kg','N-m','Nm2','Nm3','Nmm3'],
                to : 'kg',
                quantity : 20,
                result : ''

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
                switch(this.from){
                    case 'lb':
                        this.result = this.quantity *2.2
                        break;
                    case 'lb-ft':
                        this.result = this.quantity *2.2
                        break;
                    case 'psf':
                        this.result = this.quantity *2.2
                        break;
                    case 'pcf':
                        this.result = this.quantity *2.2
                        break;
                    case 'pci':
                        this.result = this.quantity *2.2
                        break;
                }//SWITCH
            }//CALCULATE
        
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>