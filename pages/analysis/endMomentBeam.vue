<template>
    <module-card :root="root" :title="title">
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- GRAPHICS -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center class="pa-0 ma-0">
             <v-flex xs12 md6>
                 <v-card hover height="100%">
                    <v-card-text class="text-xs-center pa-0 ma-0">
                        <v-stage :config="{width:width, height:height}">
                            <v-layer ref="layer">
                                <!-- TOOLBAR -->
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                                <!-- POINT LOAD -->
                                <konva-arrow :xo="0.1*width" :yo="0.02*height" :length="20" :rotation="0"></konva-arrow>
                                <konva-label :xo="0.06*width" :yo="0.12*height" text="PL" :unit="''" :name="'P'" :pointer="''" @selected-text="edit"></konva-label>
                                <!-- MEMBER SIZE -->
                                <konva-rect :xo="0.25*width" :yo="0.02*height" :width="0.04*width" :height="0.07*width"></konva-rect>
                                <konva-label :xo="0.2*width" :yo="0.12*height" :text="b +'x'+ h" :unit="''" :name="'SIZE'" :pointer="''" @selected-text="edit"></konva-label>
                                 <!-- UNIFORM LOAD -->
                                <konva-uniform-load :xo="0.38*width" :yo="0.06*height" :width="0.08*width" :height="0.02*height"></konva-uniform-load>
                                <konva-label :xo="0.37*width" :yo="0.12*height" text="UDL" :unit="''" :name="'UDL'" :pointer="''" @selected-text="edit"></konva-label>
                                <!-- SPAN -->
                                <konva-span :xo="0.55*width" :yo="0.07*height" :length="0.08*width" :height="0"></konva-span>
                                <konva-label :xo="0.53*width" :yo="0.12*height" text="SPAN" :unit="''" :name="'SPAN'" :pointer="''" @selected-text="edit"></konva-label>
                                <!-- SPAN -->
                                <konva-span :xo="0.73*width" :yo="0.07*height" :length="0.08*width" :height="0"></konva-span>
                                <konva-label :xo="0.70*width" :yo="0.12*height" text="MOMENT" :unit="''" :name="'MOMENT'" :pointer="''" @selected-text="edit"></konva-label>

                                <!-- GRAPHICS -->
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                                <!-- POINT LOAD -->
                                <konva-point-load :xo="0.1*width" :yo="0.25*height" :width="0.8*width" :span="L" :pointLoads="PL" @delete-point-load="deleteP" v-if="PL.length > 0"></konva-point-load>
                                <!-- UNIFORM LOAD -->
                                <!-- <konva-label :xo="0.5*width" :yo="0.4*height" :text="w" :unit="'k/ft'" :name="'w'" :pointer="'down'" @selected-text="edit"></konva-label> -->
                                <konva-text :xo="0.4*width" :yo="0.41*height" :text="w" :unit="'k/ft'" v-if="w > 0"></konva-text>
                                <konva-uniform-load :xo="0.1*width" :yo="0.46*height" :width="0.8*width" :height="0.01*height" v-if="w > 0"></konva-uniform-load>
                                <!-- SPAN -->
                                
                                <konva-span :xo="0.1*width" :yo="0.5*height" :length="0.8*width" :height="0"></konva-span>
                                <konva-text :xo="0.40*width" :yo="0.51*height" :text="L" :unit="'ft'" v-if="L > 0"></konva-text>
                                <!-- <konva-label :xo="0.5*width" :yo="0.51*height" :text="L" :unit="'ft'" :name="'L'" :pointer="'up'" @selected-text="edit"></konva-label> -->
                                <!-- LEFT REACTIONS -->
                                <konva-support :xo="0.1*width" :yo="0.53*height" :radius="7" :rotation="0"></konva-support>
                                <konva-text :xo="0.05*width" :yo="0.55*height" :text="RL" :unit="'k'"></konva-text>
                                 <!-- RIGHT REACTIONS -->
                                <konva-support :xo="0.9*width" :yo="0.53*height" :radius="7" :rotation="0"></konva-support>
                                <konva-text :xo="0.85*width" :yo="0.55*height" :text="RR" :unit="'k'"></konva-text>
                                
                                <!-- RESULTS -->
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                                <!-- MOMENT -->
                                <konva-text :xo="0.09*width" :yo="0.64*height" symbol="ML" :text="ML" unit="k-ft" ></konva-text>
                                <konva-text :xo="0.46*width" :yo="0.64*height" symbol="M" :text="M" unit="k-ft" ></konva-text>
                                <konva-text :xo="0.8*width" :yo="0.64*height" symbol="MR" :text="MR" unit="k-ft" ></konva-text>
                                <konva-plot-force :xo="0.1*width" :yo="0.8*height" :L="0.8*width" :dataPoints="Mi" :fill="'blue'" :opacity="0.6" :SF="SF(M)"></konva-plot-force>
                                <!-- SHEAR -->
                                <konva-plot-force :xo="0.1*width" :yo="0.80*height" :L="0.8*width" :dataPoints="Vi" :type="'V'" :fill="'red'" :opacity="0.6"></konva-plot-force>
                                <!-- DEFLECTION -->
                                <konva-text :xo="0.42*width" :yo="0.7*height" symbol="D" :text="D" unit="in" ></konva-text>
                                <konva-plot-deflection :xo="0.1*width" :yo="0.50*height" :L="0.8*width" :dataPoints="Di" :fill="'blue'"></konva-plot-deflection>
                            </v-layer>
                        </v-stage>
                    </v-card-text>
                 </v-card>
             </v-flex>
            {{calculate}}
             <v-flex xs12 md3>
                 <v-card hover height="100%" class="pa-2">
                    <v-card-title class="font-weight-bold title px-1 pt-0 pb-2 ma-0">
                        INPUT
                    </v-card-title>
                    <v-card-text class="text-xs-center pa-0 ma-0">
                        <v-text-field label="L" flat outline v-model.number="L" suffix="ft" v-if="isEdit == 'SPAN'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="w" flat outline v-model.number="w" suffix="k/ft" v-if="isEdit == 'UDL'" class="pa-0 ma-0"></v-text-field>
                        <v-btn @click="addP" class="blue" ripple block v-if="isEdit == 'P'">Add P</v-btn>
                        <v-text-field label="P" flat outline v-model.number="P" suffix="k" v-if="isEdit == 'P'" class="pa-0 ma-0"></v-text-field>
                        <!-- <v-text-field label="a" flat outline v-model.number="a" suffix="ft" v-if="isEdit == 'P'" class="pa-0 ma-0"></v-text-field> -->
                        <v-text-field label="M1" flat outline v-model.number="M1" suffix="k-ft" v-if="isEdit == 'MOMENT'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="M2" flat outline v-model.number="M2" suffix="k-ft" v-if="isEdit == 'MOMENT'" class="pa-0 ma-0"></v-text-field>

                        <v-text-field label="b" flat outline v-model.number="b" suffix="in" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h" flat outline v-model.number="h" suffix="in" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="E" flat outline v-model.number="E" suffix="ksi" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="pa-0 ma-0">
                    </v-card-actions>
                 </v-card>
            </v-flex>


        </v-layout>
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- INPUT -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-layout row wrap justify-center class="pa-0 ma-0">
            
        </v-layout>
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <!-- OUTPUT -->
        <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
        {{calculate}}
     
    </module-card>
</template>

<script>
    import ModuleCard from '@/components/ModuleCard.vue'

    import KonvaSpan from '@/components/KonvaSpan.vue'
    import KonvaText from '@/components/KonvaText.vue'
    import KonvaLabel from '@/components/KonvaLabel.vue'
    import KonvaUniformLoad from '@/components/KonvaUniformLoad.vue'
    import KonvaArrow from '@/components/KonvaArrow.vue'
    import KonvaSupport from '@/components/KonvaSupport.vue'

    import KonvaAddPointLoad from '@/components/KonvaAddPointLoad.vue'
    import KonvaPointLoad from '@/components/KonvaPointLoad.vue'
    import KonvaRect from '@/components/KonvaRect.vue'

    import KonvaPlotForce from '@/components/KonvaPlotForce.vue'
    import KonvaPlotDeflection from '@/components/KonvaPlotDeflection.vue'

    import {graphics} from '@/mixins/graphicsMixin'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, KonvaPlotForce, KonvaText, KonvaLabel, KonvaUniformLoad, 
                KonvaArrow, KonvaSupport, KonvaAddPointLoad, KonvaPointLoad, KonvaPlotDeflection,
                KonvaRect, KonvaSpan
            },//COMPONENTS
        mixins : [graphics],
        data(){
            return{
                L : 12,
                w : 1,
                E : 3000,
                //Ix : 0,
                b : 10,
                h : 18,
                id : 0,
                P : 5,
                a : 6,
                M1 : 10,
                M2 : 18,
                PL : [],
                Mx : [],
                Vx : [],
                Dx : [],
                //M : 0,
                //V : 0,
                //D : 0,
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
                this.a = this.L/2
            },

           
            RL(){
                let Ri = 0
                Ri = this.w*this.L/2 + this.P/2 + (this.M1 - this.M2)/this.L
                // _.forEach(this.PL, (Pi,j)=>{
                //     let a = Pi.a
                //     let b = this.L -Pi.a
                //     let P = Pi.a

                //     Ri =  Ri + P*Math.pow(b,2)*(3*a+b)/Math.pow(this.L,3)
                // }) 
                return Ri
            },//RR

            RR(){
                let Ri = 0
                Ri = this.w*this.L/2 + this.P/2 - (this.M1 - this.M2)/this.L
                // _.forEach(this.PL, (Pi,j)=>{
                //     let a = Pi.a
                //     let b = this.L -Pi.a
                //     let P = Pi.a

                //     Ri =  Ri + P*Math.pow(a,2)*(a+3*b)/Math.pow(this.L,3)
                // }) 
                return Ri
            },//RR

            Mi(){
                let M = []
                let Mx = 0

                _.forEach(this.Lx(), (x,i) =>{
                    Mx = this.w*x*(this.L-x)/2 + (this.M1-this.M2)*x/this.L - this.M1
                    _.forEach(this.PL, (Pi,j)=>{
                        let a = Pi.a
                        let b = this.L - a
                        let P = Pi.P
                        if(x <= a){
                            Mx =  Mx + P/2*x
                        }//IF
                        else{
                            Mx =  Mx + P/2*(this.L-x)
                        }//ELSE
                    })//P LOOP
                    M.push(Mx)
                })

                return M
            },//Mi

            M(){
                return _.max(this.Mi)
            },
            ML(){
                return _.first(this.Mi)
            },
            MR(){
                return _.last(this.Mi)
            },

            Vi(){
                let V = []
                let Vx = 0

                _.forEach(this.Lx(), (x,i) =>{
                    Vx = this.w*(this.L/2 - x) + (this.M1-this.M2)/this.L
                    _.forEach(this.PL, (Pi,j)=>{
                        let a = Pi.a
                        let b = this.L - a
                        let P = Pi.P
                        if(x <= a){
                            Vx =  Vx + P/2
                        }//IF
                        else{
                            Vx =  Vx + P/2 - P
                        }//ELSE
                    })//P LOOP
                    V.push(Vx)
                })//X LOOP

                //this.V = _.max(V)

                return V
            },//Vi

            Di(){
                let D = []
                let Dx = 0
               
                _.forEach(this.Lx(), (x,i) =>{
                    Dx = this.w*x*1728/(24*this.E*this.Ix())*(Math.pow(x,3)-(2*this.L+4*this.M1/(this.w*this.L)-4*this.M2/(this.w*this.L))*Math.pow(x,2)+12*this.M1*x/this.w+Math.pow(this.L,3)-8*this.M1*this.L/this.w-4*this.M2*this.L/this.w)
                    _.forEach(this.PL, (Pi,j)=>{
                        let a = Pi.a
                        let b = this.L - a
                        let P = Pi.P
                        if(x <= a){
                           Dx =  Dx + (P*b*x*1728)/(6*this.E*this.Ix()*this.L)*(Math.pow(this.L,2)-Math.pow(b,2)-Math.pow(x,2))
                        }//IF
                        else{
                            Dx =  Dx + (P*a*(this.L - x)*1728)/(6*this.E*this.Ix()*this.L)*(2*this.L*x-Math.pow(x,2)-Math.pow(a,2))
                        }//ELSE
                    })//P LOOP
                    D.push(Dx)
                })//X LOOP

                //this.D = _.max(D)

                return D

            },//Di

            D(){
                return _.max(this.Di)
            }
        
        },//COMPUTED
        methods:{
            addP(){
                this.id += 1
                this.PL.push({id:this.id, P:this.P, a : this.a})
            },
            deleteP(id){
                console.log("Delete id " + id)
               this.PL = _.reject(this.PL, {"id" : id});
            },

            Lx(){
                return _.concat(_.range(0, this.L, 0.1),this.L)
            },//Lx
            Ix(){
                return this.b * Math.pow(this.h,3)/12
            }
            

        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>