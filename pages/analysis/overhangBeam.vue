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
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
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
                                
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                                <!-- GRAPHICS -->
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                                <!-- POINT LOAD -->
                                <konva-point-load :xo="0.1*width" :yo="0.25*height" :width="0.8*width" :span="L+a" :pointLoads="PL" @delete-point-load="deleteP" v-if="PL.length > 0"></konva-point-load>
                                <!-- SPAN UNIFORM LOAD -->
                                <konva-text :xo="(L/2)*0.8*width/(L+a)" :yo="0.33*height" :text="ws" :unit="'k/ft'" v-if="ws > 0"></konva-text>
                                <konva-uniform-load :xo="0.1*width" :yo="0.38*height" :width="0.8*width*L/(L+a)" :height="0.01*height" v-if="ws > 0"></konva-uniform-load>
                                <!-- CANTILEVER UNIFORM LOAD -->
                                <konva-text :xo="0.8*width" :yo="0.33*height" :text="wc" :unit="'k/ft'" v-if="wc > 0"></konva-text>
                                <konva-uniform-load :xo="0.1*width + 0.8*width*L/(L+a)" :yo="0.38*height" :width="a*0.8*width/(L+a)" :height="0.01*height" v-if="wc > 0"></konva-uniform-load>
                                <!-- FULL UNIFORM LOAD -->
                                <konva-text :xo="0.4*width" :yo="0.41*height" :text="w" :unit="'k/ft'" v-if="w > 0"></konva-text>
                                <konva-uniform-load :xo="0.1*width" :yo="0.46*height" :width="0.8*width" :height="0.01*height" v-if="w > 0"></konva-uniform-load>
                                <!-- SPAN -->
                                <konva-span :xo="0.1*width" :yo="0.5*height" :length="0.8*width" :height="0"></konva-span>
                                <konva-text :xo="(L/2)*0.8*width/(L+a)" :yo="0.55*height" :text="L" :unit="'ft'" v-if="L > 0"></konva-text>
                                <konva-text :xo="0.85*width" :yo="0.55*height" :text="a" :unit="'ft'" v-if="a > 0"></konva-text>
                                <!-- LEFT REACTIONS -->
                                <konva-support :xo="0.1*width" :yo="0.53*height" :radius="7" :rotation="0"></konva-support>
                                <konva-text :xo="0.05*width" :yo="0.55*height" :text="RL" :unit="'k'"></konva-text>
                                 <!-- RIGHT REACTIONS -->
                                <konva-support :xo="0.1*width + 0.8*width*L/(L+a)" :yo="0.53*height" :radius="7" :rotation="0"></konva-support>
                                <konva-text :xo="0.05*width + 0.8*width*L/(L+a)" :yo="0.55*height" :text="RR" :unit="'k'"></konva-text>

                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                                <!-- RESULTS -->
                                <!-- +++++++++++++++++++++++++++++++++++++++++ -->
                                <!-- MOMENT -->
                                <konva-text :xo="0.38*width" :yo="0.64*height" symbol="M" :text="M" unit="k-ft" ></konva-text>
                                <konva-text :xo="0.7*width" :yo="0.64*height" symbol="Mc" :text="Mc" unit="k-ft" ></konva-text>
                                <konva-plot-force :xo="0.1*width" :yo="0.8*height" :L="0.8*width" :dataPoints="Mi" :fill="'blue'" :opacity="0.6" :SF="SF(M)"></konva-plot-force>
                                <!-- SHEAR -->
                                <konva-plot-force :xo="0.1*width" :yo="0.80*height" :L="0.8*width" :dataPoints="Vi" :type="'V'" :fill="'red'" :opacity="0.6"></konva-plot-force>
                                <!-- DEFLECTION -->
                                <konva-text :xo="0.38*width" :yo="0.7*height" symbol="D" :text="D" unit="in" ></konva-text>
                                <konva-text :xo="0.85*width" :yo="0.7*height" symbol="Dc" :text="Dc" unit="in" ></konva-text>
                                <konva-plot-deflection :xo="0.1*width" :yo="0.50*height" :L="0.8*width" :dataPoints="Di" :fill="'blue'"></konva-plot-deflection>
                            </v-layer>
                        </v-stage>
                    </v-card-text>
                 </v-card>
             </v-flex>
            {{design}}
             <v-flex xs12 md3>
                 <v-card hover height="100%" class="pa-2">
                    <v-card-title class="font-weight-bold title px-1 pt-0 pb-2 ma-0">
                        INPUT
                    </v-card-title>
                    <v-card-text class="text-xs-center pa-0 ma-0">
                        <v-text-field label="w" flat outline v-model.number="w" suffix="k/ft" v-if="isEdit == 'UDL'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="ws" flat outline v-model.number="ws" suffix="k/ft" v-if="isEdit == 'UDL'" class="pa-0 ma-0"></v-text-field> 
                        <v-text-field label="wc" flat outline v-model.number="wc" suffix="k/ft" v-if="isEdit == 'UDL'" class="pa-0 ma-0"></v-text-field>
                        <v-btn @click="addP" class="blue" ripple block v-if="isEdit == 'P'">Add P</v-btn>
                        <v-text-field label="P" flat outline v-model.number="P" suffix="k" v-if="isEdit == 'P'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="x" flat outline v-model.number="x" suffix="ft" v-if="isEdit == 'P'" class="pa-0 ma-0"></v-text-field>
                        
                        <v-text-field label="L" flat outline v-model.number="L" suffix="ft" v-if="isEdit == 'SPAN'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="a" flat outline v-model.number="a" suffix="ft" v-if="isEdit == 'SPAN'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="b" flat outline v-model.number="b" suffix="in" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="h" flat outline v-model.number="h" suffix="in" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                        <v-text-field label="E" flat outline v-model.number="E" suffix="ksi" v-if="isEdit == 'SIZE'" class="pa-0 ma-0"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="pa-0 ma-0">
                    </v-card-actions>
                 </v-card>
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
    import PlotForces from '@/components/PlotForces.vue'

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

    import OverhangBeam from '@/classes/analysis/clsOverhangBeam'

    import {graphics} from '@/mixins/graphicsMixin'

    //import VueApexCharts from 'vue-apexcharts'

    import _ from 'lodash'

    export default {
        middleware: ['auth'],
        components:{
                ModuleCard, ValueNumber, ValueParameter, ValueMessage, ValueCheck, ValueComputed, ValueInteraction,
                PlotForces,
                KonvaPlotForce, KonvaText, KonvaLabel, KonvaUniformLoad, KonvaSpan,
                KonvaArrow, KonvaSupport, KonvaAddPointLoad, KonvaPointLoad, KonvaPlotDeflection, KonvaRect
        },//COMPONENTS
        mixins : [graphics],
        data(){
            return{
                L: 12,
                a : 4,
                w : 1,
                ws : 0,
                wc : 0,
                id : 0,
                P : 5,
                x : 2,
                E : 3000,
                b : 6,
                h : 10,
                I : 200,
                PL : [],
                Mx : [],
                Vx : [],
                Dx : [],
                //M : 0,
                //Mc : 0,
                //D : 0,
                //Dc : 0,
                messages : [],
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
            RL(){
                let Ri = 0
                Ri = this.w*(Math.pow(this.L,2) - Math.pow(this.a,2))/(2*this.L) + this.wc*Math.pow(this.a,2)/(2*this.L) + this.ws*this.L/2
                _.forEach(this.PL, (Pi,j)=>{
                    if(Pi.a < this.L){
                        Ri =  Ri + Pi.P*(this.L -Pi.a)/this.L
                    }
                    else{
                        Ri =  Ri - Pi.P*(Pi.a - this.L)/this.L
                    }
                    
                }) 
                return Ri
            },//RR

            RR(){
                let Ri = 0
                Ri = this.w*Math.pow(this.L + this.a, 2)/(2*this.L) + this.wc*this.a*(2*this.L + this.a)/(2*this.L) + this.ws*this.L/2
                _.forEach(this.PL, (Pi,j)=>{
                    Ri =  Ri + Pi.P*Pi.a/this.L
                }) 
                return Ri
            },//RR

            Mi(){
                let M = []
                let Mx = 0
                let x1 = 0

                _.forEach(this.Lx(), (x,i) =>{
                    x1 = x - this.L
                    if(x <= this.L){
                        Mx = this.w*x*( Math.pow(this.L,2)-Math.pow(this.a,2)-x*this.L)/(2*this.L) + this.ws*x*(this.L-x)/2 - this.wc*Math.pow(this.a,2)*x/(2*this.L)
                    }
                    else{
                        Mx = -this.w*Math.pow(this.a - (x - this.L),2)/2 - this.wc*Math.pow(this.a - (x - this.L),2)/2
                    }
                    _.forEach(this.PL, (Pi,j)=>{
                        let a = Pi.a
                        let b = this.L - a
                        let P = Pi.P
                        if(a <= this.L){
                            if(x <= a){
                                Mx =  Mx + P*b*x/this.L
                            }//IF
                            else{
                                if(x <= this.L){
                                    Mx =  Mx + P*b*x/this.L - P*(x-a)
                                }
                                else{
                                    Mx =  Mx
                                }
                            }//ELSE
                        }
                        else{
                            if(x <= this.L){
                                Mx =  Mx + P*(this.a-this.L)*x/this.L
                            }
                            else{
                                Mx =  Mx - P*(this.a-this.L)*(x-(this.L+this.a))/this.a

                            }
                        }
                    })//P LOOP

                    M.push(Mx)
                })

                

                return M
            },//Mi

            M(){
                return _.max(this.Mi)
            },
            Mc(){
                let arr = _.map(this.Mi, item =>{
                    if(item < 0){
                        return Math.abs(item)
                    }
                })
                return _.max(arr)
            },

            Vi(){
                let V = []
                let Vx = 0
                let x1 = 0

                _.forEach(this.Lx(), (x,i) =>{
                    x1 = x - this.L
                    if(x <= this.L){
                        Vx = this.w*(Math.pow(this.L,2)-Math.pow(this.a,2))/(2*this.L)-this.w*x + this.ws*(this.L/2 - x) + this.wc*Math.pow(this.a,2)/(2*this.L)
                    }
                    else{
                        Vx = this.w*(this.a - x1) - this.wc*(this.a-x1)
                    }
                    
                    _.forEach(this.PL, (Pi,j)=>{
                        let a = Pi.a
                        let b = this.L - a
                        let P = Pi.P

                        if(a <= this.L){
                            if(x <= this.L){
                                if(x <= a){
                                    Vx =  Vx + P*b/this.L
                                }//IF
                                else{
                                    Vx =  Vx + P*b/this.L - P
                                }//ELSE
                            }
                            else{
                                Vx = 0
                            }
                        }
                        else{
                            if(x <= this.L){
                                Vx =  Vx + P*x1/this.L
                            }
                            else{
                                Vx =  Vx + P*(this.L+x1)/this.L
                            }
                        }
                    })//P LOOP
                    V.push(Vx)
                })//X LOOP

                this.V = _.max(V)

                return V
            },//Vi

            Di(){
                let D = []
                let Dw,Dws,Dwc = 0
                let Dx = 0
                let x1 = 0
                _.forEach(this.Lx(), (x,i) =>{
                    x1 = x-this.L
                    if(x < this.L){
                        Dw = this.w*x*(Math.pow(this.L,4)-2*Math.pow(this.L,2)*Math.pow(x,2)+this.L*Math.pow(x,3)-2*Math.pow(this.a,2)*Math.pow(this.L,2)+2*Math.pow(this.a,2)*Math.pow(x,2))*1728/(24*this.E*this.Ix()*this.L)
                        Dws = this.ws*x*(Math.pow(this.L,3)-2*this.L*Math.pow(x,2)+Math.pow(x,3))*1728/(24*this.E*this.Ix())
                        Dwc = -this.wc*Math.pow(this.a,2)*x*(Math.pow(this.L,2)-Math.pow(x,2))*1728/(24*this.E*this.Ix()*this.L)
                    }
                    else{
                        Dw = this.w*x1*(4*Math.pow(this.a,2)*this.L-Math.pow(this.L,3)+6*Math.pow(this.a,2)*x1-4*this.a*Math.pow(x1,2)+Math.pow(x1,3))*1728/(24*this.E*this.Ix())
                        Dws = -this.ws*Math.pow(this.L,3)*x1*1728/(24*this.E*this.Ix())
                        Dwc = this.wc*x1*(4*Math.pow(this.a,2)*this.L+6*Math.pow(this.a,2)*x1-4*this.a*Math.pow(x1,2)+Math.pow(x1,3))*1728/(24*this.E*this.Ix())
                   }

                   Dx = Dw + Dws + Dwc
                    _.forEach(this.PL, (Pi,j)=>{
                        let a = Pi.a
                        let b = this.L - a
                        let P = Pi.P
                        if(this.a <= this.L){
                            if(x <= this.L){
                                if(x <= a){
                                    Dx =  Dx + (P*b*x*1728)/(6*this.E*this.Ix()*this.L)*(Math.pow(this.L,2)-Math.pow(b,2)-Math.pow(x,2))
                                }//IF
                                else{
                                    Dx =  Dx + (P*a*(this.L - x)*1728)/(6*this.E*this.Ix()*this.L)*(2*this.L*x-Math.pow(x,2)-Math.pow(a,2))
                                }//ELSE
                            }
                            else{
                                Dx = Dx - (P*a*b*x1*1728)/(6*this.E*this.Ix()*this.L)*(this.L + this.a)
                            }
                        }
                        else{
                            if(x <= this.L){
                                Dx =  Dx - (P*a*x*1728)/(6*this.E*this.Ix()*this.L)*(Math.pow(this.L,2)-Math.pow(x,2))
                            }
                            else{
                                Dx =  Dx + (P*x1*1728)/(6*this.E*this.Ix())*(2*this.a*this.L+3*this.a*x1-Math.pow(x1,2))
                            }
                        }
                    })//P LOOP
                    D.push(Dx)
                })//X LOOP

                return D

            },//Di

            D(){
                return _.max(this.Di)
            },

            Dc(){
                return _.last(this.Di)
            },

            design(){
               
            },//DESIGN

            
        
        },//COMPUTED
        methods:{
            addP(){
                this.id += 1
                this.PL.push({id:this.id, P:this.P, a : this.x})
            },
            deleteP(id){
                //console.log("Delete id " + id)
               this.PL = _.reject(this.PL, {"id" : id});
            },

            Lx(){
                return _.concat(_.range(0, this.L + this.a, 0.1),this.L + this.a)
            },//Lx
            Ix(){
                return this.b * Math.pow(this.h,3)/12
            }
            
        }//METHODS

    }//EXPORT DEFAULT
</script>

<style scoped>

</style>