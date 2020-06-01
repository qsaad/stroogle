import SimpleBeam from '@/classes/analysis/clsSimpleBeam'

export default class CantileverBeam extends SimpleBeam{
    constructor({L=12,UDL=1,ULL=1,PTL,Ix=100,E=29000,method='ASD' }){
        super({L, UDL, ULL, PTL, Ix, E, method})
       
    }//CONSTRUCTOR

    //---------------------------------------------------
    //REACTION
    //---------------------------------------------------
    RL(Type){
        
        return 0
    }

    RR(Type){
        let Ri = 0
        let L = this.L
        let LF = (Type == 'DL') ? this.DLF : this.LLF
        let w = (Type == 'DL') ? this.UDL : this.ULL

        Ri = (w * LF) * L
        _.forEach(this.PTL, (P,j)=>{
            let a = P.PX
            let b = L - a
            let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
            Ri =  Ri + Pi
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
        let LF = (Type == 'DL') ? this.DLF : this.LLF
        let w = (Type == 'DL') ? this.UDL : this.ULL

        _.forEach(this.Lx(), (x,i) =>{
            Mi = (w * LF)*x*x/2
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
                if(x <= a){
                    Mi = Mi + 0
                }//IF
                else{
                    Mi = Mi  - Pi*(x-a)
                }//ELSE
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
            Vi = (w * LF) * x
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
                if(x <= a){
                    Vi = Vi + 0
                }//IF
                else{
                    Vi = Vi - Pi
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
            Di = w*1728/(24*E*Ix)*(Math.pow(x,4)-4*Math.pow(L,3)*x+3*Math.pow(L,4))
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD  : P.PL 
                if(x <= a){
                    Di = Di + Pi*Math.pow(b,2)*1728/(6*E*Ix)*(3*L-3*x-b)
                }//IF
                else{
                    Di =  Di + (Pi*Math.pow(L-x,2)*1728)/(6*E*Ix)*(3*b-L-x)
                }//ELSE
            })//P LOOP
            D.push(Di)
        })//X LOOP

        return D

    }//Dx

}//CLASS