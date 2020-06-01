import SimpleBeam from '@/classes/analysis/clsSimpleBeam'

export default class FixedBeam extends SimpleBeam{
    constructor({L=12,UDL=1,ULL=1,PTL,Ix=100,E=29000,method='ASD' }){
        super({L, UDL, ULL, PTL, Ix, E, method})
       
    }//CONSTRUCTOR
    
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
            Mi = (w * LF)/12*(6*L*x-L*L-6*x*x)
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
                if(x <= a){
                    Mi = Mi + Pi*Math.pow(b,2)/Math.pow(L,3)*(3*a+b)*x-Pi*a*Math.pow(b,2)/Math.pow(L,2)
                }//IF
                else{
                    Mi = Mi + Pi*Math.pow(b,2)/Math.pow(L,3)*(3*a+b)*x-Pi*a*Math.pow(b,2)/Math.pow(L,2) - Pi*(x-a)
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
            Vi = (w * LF) * (L/2 - x)
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
                if(x <= a){
                    Vi = Vi + Pi*Math.pow(b,2)/Math.pow(L,3)*(3*a+b)
                }//IF
                else{
                    Vi = Vi + Pi*Math.pow(b,2)/Math.pow(L,3)*(3*a+b) - Pi
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
            Di = w*Math.pow(x,2)*1728/(24*E*Ix)*Math.pow((L-x),2)
            _.forEach(this.PTL, (P,j)=>{
                let a = P.PX
                let b = L - a
                let Pi = (Type == 'DL') ? P.PD  : P.PL 
                if(x <= a){
                    Di = Di + Pi*Math.pow(b,2)*Math.pow(x,2)*1728/(6*E*Ix*Math.pow(L,3))*(3*a*L-2*a*x-L*x)
                }//IF
                else{
                    // **** EQUATION BELOW TO BE COMPLETED ****
                    Di =  Di + (Pi*a*Math.pow(L-x,2)*1728)/(12*E*Ix*Math.pow(L,3))*(3*Math.pow(L,2)*x-Math.pow(a,2)*x-2*Math.pow(a,2)*L)
                }//ELSE
            })//P LOOP
            D.push(Di)
        })//X LOOP

        return D

    }//Dx

}//CLASS