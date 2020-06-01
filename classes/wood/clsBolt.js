import Fastener from '@/classes/wood/clsFastener'
import * as LagBolts from '@/data/wood/LagBolts'
import * as HexBolts from '@/data/wood/HexBolts'
import {sin,cos,ArrayMin} from '@/library/functions'

export default class Bolt extends Fastener{
    constructor({method,duration,moisture,temperature,L,D,ts,tm,Gs,Gm,shearPlane,
                category="Wood to Wood",type="Lag Bolts",size="1/4 x 3",direction='Side',
                noRow=1,noCol=2,rowSpa=3,colSpa=3,
                bs=3.5,theta_s=0,Es=1700000,end_s=0,edge_s=3,
                bm=3.5,theta_m=0,Em=1700000,end_m=3,edge_m=10,}){
        super({ method,duration,moisture,temperature,L,D,ts,tm,Gs,Gm,shearPlane})
        this.category = category
        this.type = type
        this.size = size
        this.noRow = noRow
        this.noCol = noCol
        this.rowSpa = noRow > 1 ? rowSpa : 0
        this.colSpa = noCol > 1 ? colSpa : 0

        this.ts = ts
        this.bs = bs
        this.Gs = Gs
        this.Es = this.category == "Metal to Wood" ? 29000000 : Es
        this.theta_s = theta_s
        this.end_s = end_s
        this.edge_s = noRow > 1 ? (this.bs-(this.noRow-1)*this.rowSpa)/2 : this.bs/2

        this.tm = tm
        this.bm = bm
        this.Gm = Gm
        this.Em = Em
        this.theta_m = theta_m
        this.end_m = theta_m == 0 ? end_m : 10
        this.edge_m = theta_m == 90 ? edge_m : (noRow > 1 ? (this.bm-(this.noRow-1)*this.rowSpa)/2 : this.bm/2)

        this.sizeList = this.type == "Lag Bolts" ? LagBolts.List : HexBolts.List
        this.data = _.find(this.sizeList, {'size': size})
        this.L = this.type == "Hex Bolts" ? 6 : this.data.L
        this.D = this.type == "Hex Bolts" ? this.data.D : this.data.Dr
        this.T_E = this.type == "Hex Bolts" ? 0 : this.data.T - this.data.E
        this.Fyb = 45000
        this.lm = this.category == "Wood to Concrete" ? 6 : this.p()
        this.ls = this.ts
        this.endgrain = direction == 'Side' ? false : true

        this.Ft1_s = 100
        this.Fv1_s = 200
        this.Ft1_m = 100
        this.Fv1_m = 200
    }//CONSTRUCTOR

    //--------------------------------------
    //FACTORS
    //--------------------------------------
    //TOE NAIL FACTOR
    Ctn(){
        return this.toenail ? {Z:0.83, W:0.67} : {Z:1, W:1}
    }//Ctn

    //END GRAIN FACTOR
    Ceg(){
        return this.endgrain ? 0.67 : 1
    }//Ceg

    //GROUP ACTION FACTOR
    Cg(){
        let As = this.shearPlane == 1 ? this.bs * this.ts  : 2*this.bs * this.ts 
        let Am = this.bm * this.tm 
        let REA = Math.min((this.Es*As)/(this.Em*Am), (this.Em*Am)/(this.Es*As))
        let gamma = this.category == "Metal to Wood" ? 270000*Math.pow(this.D,1.5) : 180000*Math.pow(this.D,1.5) 
        let u = 1 + gamma*(this.colSpa/2)*(1/(this.Em*Am) + 1/(this.Es*As))
        let m = u - Math.pow(u*u-1,0.5)
        let n = this.noCol

        let k1 = m*(1-Math.pow(m,2*n))
        let k2 = n*((1 + REA*Math.pow(m,n))*(1+m)-1 + Math.pow(m,2*n))
        let k3 = 1 + REA
        let k4 = 1 - m

        let Z = this.noCol > 1 ? k1/k2*k3/k4 : 1

        return {REA,gamma,u,m,n,k1,k2,k3,k4,Z,As,Am}
    }

    Spacing_Par(){
        let k = this.shearPlane == 1 ? 1 : 2
        return {
            end : 7*this.D,
            edge : 1.5*this.D,
            colSpa : 4*this.D,
            rowSpa : 1.5*this.D
        }
    }

    Spacing_Per(){
        return{
            end : 4*this.D,
            edge : 4*this.D,
            colSpa : 4*this.D,
            rowSpa : 4* this.D
        }
    }

    //GEOMETRY FACTOR
    C_delta(){
        let k_end_s = ArrayMin(this.end_s/(this.theta_s == 0 ? this.Spacing_Par().end : this.Spacing_Per().end),1)
        let k_edge_s = ArrayMin(this.edge_s/(this.theta_s == 0 ? this.Spacing_Par().edge : this.Spacing_Per().edge),1)
        let k_end_m = ArrayMin(this.end_m/(this.theta_m == 0 ? this.Spacing_Par().end : this.Spacing_Per().end),1)
        let k_edge_m = ArrayMin(this.edge_m/(this.theta_m == 0 ? this.Spacing_Par().edge : this.Spacing_Per().edge),1)

        let k_rowSpa_s = ArrayMin(this.rowSpa/(this.theta_s == 0 ? this.Spacing_Par().rowSpa: this.Spacing_Per().rowSpa),1)
        let k_colSpa_s = ArrayMin(this.colSpa/(this.theta_s == 0 ? this.Spacing_Par().colSpa : this.Spacing_Per().colSpa),1)

        let k_rowSpa_m = ArrayMin(this.rowSpa/(this.theta_m == 0 ? this.Spacing_Par().rowSpa: this.Spacing_Per().rowSpa),1)
        let k_colSpa_m = ArrayMin(this.colSpa/(this.theta_m == 0 ? this.Spacing_Par().colSpa : this.Spacing_Per().colSpa),1)

        k_end_s = this.category == "Metal to Wood" ? 1 :  k_end_s
        k_edge_s = this.category == "Metal to Wood" ? 1 :  k_edge_s

        let Z = ArrayMin(k_end_s, k_edge_s, k_end_m, k_edge_m,k_rowSpa_s, k_colSpa_s, k_rowSpa_m, k_colSpa_m)

        return {k_end_s, k_edge_s, k_end_m, k_edge_m, k_rowSpa_s, k_colSpa_s, k_rowSpa_m, k_colSpa_m,Z}
    }

    Fu(){
        return this.ts < 0.25 ? 45000 : 58000
    }

    K_theta(){
        return 1 + Math.max(this.theta_s, this.theta_m)/360
    }
    
    Fes(){
        switch(this.category){
            case ('Metal to Wood'):
                return this.ts < 0.25 ? 1.375*this.Fu() : 1.5*this.Fu()
                break
            default:
                let para = 11200*this.Gs
                let perp = 6100*Math.pow(this.Gs,1.45)*Math.pow(this.D,-0.5)
                return (para * perp)/(para*Math.pow(sin(this.theta_s),2) + perp*Math.pow(cos(this.theta_s),2))
                break
        }//SWITCH
	}//Fes

	Fem(){
        switch(this.category){
            case ('Wood to Concrete'):
                return 7500
                break
            default:
                let para = 11200*this.Gm
                let perp = 6100*Math.pow(this.Gm,1.45)*Math.pow(this.D,-0.5)
                return (para * perp)/(para*Math.pow(sin(this.theta_m),2) + perp*Math.pow(cos(this.theta_m),2))
                break
        }//SWITCH
    }//Fem

    //PENETRATION IN MAIN MEMBER
    p(){
        if(this.type == "Hex Bolts"){
            return this.tm
        }
        else{
            if((this.L-this.ts)/this.D >= 10){
                return Math.min(this.L-this.ts,this.tm)
            }
            else{
                return Math.min(this.L-this.ts-this.data.E,this.tm)
            }
        }
    }//P

    //THREAD PENETRATION FOR LAG BOLTS IN MAIN MEMBER FOR WITHDRAWAL
    Pw(){
        return this.T_E
    }

    //------------------------------------------------------------------------
    //MODES
    //------------------------------------------------------------------------
     //MODE Im
	Im(){
        return this.D*this.lm*this.Fem()/(4*this.K_theta())
    }
    //MODE Is
    Is(){
        let k = 0
        k = this.D*this.ls*this.Fes()/(4*this.K_theta())
        return this.shearPlane == 1 ? k : 2*k
    }  
    //MODE II
    II(){
        let k = 0
        k = this.k().k1*this.D*this.ls*this.Fes()/(3.6*this.K_theta())
        return this.shearPlane == 1 ? k : 0
    }
    //MODE IIIm
    IIIm(){
        let k = 0
        k = this.k().k2*this.D*this.lm*this.Fem()/((1+2*this.Re())*3.2*this.K_theta())
        return this.shearPlane == 1 ? k : 0
    }
    //MODE IIIs
    IIIs(){
        let k = 0
        k = this.k().k3*this.D*this.ls*this.Fem()/((2+this.Re())*3.2*this.K_theta())
        return this.shearPlane == 1 ? k : 2*k
    }
    //MODE IV
    IV(){
        let k = 0
        k = (Math.pow(this.D,2)/(3.2*this.K_theta()))*Math.pow((2*this.Fem()*this.Fyb)/(3*(1+this.Re())),0.5)
        return this.shearPlane == 1 ? k : 2*k
    }
    //--------------------------------------
    //PARAMETERS
    //--------------------------------------
    params(){
        return {
            //Cg
            REA : (this.Cg().REA).toFixed(2),
            gamma : (this.Cg().gamma).toFixed(2),
            u : (this.Cg().u).toFixed(2),
            m : (this.Cg().m).toFixed(2),
            n : this.noCol,
            As : (this.Cg().As).toFixed(2),
            Am : (this.Cg().Am).toFixed(2),
            // Cg_k1 : (this.Cg().k1).toFixed(2),
            // Cg_k2 : (this.Cg().k2).toFixed(2),
            // Cg_k3 : (this.Cg().k3).toFixed(2),
            // Cg_k4 : (this.Cg().k4).toFixed(2),
            
            R_end_s : (this.C_delta().k_end_s).toFixed(2),
            R_edge_s : (this.C_delta().k_edge_s).toFixed(2),
            R_end_m : (this.C_delta().k_end_m).toFixed(2),
            R_edge_m : (this.C_delta().k_edge_m).toFixed(2),
            R_rowSpa_s : (this.C_delta().k_rowSpa_s).toFixed(2),
            R_colSpa_s : (this.C_delta().k_colSpa_s).toFixed(2),
            R_rowSpa_m : (this.C_delta().k_rowSpa_m).toFixed(2),
            R_colSpa_m : (this.C_delta().k_colSpa_m).toFixed(2),

            L : this.L,
            D : (this.D).toFixed(3),
            p : this.p(),
            pd : (this.p()/this.D).toFixed(0) + 'd',
            Fyb : (this.Fyb).toFixed(0),
            Fes : (this.Fes()).toFixed(0),
            Fem : (this.Fem()).toFixed(0),
            Re : (this.Re()).toFixed(2),
            Rt : (this.Rt()).toFixed(2),
            k1 : (this.k().k1).toFixed(2),
            k2 : (this.k().k2).toFixed(2),
            k3 : (this.k().k3).toFixed(2),
            K_theta : (this.K_theta()).toFixed(2),
            Im : (this.Im()).toFixed(2),
            Is : (this.Is()).toFixed(2),
            II : (this.II()).toFixed(2),
            IIIm : (this.IIIm()).toFixed(2),
            IIIs : (this.IIIs()).toFixed(2),
            IV : (this.IV()).toFixed(2),

            edge_s : (this.edge_s).toFixed(2),
            edge_m : (this.edge_m).toFixed(2),

            Znt_s : (this.Znt('Side')).toFixed(0),
            Zrt_s : (this.Zrt('Side')).toFixed(0),
            Zgt_s : (this.Zgt('Side')).toFixed(0),

            Znt_m : (this.Znt('Main')).toFixed(0),
            Zrt_m : (this.Zrt('Main')).toFixed(0),
            Zgt_m : (this.Zgt('Main')).toFixed(0),
            //Cg
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
                Cg : this.Cg().Z,
                C_delta : this.C_delta().Z,
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
                Cg : 0,
                C_delta : 0,
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
        return this.Z()*this.CD()*this.CM().Z*this.Ct().Z*this.Cg().Z*this.C_delta().Z*this.Ceg()
    }
    Zn1(){
        return this.Z()*this.CM().Z*this.Ct().Z*this.Ctn().Z*this.Cg().Z*this.C_delta().Z*this.KF().Z*this.phi().Z*this.TE().Z
    }
    fZn(){
		return (this.method == "ASD" ? this.Z1() : this.Zn1())*this.noCol * this.noRow
    }

    //---------------------------------------------------
    // WOOD TEAR/SHEAR CAPACITY
    //---------------------------------------------------
    //NET SECTION TENSION CAPACITY
    Znt(member){
        let Dh = this.D + 1/16
        let Ft1 = member == "Side" ? this.Ft1_s : this.Ft1_m
        let B = member == "Side" ? this.bs : this.bm
        let t = member == "Side" ? this.ts : this.tm
        return Ft1*t*(B - this.noRow*Dh)
    }
    //ROW TEAR OUT CAPACITY
    Zrt(member){
        let Sc =  Math.min(this.colSpa,member == "Side" ? this.end_s : this.end_m)
        let Fv1 = member == "Side" ? this.Fv1_s : this.Fv1_m
        let t = member == "Side" ? this.ts : this.tm
        return this.noCol*Fv1*t*Sc*this.noRow
    }
    //GROUP TEAR OUT CAPACITY
    Zgt(member){
        let Ft1 = member == "Side" ? this.Ft1_s : this.Ft1_m
        let Dh = this.D + 1/16
        let t = member == "Side" ? this.ts : this.tm
        return this.Zrt()/this.noRow + Ft1*t*((this.noRow -1)*(this.rowSpa-Dh))
    }

    //---------------------------------------------------
    // WITHDRAWAL CAPACITY
    //---------------------------------------------------
    W(){
        return 2850*Math.pow(this.Gm,3/2)*Math.pow(this.D,3/4)*this.Pw()
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