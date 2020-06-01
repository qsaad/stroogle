import _ from 'lodash'

export default class SimpleBeam{
    constructor({L=12,w=1,ULL=1,PL,Ix=100,E=29000}){
        this.L = L
        this.w = w
        this.PL = PL
        this.Ix = Ix
        this.E = E
    }//CONSTRUCTOR

    // constructor({L=12,UDL=1,ULL=1,PTL,Ix=100,E=29000,method='ASD'}){
    //     this.L = _.toNumber(L)
    //     this.UDL = _.toNumber(UDL)
    //     this.ULL = _.toNumber(ULL)
    //     this.PTL = PTL
    //     this.Ix = _.toNumber(Ix)
    //     this.E = _.toNumber(E)
    //     this.method = method
    //     this.DLF = 1
    //     this.LLF = 1

    //     this.loadFactor()
    // }//CONSTRUCTOR

    // loadFactor(){
    //     this.DLF = (this.method == 'ASD') ? 1 : 1.2
    //     this.DLF = (this.method == 'ASD') ? 1 : 1.6
    // }

    Lx(){
        return _.concat(_.range(0, this.L, 0.5),this.L)
    }

    // NoSeg(){
    //     return this.Lx().length
    // }

    // wu(){
    //     return this.DLF*this.UDL  + this.LLF * this.ULL 
    // }

    // wa(){
    //     return this.UDL  +  this.ULL 
    // }

    

    //---------------------------------------------------
    //REACTION
    //---------------------------------------------------
    RL(){
        let Ri = 0
        Ri = this.w*this.L/2
        _.forEach(this.PL, (Pi,j)=>{
            Ri =  Ri + Pi.P*(this.L -Pi.a)/this.L
        }) 
        return Ri
    }//RR


    RR(){
        let Ri = 0
        Ri = this.w*this.L/2
        _.forEach(this.PL, (Pi,j)=>{
            Ri =  Ri + Pi.P*Pi.a/this.L
        }) 
        return Ri
    }//RR

    // RL(Type){
    //     let Ri = 0
    //     let L = this.L
    //     let LF = (Type == 'DL') ? this.DLF : this.LLF
    //     let w = (Type == 'DL') ? this.UDL : this.ULL

    //     Ri = (w * LF) * L/2
    //     _.forEach(this.PTL, (P,j)=>{
    //         let a = P.PX
    //         let b = L - a
    //         let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF

    //         Ri =  Ri + Pi*b/L
    //     }) 
    //     return Ri
    // }

    // RR(Type){
    //     let Ri = 0
    //     let L = this.L
    //     let LF = (Type == 'DL') ? this.DLF : this.LLF
    //     let w = (Type == 'DL') ? this.UDL : this.ULL

    //     Ri = (w * LF) * L/2
    //     _.forEach(this.PTL, (P,j)=>{
    //         let a = P.PX
    //         let b = L - a
    //         let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
    //         Ri =  Ri + Pi*a/L 
    //     }) 
    //     return Ri
    // }

    // RLDL(){
    //     return this.RL('DL')
    // }
    // RRDL(){
    //     return this.RR('DL')
    // }
    // RLLL(){
    //     return this.RL('LL')
    // }
    // RRLL(){
    //     return this.RR('LL')
    // }
    // RLTL(){
    //     return this.RLDL() + this.RLLL()
    // }
    // RRTL(){
    //     return this.RRDL() + this.RRLL()
    // }


    //---------------------------------------------------
    //MOMENT
    //---------------------------------------------------
    // Mx(Type){
    //     let M = []
    //     let Mi = 0
    //     let L = this.L
    //     let LF = (Type == 'DL') ? this.DLF : this.LLF
    //     let w = (Type == 'DL') ? this.UDL : this.ULL

    //     _.forEach(this.Lx(), (x,i) =>{
    //         Mi = (w * LF) * x / 2 *(L - x)
    //         _.forEach(this.PTL, (P,j)=>{
    //             let a = P.PX
    //             let b = L - a
    //             let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
    //             if(x <= a){
    //                 Mi =  Mi + Pi*b*x/L
    //             }//IF
    //             else{
    //                 Mi =  Mi + Pi*b*x/L - Pi*(x-a)
    //             }//ELSE
    //         })//P LOOP
    //         M.push(Mi)
    //     })//X LOOP

    //     return M

    // }//Mx

    // MDLx(){
    //     return this.Mx('DL')
    // }

    // MLLx(){
    //     return this.Mx('LL')
    // }

    // MTLx(){
    //     return _.unzipWith([this.MDLx(), this.MLLx()], _.add)
    // }

    // plotM(Type){
    //     let arrM = (Type == 'DL') ? this.MDLx() :  (Type == 'LL') ? this.MLLx() : this.MTLx()
    //     // return _.zipWith(arrM, this.Lx(), (M,x) => {
    //     //     return {M,x};
    //     // })
    //     return _.zipWith(this.Lx(), arrM,(x,y) => {
    //         return {x,y};
    //     })
    // }

    // MDL(){
    //     return _.max(this.MDLx())
    // }

    // MLL(){
    //     return _.max(this.MLLx())
    // }

    // MTL(){
    //     return _.max(this.MTLx())
    // }


    //---------------------------------------------------
    //SHEAR
    //---------------------------------------------------
    // Vx(Type){
    //     let V = []
    //     let Vi = 0
    //     let L = this.L
    //     let LF = (Type == 'DL') ? this.DLF : this.LLF
    //     let w = (Type == 'DL') ? this.UDL : this.ULL

    //     _.forEach(this.Lx(), (x,i) =>{
    //         Vi = (w * LF) * (L/2 - x)
    //         _.forEach(this.PTL, (P,j)=>{
    //             let a = P.PX
    //             let b = L - a
    //             let Pi = (Type == 'DL') ? P.PD * LF : P.PL * LF
    //             if(x <= a){
    //                 Vi =  Vi + Pi*b/L
    //             }//IF
    //             else{
    //                 Vi =  Vi + Pi*b/L - Pi
    //             }//ELSE
    //         })//P LOOP
    //         V.push(Vi)
    //     })//X LOOP

    //     return V

    // }//Vx

    // VDLx(){
    //     return this.Vx('DL')
    // }

    // VLLx(){
    //     return this.Vx('LL')
    // }

    // VTLx(){
    //     return _.unzipWith([this.VDLx(), this.VLLx()], _.add)
    // }

    // plotV(Type){
    //     let arrV = (Type == 'DL') ? this.VDLx() :  (Type == 'LL') ? this.VLLx() : this.VTLx()
    //     // return _.zipWith(arrV, this.Lx(), (V,x) => {
    //     //     return {V,x};
    //     // })
    //     return _.zipWith(this.Lx(), arrV,(x,y) => {
    //         return {x,y};
    //     })
    // }

    // VDL(){
    //     return _.max(_.map(this.VDLx(), Math.abs))
    // }

    // VLL(){
    //     return _.max(_.map(this.VLLx(), Math.abs))
    // }

    // VTL(){
    //     return _.max(_.map(this.VTLx(), Math.abs))
    // }

    //---------------------------------------------------
    //DELFECTION
    //---------------------------------------------------
    // Dx(Type){
    //     let D = []
    //     let Di = 0
    //     let L = this.L
    //     let w = (Type == 'DL') ? this.UDL : this.ULL
    //     let E = this.E
    //     let Ix = this.Ix

    //     _.forEach(this.Lx(), (x,i) =>{
    //         Di = w/(24*E*Ix)*1728*(Math.pow(L,3)-2*L*x*x+Math.pow(x,3))
    //         _.forEach(this.PTL, (P,j)=>{
    //             let a = P.PX
    //             let b = L - a
    //             let Pi = (Type == 'DL') ? P.PD  : P.PL 
    //             if(x <= a){
    //                 Di =  Di + (Pi*b*x*1728)/(6*E*Ix*L)*(Math.pow(L,2)-Math.pow(b,2)-Math.pow(x,2))
    //             }//IF
    //             else{
    //                 Di =  Di + (Pi*b*x*1728)/(6*E*Ix*L)*(Math.pow(L,2)-Math.pow(b,2)-Math.pow(x,2))+(Pi*Math.pow(x-a,3))/(6*E*Ix*L)
    //             }//ELSE
    //         })//P LOOP
    //         D.push(Di)
    //     })//X LOOP

    //     return D

    // }//Dx

    // DDLx(){
    //     return this.Dx('DL')
    // }

    // DLLx(){
    //     return this.Dx('LL')
    // }

    // DTLx(){
    //     return _.unzipWith([this.DDLx(), this.DLLx()], _.add)
    // }

    // plotD(Type){
    //     let arrD = (Type == 'DL') ? this.DDLx() :  (Type == 'LL') ? this.DLLx() : this.DTLx()
    //     // return _.zipWith(arrD, this.Lx(), (D,x) => {
    //     //     return {D,x};
    //     // })
    //     return _.zipWith(this.Lx(), arrV,(x,y) => {
    //         return {x,y};
    //     })
    // }

    // DDL(){
    //     return _.max(_.map(this.DDLx(), Math.abs))
    // }

    // DLL(){
    //     return _.max(_.map(this.DLLx(), Math.abs))
    // }

    // DTL(){
    //     return _.max(_.map(this.DTLx(), Math.abs))
    // }
    

    

}//CLASS