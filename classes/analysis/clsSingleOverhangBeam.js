import SimpleBeam from '@/classes/analysis/clsSimpleBeam'

export default class SingleOverhangBeam extends SimpleBeam{
    constructor({L=12,UDL=1,ULL=1,PTL,Ix=100,E=29000,method='ASD',Lo=2 }){
        super({L, UDL, ULL, PTL, Ix, E, method})
        this.Lo = _.toNumber(Lo)
       
    }//CONSTRUCTOR

    Lx(){
        return _.concat(_.range(0, this.L+this.Lo, 0.5),this.L+this.Lo)
    }

    //---------------------------------------------------
    //REACTION
    //---------------------------------------------------
    RL(Type){
        let Ri = 0
        let L = this.L
        let Lo = this.Lo
        let LF = (Type == 'DL') ? this.DLF : this.LLF
        let w = (Type == 'DL') ? this.UDL : this.ULL

        Ri = (w*LF)/(2*L)*(Math.pow(L,2)-Math.pow(Lo,2))
        _.forEach(this.PTL, (P,j)=>{
            let a = P.PX
            let b = L - a
            let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
            if(a < L){
                Ri =  Ri + Pi*b/L
            }
            else{
                Ri =  Ri + Pi*(x-L)/L
            }
            
        }) 
        return Ri
    }

    RR(Type){
        let Ri = 0
        let L = this.L
        let Lo = this.Lo
        let LF = (Type == 'DL') ? this.DLF : this.LLF
        let w = (Type == 'DL') ? this.UDL : this.ULL

        Ri = (w*LF)/(2*L)*(Math.pow(L+Lo,2))
        _.forEach(this.PTL, (P,j)=>{
            let a = P.PX
            let b = L - a
            let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
            if(a < L){
                Ri =  Ri + Pi*a/L
            }
            else{
                Ri =  Ri + Pi*x/L
            }
            
        }) 
        return Ri
    }

    
    //---------------------------------------------------
    //MOMENT
    //---------------------------------------------------
    Mx(Type){
        let M = []
        let Mi = 0
        let L = this.L
        let Lo = this.Lo
        let LF = (Type == 'DL') ? this.DLF : this.LLF
        let w = (Type == 'DL') ? this.UDL : this.ULL

        _.forEach(this.Lx(), (x,i) =>{
            if(x <= this.L){
                Mi = (w*LF*x)/(2*L)*(Math.pow(L,2)-Math.pow(Lo,2)-x*L)
            }
            else{
                Mi = (w*LF)/2*(Math.pow(Lo-(x-L),2))
            }
            
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
                if(a <= this.L){
                    if(x <= a){
                        Mi = Mi + Pi*b*x/L
                    }//IF
                    else{
                        Mi = Mi + Pi*b*x/L - Pi*(x-a)
                    }//ELSE
                }
                else{
                    Mi = Mi + Pi*(x-L)
                }
            })//P LOOP
            M.push(Mi)
        })//X LOOP

        return M

    }//Mx

    //---------------------------------------------------
    //SHEAR
    //---------------------------------------------------
    Vx(Type){
        let V = []
        let Vi = 0
        let L = this.L
        let LF = (Type == 'DL') ? this.DLF : this.LLF
        let w = (Type == 'DL') ? this.UDL : this.ULL

        _.forEach(this.Lx(), (x,i) =>{
            Vi = 3*(w*LF)*L/8 - (w*LF)*x
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
                if(x <= a){
                    Vi = Vi + Pi*Math.pow(b,2)/(2*Math.pow(L,3))*(a+2*L)
                }//IF
                else{
                    Vi = Vi + Pi*Math.pow(b,2)/(2*Math.pow(L,3))*(a+2*L) - Pi
                }//ELSE
            })//P LOOP
            V.push(Vi)
        })//X LOOP

        return V

    }//Vx

    //---------------------------------------------------
    //DELFECTION
    //---------------------------------------------------
    Dx(Type){
        let D = []
        let Di = 0
        let L = this.L
        let w = (Type == 'DL') ? this.UDL : this.ULL
        let E = this.E
        let Ix = this.Ix

        _.forEach(this.Lx(), (x,i) =>{
            Di = w/(24*E*Ix)*1728*(Math.pow(L,3)-2*L*x*x+Math.pow(x,3))
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD  : P.PL 
                if(x <= a){
                    Di =  Di + (Pi*Math.pow(b,2)*x*1728)/(12*E*Ix*Math.pow(L,3))*(3*a*Math.pow(L,2)-2*L*Math.pow(x,2)-a*Math.pow(x,2))
                }//IF
                else{
                    Di =  Di + (Pi*a*Math.pow(L-x,2)*1728)/(12*E*Ix*Math.pow(L,3))*(3*Math.pow(L,2)*x-Math.pow(a,2)*x-2*Math.pow(a,2)*L)
                }//ELSE
            })//P LOOP
            D.push(Di)
        })//X LOOP

        return D

    }//Dx

}//CLASS