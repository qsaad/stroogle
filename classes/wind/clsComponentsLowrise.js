import Wind from '@/classes/wind/clsWind'
import {interpolate} from '@/library/functions'

export default class ComponentsLowrise extends Wind {
    constructor({V, exposure, z, Kzt, Kd, L=100, B=50, slope=2, internalPressure="Enclosed",h = 20,hp = 22,At = 15,Ap = 10 }){
        super({V, exposure, z, Kzt, Kd})
       
        this.L = L
        this.B = B
        this.slope = slope
		this.internalPressure = internalPressure,
		this.h = h
		this.hp = hp
		this.At = At
		this.Ap = Ap

	}//CONSTRUCTOR
	
	//-----------------------------------------------------------------------------
	//WALL
	//-----------------------------------------------------------------------------
	GCpw(){
		if(this.h <= 60){
			return {
				GCp_Z4p_10 : 1,
				GCp_Z4p_A : 1.1766-0.1766*(Math.log10(this.At)),
				GCp_Z4p_Ap :1.1766-0.1766*(Math.log10(this.Ap)),
				GCp_Z4p_500 : 0.7,

				GCp_Z4n_10 : -1.1,
				GCp_Z4n_A : -1.2766+0.1766*(Math.log10(this.At)),
				GCp_Z4n_Ap : -1.2766+0.1766*(Math.log10(this.Ap)),
				GCp_Z4n_500 : -0.8,

				GCp_Z5n_10 : -1.4,
				GCp_Z5n_A : -1.7532+0.3532*(Math.log10(this.At)),
				GCp_Z5n_Ap : -1.7532+0.3532*(Math.log10(this.Ap)),
				GCp_Z5n_500 : -0.8,
			}
			
		}
		else{
			return{
				GCp_Z4p_10: 0.9,
				GCp_Z4p_A: 1.1792-0.2146*(Math.log10(this.At)),
				GCp_Z4p_Ap: 1.1792-0.2146*(Math.log10(this.Ap)),
				GCp_Z4p_500 : 0.6,

				GCp_Z4n_10: -0.9,
				GCp_Z4n_A:-1.0861+0.1431*(Math.log10(this.At)),
				GCp_Z4n_Ap: -1.0861+0.1431*(Math.log10(this.Ap)),
				GCp_Z4n_500 : -0.7,

				GCp_Z5n_10: -1.8,
				GCp_Z5n_A:-2.5445+0.5732*(Math.log10(this.At)),
				GCp_Z5n_Ap: -2.5445+0.5732*(Math.log10(this.Ap)),
				GCp_Z5n_500: -1,
			}
		}
	}// GCp WALL

	//Internal Pressure Coefficient
	GCpi(){
		switch(this.internalPressure){
			case "Partial":
				return 0.55
				break;
			case "Enclosed":
				return 0.18
				break;
		}
    }//GCpi
        
    //End Zone Width
	_a(){
		return Math.max(Math.min(0.1*this.B,0.4*this.z),0.04*this.B,3)
    }//a 
		
	
    //Wall Pressure Load Case A
	wall(){
		let p = {};
		p.Z4p_10 = this.qh()*(this.GCpw().GCp_Z4p_10 - this.GCpi())
		p.Z4p_A = this.qh()*(this.GCpw().GCp_Z4p_A - this.GCpi())
		p.Z4p_Ap = this.qh()*(this.GCpw().GCp_Z4p_Ap - this.GCpi())
		p.Z4p_500 = this.qh()*(this.GCpw().GCp_Z4p_500- this.GCpi())
		p.Z4n_10 = this.qh()*(this.GCpw().GCp_Z4n_10 - this.GCpi())
		p.Z4n_A = this.qh()*(this.GCpw().GCp_Z4n_A - this.GCpi())
		p.Z4n_Ap = this.qh()*(this.GCpw().GCp_Z4n_Ap - this.GCpi())
		p.Z4n_500 = this.qh()*(this.GCpw().GCp_Z4n_500- this.GCpi())
		p.Z5n_10 = this.qh()*(this.GCpw().GCp_Z5n_10 - this.GCpi())
		p.Z5n_A = this.qh()*(this.GCpw().GCp_Z5n_A - this.GCpi())
		p.Z5n_Ap = this.qh()*(this.GCpw().GCp_Z5n_Ap - this.GCpi())
		p.Z5n_500 = this.qh()*(this.GCpw().GCp_Z5n_500- this.GCpi())
		return p;
	}
	
	roof(){
		return {}
	}
        
        
       
        
    //-----------------------------------------------------
    //PARAMETERS
    //----------------------------------------------------- 
    get a(){
        return this._a()
    }

   

    

}//CLASS