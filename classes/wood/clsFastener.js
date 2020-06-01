import Wood from '@/classes/wood/clsWood'
import {sin,cos,ArrayMin} from '@/library/functions'

export default class Fastener extends Wood{
    constructor({method,duration,moisture,temperature,L=2,D=0.211,ts=1.5,tm=1.5,Gs=0.5,Gm=0.5,shearPlane=1}){
        super({ method, duration, moisture, temperature})
        this.L = L
        this.D = D
        this.ts = ts
        this.tm = tm
        this.Gs = Gs
        this.Gm = Gm
        this.Fyb = 90000
        this.ls = this.ts
        this.lm = this.tm
        this.shearPlane = shearPlane
    }//CONSTRUCTOR

    //DURATION FACTOR
    CD(){
        return Math.min(super.CD(),1.6)
    }//CD

   
    Fe(){
        let G = Math.min(this.Gs, this.Gm)
        return 16600*Math.pow(G,1.84)
    }

    Re(){
    	return this.Fem()/this.Fes();
	}

	Rt(){
    	return this.lm/this.ts
    }

    k(){
    	let re = this.Re();
    	let rt = this.Rt();
    	let r2e = Math.pow(this.Re(),2);
    	let r3e = Math.pow(this.Re(),3);
    	let r2t = Math.pow(this.Rt(),2);
    	let ka= (Math.pow(re+2*r2e*(1+rt+r2t)+r2t*r3e,0.5)-re*(1+rt))/(1+re) ;
    	let kb = -1+Math.pow(2*(1+re)+(2*this.Fyb*((1+2*re)*Math.pow(this.D,2)))/(3*this.Fem()*Math.pow(this.lm,2)),0.5);
    	let kc = -1+Math.pow(2*(1+re)/re+(2*this.Fyb*(2+re)*Math.pow(this.D,2))/(3*this.Fem()*Math.pow(this.ls,2)),0.5);
  	
    	return ({k1:ka,k2:kb,k3:kc})
    }//k

}//CLASS