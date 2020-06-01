import * as Data_L from '@/data/Data_L'
import _ from 'lodash'

export default class SteelCompositeJoist  {
    constructor({DL,CL,SDL,LL,Dj,Lj,Sj,hs,hd,Fc,ShapeTop,ShapeBot,bay_width}) {

        //USER PARAMETERS
        this.DL =  DL
        this.CL = CL
        this.SDL = SDL
        this.LL = LL
        this.Dj = Dj
        this.Lj = Lj
        this.Sj = Sj
        this.hs = _.toNumber(hs)
        this.hd = hd
        this.hc = hs - hd
        this.Fc = Fc/1000
        //DESIGN PARAMETER
        this.Fnc = 43       //JOIST COMPRESSIVE STRESS
        this.Fnt = 50       //JOIST TENSILE STRESS
        this.phi_f = 0.9    //JOIST FLEXURE
        this.phi_c = 0.9    //JOIST COMPRESSION
        this.phi_t = 0.9    //JOIST TENSION
        this.phi_s = 0.9    //SHEARFLEX SCREW
        this.Fy = 50        //JOIST YEILD STRESS

        this.bay_width = bay_width

        this.ShapeTop = _.find(Data_L.ShapeList, {'Shape': ShapeTop})
        this.Atc = this.ShapeTop.A
        this.Ytc = this.ShapeTop.Y
        this.Ttc = this.ShapeTop.T
        this.Itc = this.ShapeTop.IX

        this.ShapeBot = _.find(Data_L.ShapeList, {'Shape': ShapeBot})
        this.Abc = this.ShapeBot.A
        this.Ybc = this.ShapeBot.Y
        this.Tbc = this.ShapeBot.T
        this.Ibc = this.ShapeBot.IX

    }//CONSTRUCTOR


    ws(){
        return this.hd == 1 ? (this.hs-0.5)/12*150 : (this.hs-1)/12*150
    }// WEIGHT OF SLAB
    //---------------------------------------------------------------
    //NON-COMPOSITE CAPACITY
    //--------------------------------------------------------------
    wu_nc(){
        return (1.2*this.DL + 1.6*this.CL)*(this.Sj/12)
    }//NON-COMPOSITE ACTUAL LOAD

    Mu_nc(){
        return this.wu_nc()*Math.pow(this.Lj,2)/(8 * 1000)
    }//NON-COMPOSITE ACTUAL MOMENT

    deff_nc(){
        return this.Dj-this.Ytc-this.Ybc
    }//NON-COMPOSITE EFFECTIVE DEPTH

    fMn_nc(){

        return Math.min(this.Atc*this.deff_nc()*this.Fnc*this.phi_c/12, this.Abc*this.deff_nc()*this.Fnt*this.phi_t/12)
    }//NON-COMPOSITE FLEXURAL CAPACITY

    //---------------------------------------------------------------
    //COMPOSITE CAPACITY
    //--------------------------------------------------------------
    wu_c(){
        return (1.2*(this.DL+this.SDL) + 1.6*this.LL)*(this.Sj/12)
    }//COMPOSITE ACTUAL LOAD

    Mu_c(){
        return this.wu_c()*Math.pow(this.Lj,2)/(8 * 1000)
    }//COMPOSITE ACTUAL MOMENT

    beff(){
        return Math.min(this.Lj*12/4, this.Sj)
    }//EFFECTIVE COMPOSITE SLAB WIDTH

    a(){
        return (this.Abc*this.Fy)/(0.85*this.Fc*this.beff())
    }// SLAB COMPRESSION DEPTH

    deff_c(){
        return this.Dj-this.Ybc+this.hs-this.a()/2
    }//COMPOSITE EFFECTIVE DEPTH

    fMn_c(){
        return this.phi_f*this.Abc*this.Fy*this.deff_c()/12
    }// COMPOSITE FLEXURAL CAPAPCITY

    //---------------------------------------------------------------
    //SHEARFLEX SCREWS
    //--------------------------------------------------------------

    TensionBottomChord(){
        return Math.max(0.5*this.phi_t*this.Abc*this.Fy, this.Mu_c()*12/this.deff_c())
    }// MAXIMUM TENSION IN JOIST BOTTOM CHORD

    Qn(){
        if(this.hd == 1.5){
            switch(true){
                case (this.Ttc<=0.113) :
                    return 4.34
                case (this.Ttc<=0.155) :
                    return 4.51
                case (this.Ttc<=0.187) :
                    return 4.83
                case (this.Ttc<=0.212) :
                    return 4.78
                case (this.Ttc<=0.25) :
                    return 4.73
                case (this.Ttc<=0.313) :
                    return 4.58
                default:
                    return 4.1
            }
        }
        else{
            return 4.4
        }
    }// SHEARFLEX SCREW SHEAR CAPACITY

    Ns(){
        return this.TensionBottomChord()/(this.phi_s*this.Qn())
    }// NUMBER OF SHEARFLEX SCREWS REQUIRED FOR HALF SPAN

    Nr(){
        return this.Lj*12/6+1
    }// TOTAL NUMBER OF DECK RIBS IN SPAN

    //---------------------------------------------------------------
    //DEAD LOAD NON-COMPOSITE DEFLECTION
    //--------------------------------------------------------------
    Ij_chords(){
        let A_chord = this.Atc + this.Abc
        let De = this.Dj - this.Ytc - this.Ybc

        return this.Atc*this.Abc*Math.pow(De,2)/A_chord + this.Itc + this.Ibc
    }//MOMENT OF INERTIA DUE TO JOIST CHORDS ONLY

    Cr(){
        return 0.721 + 0.00725*(this.Lj*12/this.Dj)
    }//MODIFICATION FACTOR

    Ij_modified(){

        return this.Cr()*this.Ij_chords()
    }// MODIFIED MOMENT OF INERTIA

    Deflection_DL_NonComposite(){
        return 5*(this.DL*this.Sj/(12*12))*Math.pow(this.Lj,4)*Math.pow(12,4)/(384*29000000*this.Ij_modified())
    }

    //---------------------------------------------------------------
    //LIVE LOAD COMPOSITE DEFLECTION
    //--------------------------------------------------------------
    Ec(){
        return 1.35*Math.pow(145,1.5)*Math.pow(this.Fc,0.5)
    }

    n(){
       return  29000/this.Ec() 
    }

    Ij_composite(){
        let A_chord = this.Atc + this.Abc
        let De = this.Dj - this.Ytc - this.Ybc

        let Yj = this.Abc*De/A_chord + this.Ybc
        let b = this.beff()/this.n()

        return (A_chord*b*this.hs)/(A_chord+b*this.hs)*Math.pow(this.hd+this.hc/2+Yj,2)+this.Ij_chords()+b*Math.pow(this.hc,3)/12
    }

    Ij_reduced(){
        let c = 0.05
        return this.Ij_composite()*(1-c)/(0.92+79/Math.pow(this.Lj*12/this.Dj,2))
    }

    Deflection_LL_Composite(){
        return 5*(this.LL*this.Sj/(12*12))*Math.pow(this.Lj,4)*Math.pow(12,4)/(384*29000000*this.Ij_reduced())
    }

    //---------------------------------------------------------------
    //VIBRATION
    //--------------------------------------------------------------

    gamma(){
        return (1/this.Cr())-1
    }

    Ieff(){
        return 1/(this.gamma()/this.Ij_chords() + 1/this.Ij_composite())
    }

    wt(){
        //Assume DL = 4, LL = 11 and Joist self wt = 3
        return (this.ws() + 4 + 11 + 3)
    }// TOTAL LOAD FOR VIBRATION CONSIDERATION

    Deff(){
        return 5*(this.wt()*this.Sj/(12*12))*Math.pow(this.Lj,4)*Math.pow(12,4)/(384*29000000*this.Ieff())
    }// DEFLECTION DUE TO Ieff

    Fj(){
        return 0.18*Math.pow(386/this.Deff(),0.5)
    }// JOIST PANEL MODE FREQUENCY

    Ds(){
        return (12*Math.pow(this.hc+this.hd/2,3))/(12*this.n())
    }//SLAB PANEL MODE

    Dsj(){
        return this.Ieff()/(this.Sj/12)
    }//JOIST PANEL MODE

    Cj(){
        return 2
    }

    Bj(){
        return Math.min(this.Cj()*Math.pow(this.Ds()/this.Dsj(),0.25)*this.Lj*12, 2/3*this.bay_width*12)/12
    }

    Wj(){
        return this.wt()*this.Bj()*this.Lj
    }// TOTAL WEIGHT

    beta(){
        return 0.08
    }

    ap_g(){
        return (65*Math.exp(-0.35*this.Fj()))/(this.beta()*this.Wj())*100
    }// PEAK ACCELERATION
    
}//CLASS