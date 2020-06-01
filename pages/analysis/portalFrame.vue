<template>
    <module-card :root="root" :title="title">
        <v-layout row wrap justify-center fill-height >
             <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-select label="Method" :items="methodList" v-model="method"></v-select>
                        <v-text-field label="w (k/ft)" v-model="w" ></v-text-field>
                        <v-text-field label="F (k)" v-model="F" ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md3>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="H (ft)" v-model="H" ></v-text-field>
                        <v-text-field label="L (ft)" v-model="L" ></v-text-field>
                        <v-select label="Support" :items="supportList" v-model="support"></v-select>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 md2>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-text-field label="Ib (in^4)" v-model="Ib" ></v-text-field>
                        <v-text-field label="Ic (in^4)" v-model="Ic" ></v-text-field>
                        <v-text-field label="E (ksi)" v-model="E" ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
             <v-flex xs12 md4>
                <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-3">
                        <v-layout row wrap>
                                <v-flex xs12>
                                    <v-img src="../images/analysis/analysis-portalframe.svg" width=200 ></v-img>
                                </v-flex>
                            </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs12 md12>
                {{calculate}}
                <v-container grid-list-md fluid class="pa-0">
                    <v-flex xs12 class="text-xs-left title blue--text">Beam Forces</v-flex>
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md2 v-for="(item, i) in beamForces" :key="i">
                            <v-card hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.name"></v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin red--text">{{item.value | dp2}}</v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.unit"></v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex xs12 md12>
                <v-container grid-list-md fluid class="pa-0">
                    <v-flex xs12 class="text-xs-left title blue--text">Left Column Forces</v-flex>
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md2 v-for="(item, i) in leftColumnForces" :key="i">
                            <v-card hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.name"></v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin red--text">{{item.value | dp2}}</v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.unit"></v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex xs12 md12>
                <v-container grid-list-md fluid class="pa-0">
                    <v-flex xs12 class="text-xs-left title blue--text">Right Column Forces</v-flex>
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md2 v-for="(item, i) in rightColumnForces" :key="i">
                            <v-card hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.name"></v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin red--text">{{item.value | dp2}}</v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.unit"></v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex xs12 md12>
                <v-container grid-list-md fluid class="pa-0">
                    <v-flex xs12 class="text-xs-left title blue--text">Left Support Reaction</v-flex>
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md2 v-for="(item, i) in leftSupportReactions" :key="i">
                            <v-card hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.name"></v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin red--text">{{item.value | dp2}}</v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.unit"></v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex xs12 md12>
                <v-container grid-list-md fluid class="pa-0">
                    <v-flex xs12 class="text-xs-left title blue--text">Right Support Reaction</v-flex>
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md2 v-for="(item, i) in rightSupportReactions" :key="i">
                            <v-card hover>
                                <v-card-text class="pa-1">
                                    <v-layout row space-between>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.name"></v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin red--text">{{item.value | dp2}}</v-flex>
                                        <v-flex xs4 class="body-1 font-weight-thin black--text" v-html="item.unit"></v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

           
            
         </v-layout>
    </module-card>
</template>

<script>
    import SimpleFrame from '@/classes/analysis/clsSimpleFrame'

    import ModuleCard from '@/components/ModuleCard.vue'
    import ValueNumber from '@/components/ValueNumber.vue'

    import filters from '@/mixins/filters'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber
            },//COMPONENTS
        mixins : [filters],
        data(){
            return{
                H : 12,
                L : 22,
                supportList : ['Pinned', 'Fixed'],
                support : 'Pinned',
                Ib : 100,
                Ic : 100,
                E : 29000,
                methodList : ['ASD','LRFD'],
                method : 'ASD',
                w : 1,
                F : 1,

                //FRAME MEMBER FORCES
                beamForces : [],
                leftColumnForces : [],
                rightColumnForces : [],
                leftSupportReactions : [],
                rightSupportReactions : [],

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
                let inputData = {
                    H : this.H,
                    L : this.L,
                    support : this.support,
                    Ib : this.Ib,
                    Ic : this.Ic,
                    E : this.E,
                    method : this.method,
                    w : this.w,
                    F : this.F,
                }

                let SF = new SimpleFrame(inputData)

                this.beamForces  = SF.beamForces()
                this.leftColumnForces  = SF.leftColumnForces()
                this.rightColumnForces  = SF.rightColumnForces()
                this.leftSupportReactions  = SF.leftSupportReactions()
                this.rightSupportReactions  = SF.rightSupportReactions()
            }//CALCULATE
        },//COMPUTED
        methods:{
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>