import * as EquiCoeff from '@/data/ANA_equivalentLoadCoeff'
import _ from 'lodash'

export default class EquivalentLoadBeam{
    constructor({L=12,w=1,NP=0,P=0,I=100,E=29000,supportType="Simple"}){
        this.L = L
        this.w = w
        this.NP = NP
        this.P = P
        this.I = I
        this.E = E
        this.supportType = supportType
        //console.log(EquiCoeff.List)
        this.CFw = _.find(EquiCoeff.List, { n : 10, support : this.supportType})
        this.CFp = this.NP > 0 ? _.find(EquiCoeff.List, { n : this.NP, support : this.supportType}) : {}
        //console.log(this.CFw)
        //console.log(this.CFp)
    }//CONSTRUCTOR

    uniformCoeff(){
        console.log(this.CFw.a)
        console.log(this.CFp.a)
        return {
            a : this.CFw.a,
            b : this.CFw.b,
            c : this.CFw.b,
            d : this.CFw.c,
            e  : this.CFw.d,
        }
    }

    pointCoeff(){
        return {
            a : this.CFp.a,
            b : this.CFp.b,
            c : this.CFp.b,
            d : this.CFp.c,
            e  : this.CFp.d,
        }
    }

    

   uniformForces(){
       return {
           Mp : this.CFw.a * this.w * this.L * this.L,
           Mn : this.CFw.b * this.w * this.L* this.L,
           RL : this.CFw.b * this.w * this.L* this.L,
           RR : this.CFw.c * this.w * this.L* this.L,
           D  : this.CFw.d * this.w * Math.pow(this.L,4) * 1728 / (this.E * this.I),
       }
   }//UNIFORM FORCES

   pointForces(){
        if(this.NP > 0){
            return {
                Mp : this.CFp == null ? 0 : this.CFp.a * this.P * this.L,
                Mn : this.CFp == null ? 0 : this.CFp.b * this.P * this.L,
                RL : this.CFp == null ? 0 : this.CFp.b * this.P * this.L,
                RR : this.CFp == null ? 0 : this.CFp.c * this.P * this.L,
                D  : this.CFp == null ? 0 : this.CFp.d * this.P * Math.pow(this.L,3) * 1728 / (this.E * this.I),
            }
        }
        else{
            return{
                Mp : 0,
                Mn : 0,
                RL : 0,
                RR : 0,
                D  : 0,
            }
        }
    }//POINT FORCES

    totalForces(){
        return{
            Mp : this.uniformForces().Mp + this.pointForces().Mp,
            Mn : this.uniformForces().Mn + this.pointForces().Mn,
            RL : this.uniformForces().RL + this.pointForces().RL,
            RR : this.uniformForces().RR + this.pointForces().RR,
            D  : this.uniformForces().D + this.pointForces().D,
        }
    }//TOTAL FORCES
    

}//CLASS