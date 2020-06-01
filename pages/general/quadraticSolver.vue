<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="a" v-model="a" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="b" v-model="b" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="c" v-model="c" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3 display-1">
                        <span>{{this.a}}x<sup>2</sup></span>
                        <span v-if="this.b > 0"> + </span>
                        <span v-else> - </span>
                        <span>{{Math.abs(this.b)}}x</span>
                        <span v-if="this.c > 0"> + </span>
                        <span v-else> - </span>
                        <span>{{Math.abs(this.c)}} = 0</span>
                        <!-- {{this.a}}x<sup>2</sup> + {{this.b}}x + {{this.c}} = 0 -->
                    </v-card-text>
                </v-card>
            </v-flex>
           
          
            <v-flex xs6>
                {{calculate}}
                <value-number title="x" subscript="1" :value="x1" :decimal=2 v-if="x1 != 'Imaginary'" tooltip="Root Solution"></value-number>
                <value-string title="x" subscript="1" :value="x1" v-else tooltip="No Solution"></value-string>
            </v-flex>
            <v-flex xs6>
                <value-number title="x" subscript="2" :value="x2" :decimal=2 v-if="x2 != 'Imaginary'" tooltip="Root Solution"></value-number>
                <value-string title="x" subscript="2" :value="x2" v-else tooltip="No Solution"></value-string>
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
                a : 2,
                b : 3,
                c : 7,
                x1 : '',
                x2 : ''
            
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
                if(Math.pow(this.b,2) > 4*this.a*this.c){
                    this.x1 = (-this.b + Math.pow(Math.pow(this.b,2) - 4*this.a*this.c,0.5))/(2*this.a) 
                    this.x2 = (-this.b - Math.pow(Math.pow(this.b,2) - 4*this.a*this.c,0.5))/(2*this.a)
                }
                else{
                    this.x1 = 'Imaginary'
                    this.x2 = 'Imaginary'
                }
            }
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>