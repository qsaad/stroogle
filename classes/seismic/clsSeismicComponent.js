export default class SeismicComponent  {
    constructor({Sds,ap,Rp,Ip,Wp,z,h}) {
        this.Sds = Sds
        this.ap = ap
        this.Rp = Rp
        this.Ip = Ip
        this.Wp = Wp
        this.z = z
        this.h = h
       
    } // CONSTRUCTOR

    Fpmax(){
       return 1.6*this.Sds*this.Ip*this.Wp 
    }

    Fpmin(){
        return 0.3*this.Sds*this.Ip*this.Wp 
    }

    F(){
        return (0.4*this.ap*this.Sds*this.Wp)/(this.Rp/this.Ip)*(1+ Math.min(1,this.z/this.h))
    }

    Fp(){
        if(this.F() <= this.Fpmin()){
            return this.Fpmin()
        }
        if(this.F() >= this.Fpmax()){
            return this.Fpmax()
        }
        else{
            return this.F()
        }
    }

}//CLASS