import Fastener from '@/classes/wood/clsFastener'
import * as CommonNails from '@/data/wood/CommonNails'
import * as BoxNails from '@/data/wood/BoxNails'
import {sin,cos,ArrayMin} from '@/library/functions'

export default class Nail extends Fastener{
    constructor({method,duration,moisture,temperature,L,D,ts,tm,Gs,Gm,shearPlane,direction="Side",size="10d",category="Wood to Wood",type="Common Nails"}){
        super({ method, duration, moisture, temperature,L,D,ts,tm,Gs,Gm,shearPlane})
        this.size = size
        this.ts = ts
        this.tm = tm
        this.Gs = Gs
        this.Gm = Gm
        this.category = category
        this.type = type
        this.sizeList = this.type == "Common Nails" ? CommonNails.List : BoxNails.List
        this.data = _.find(this.sizeList, {'size': size})
        this.L = this.data.L
        this.D = this.data.D
        this.H = this.data.H
        this.Fyb = this.data.Fyb
        this.lm = this.p()
        this.ls = this.ts
        this.toenail = direction == 'Side' ? false : direction == 'Toenail' ? true : false
        this.endgrain = direction == 'Side' ? false : direction == 'Endgrain' ? true : false
        //this.endgrain = endgrain
    }//CONSTRUCTOR

    //--------------------------------------
    //FACTORS
    //--------------------------------------
    //EDGE SPACING
    S_edge(){
        return 2.5*this.D
    }
    //END SPACING
    S_end(){
        return 15*this.D
    }
    //CENTER TO CENTER SPACING
    S_cc(){
        return 15*this.D
    }
    //ROW SPACING
    S_row(){
        return 5*this.D
    }

    //TOE NAIL FACTOR
    Ctn(){
        return this.toenail ? {Z:0.83, W:0.67} : {Z:1, W:1}
    }//Ctn

    //END GRAIN FACTOR
    Ceg(){
        return this.endgrain ? 0.67 : 1
    }//Ceg

    Fes(){
        switch(this.category){
            case ('Wood to Wood'):
                return 16600*Math.pow(this.Gs,1.84)
                break
            case ('Metal to Wood'):
            return this.ts < 0.25 ? 1.375*this.Fu() : 1.5*this.Fu()
                break
            case ('Panel to Wood'):
                return 4650
                break
        }//SWITCH
    }//Fes

    Fem(){
        return 16600*Math.pow(this.Gm,1.84)
    }//Fes

    KD(){
        return (this.D <= 0.17) ? 2.2 : 10*this.D + 0.5
    }//KD

    //------------------------------------------------------------------------
    //FASTENER PENETRATION
    //------------------------------------------------------------------------
	p(){
    	return this.toenail ? this.Pw()*sin(30) : Math.min(this.L-this.ts,this.tm)
    }
    pd(){
        return (this.p()/this.D).toFixed(0) + 'd'
    }

    Pw(){
        return this.L - (this.L/3)/cos(30)
    }

    Pl(){
        if(this.toenail == true){
            return this.p() >= 10*this.D ? this.L*cos(30)-this.ts : this.L*cos(30)-this.ts-2*this.D*cos(30)
        }
        else{
            return this.p() >= 10*this.D ? this.L-this.ts : this.L-this.ts-2*this.D
        }
    }
    
    //------------------------------------------------------------------------
    //MODES
    //------------------------------------------------------------------------
    //MODE Im
	Im(){
        return this.D*this.lm*this.Fem()/this.KD()
    }
        
    //MODE Is
    Is(){
        let k = 0
        k = this.D*this.ls*this.Fes()/this.KD()
        return this.shearPlane == 1 ? k : 2*k
    }
        
    //MODE II
    II(){
        let k = 0
        k = this.k().k1*this.D*this.ls*this.Fes()/this.KD()
        return this.shearPlane == 1 ? k : 2*k
    }
        
    //MODE IIIm
    IIIm(){
        let k = 0
        k = this.k().k2*this.D*this.lm*this.Fem()/((1+2*this.Re())*this.KD())
        return this.shearPlane == 1 ? k : 0
    }
        
    //MODE IIIs
    IIIs(){
        let k = 0
        k = this.k().k3*this.D*this.ls*this.Fem()/((2+this.Re())*this.KD())
        return this.shearPlane == 1 ? k : 2*k
    }
        
    //MODE IV
    IV(){
        let k = 0
        k = (Math.pow(this.D,2)/this.KD())*Math.pow((2*this.Fem()*this.Fyb)/(3*(1+this.Re())),0.5)
        return this.shearPlane == 1 ? k : 2*k
    }
        
    //--------------------------------------
    //PARAMETERS
    //--------------------------------------
    params(){
        return {
            S_edge : (this.S_edge()).toFixed(2),
            S_end : (this.S_end()).toFixed(2),
            S_cc : (this.S_cc()).toFixed(2),
            S_row : (this.S_row()).toFixed(2),
            L : this.L,
            D : (this.D).toFixed(3),
            ls : this.ls,
            lm : this.lm,
            pd : (this.p()/this.D).toFixed(0) + 'd',
            Fyb : (this.Fyb).toFixed(0),
            Fes : (this.Fes()).toFixed(0),
            Fem : (this.Fem()).toFixed(0),
            Re : (this.Re()).toFixed(2),
            Rt : (this.Rt()).toFixed(2),
            k1 : (this.k().k1).toFixed(2),
            k2 : (this.k().k2).toFixed(2),
            k3 : (this.k().k3).toFixed(2),
            KD : (this.KD()).toFixed(2),
            Im : (this.Im()).toFixed(0),
            Is : (this.Is()).toFixed(0),
            II : (this.II()).toFixed(0),
            IIIm : (this.IIIm()).toFixed(0),
            IIIs : (this.IIIs()).toFixed(0),
            IV : (this.IV()).toFixed(0),
        }
    }//PARAMS

    //--------------------------------------
    //ADJUSTMENT FACTORS
    //--------------------------------------
    adjustmentFactors(){
		return [
			{	
				name : this.method == "ASD" ? "Z<sup>'</sup>" : "Z<sup>'</sup><sub>n</sub>" ,
				adjusted : this.method == "ASD" ? this.Z1() : this.Zn1(),
				actual : this.Z(), 
				CD : this.method == "ASD" ? this.CD() : 0, 
				CM : this.CM().Z,
				Ct : this.Ct().Z,
                Ctn : this.Ctn().Z,
                Ceg : this.Ceg(),
				KF : this.KF().Z,
				phi : this.phi().Z,
				TE : this.TE().Z
			},//SHEAR
			{	
				name : this.method == "ASD" ? "W<sup>'</sup>" : "W<sup>'</sup><sub>n</sub>",
				adjusted : this.method == "ASD" ? this.W1() : this.Wn1(),
				actual : this.W(), 
				CD : this.method == "ASD" ? this.CD() : 0,  
				CM : this.CM().Z,
				Ct : this.Ct().Z,
                Ctn : this.Ctn().W,
                Ceg : this.Ceg(),
				KF : this.KF().Z,
				phi : this.phi().Z,
				TE : this.TE().Z
			},//WITHDRAWL
		]
	}//ADJUSTMENT FACTORS

    //---------------------------------------------------
    // SHEAR CAPACITY
    //---------------------------------------------------
    //ALLOWABLE CAPACITY
    Z(){
        return ArrayMin(this.Im(),this.Is(),this.II(),this.IIIm(),this.IIIs(),this.IV())
    }

    Z1(){
        return this.Z()*this.CD()*this.CM().Z*this.Ct().Z*this.Ctn().Z*this.Ceg()
    }
    Zn1(){
        return this.Z()*this.CM().Z*this.Ct().Z*this.Ctn().Z*this.Ctn().Z*this.KF().Z*this.phi().Z*this.TE().Z
    }
    fZn(){
		return this.method == "ASD" ? this.Z1() : this.Zn1()
    }
    //---------------------------------------------------
    // WITHDRAWAL CAPACITY
    //---------------------------------------------------
    W(){
        return 1380*Math.pow(this.Gm,5/2)*this.D*this.Pw()
    }
    W1(){
        return this.W()*this.CD()*this.CM().Z*this.Ct().Z*this.Ctn().W
    }
    Wn1(){
        return this.W()*this.CM().Z*this.Ct().Z*this.Ctn().W*this.KF().Z*this.phi().Z*this.TE().Z
    }
    fWn(){
		return this.method == "ASD" ? this.W1() : this.Wn1()
    }
   

}//CLASS