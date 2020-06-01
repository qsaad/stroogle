import Wind from '@/classes/wind/clsWind'
import {interpolate} from '@/library/functions'

export default class MwfrsLowrise extends Wind {
    constructor({V, exposure, z, Kzt, Kd, L=100, B=50, slope=2, internalPressure="Enclosed" }){
        super({V, exposure, z, Kzt, Kd})
       
        this.L = L
        this.B = B
        this.slope = slope
        this.internalPressure = internalPressure

    }//CONSTRUCTOR


    //External Pressure Coefficient
	GCpf_A(){
		let k;
			switch(true){
				case (this.slope<=5) :
					return {
                                Z1:0.4,Z2:-0.69,Z3:-0.37,Z4:-0.29,
                                Z1E:0.61,Z2E:-1.07,Z3E:-0.53,Z4E:-0.43
                            }
					break;
				case (this.slope<=20) :
					return {
                                Z1:interpolate(5,0.4,20,0.53,this.slope),
                                Z2:-0.69,
                                Z3:interpolate(5,-0.37,20,-0.48,this.slope),
                                Z4:interpolate(5,-0.29,20,-0.43,this.slope),
                                Z1E:interpolate(5,0.61,20,0.8,this.slope),
                                Z2E:-1.07,
                                Z3E:interpolate(5,-0.53,20,-0.69,this.slope),
                                Z4E:interpolate(5,-0.43,20,-0.64,this.slope),
							};
					break;
				case (this.slope<30) :
					return {
                                Z1:interpolate(20,0.53,30,0.56,this.slope),
								Z2:interpolate(20,-0.69,30,0.21,this.slope),
								Z3:interpolate(20,-0.48,30,-0.43,this.slope),
								Z4:interpolate(20,-0.43,30,-0.37,this.slope),
								Z1E:interpolate(20,0.8,30,0.69,this.slope),
								Z2E:interpolate(20,-1.07,30,0.27,this.slope),
								Z3E:interpolate(20,-0.69,30,-0.53,this.slope),
								Z4E:interpolate(20,-0.64,30,-0.48,this.slope),
							};
					break;
				case (this.slope>=30 && this.slope<=45):
					return {
                                Z1:0.56,Z2:0.21,Z3:-0.43,Z4:-0.37,
                                Z1E:0.69,Z2E:0.27,Z3E:-0.53,Z4E:-0.48
                            };
					break;
				case (this.slope<=90) :
					return {
                                Z1:0.56,
							    Z2:interpolate(45,0.21,90,0.56,this.slope),
							    Z3:interpolate(45,-0.43,90,-0.373,this.slope),
							    Z4:-0.37,
							    Z1E:0.69,
							    Z2E:interpolate(45,0.27,90,0.69,this.slope),
							    Z3E:interpolate(45,-0.53,90,-0.48,this.slope),
							    Z4E:-0.48,
                            }
					break;
			}
        }//GCpf
        
        GCpf_B(){
            return {
                Z1:-0.45,Z2:-0.69,Z3:-0.37,Z4:-0.45,Z5:0.4,Z6:-0.29,
                Z1E:-0.48,Z2E:-1.07,Z3E:-0.53,Z4E:-0.48,Z5E:0.61,Z6E:-0.43
            }
        }
			
	
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
		wall_A(){
			let p = {};
			p.Z1 = this.qh()*(this.GCpf_A().Z1 - this.GCpi())
			p.Z4 = this.qh()*(this.GCpf_A().Z4 - this.GCpi())
			p.Z1E = this.qh()*(this.GCpf_A().Z1E - this.GCpi())
			p.Z4E = this.qh()*(this.GCpf_A().Z4E - this.GCpi())

			// p.WWi = this.qh()*(this.GCpf_A().Z1 - this.GCpi())
			// p.LWi = this.qh()*(this.GCpf_A().Z4 - this.GCpi())
			// p.WWe = this.qh()*(this.GCpf_A().Z1E - this.GCpi())
			// p.LWe = this.qh()*(this.GCpf_A().Z4E - this.GCpi())
			return p;
        }
        //Roof Pressure Load Case A
        roof_A(){
			let p = {};
			p.Z2 = this.qh()*(this.GCpf_A().Z2 - this.GCpi())
			p.Z3 = this.qh()*(this.GCpf_A().Z3 - this.GCpi())
			p.Z2E = this.qh()*(this.GCpf_A().Z2E - this.GCpi())
			p.Z3E = this.qh()*(this.GCpf_A().Z3E - this.GCpi())

			// p.WWi = this.qh()*(this.GCpf_A().Z2 - this.GCpi())
			// p.LWi = this.qh()*(this.GCpf_A().Z3 - this.GCpi())
			// p.WWe = this.qh()*(this.GCpf_A().Z2E - this.GCpi())
			// p.LWe = this.qh()*(this.GCpf_A().Z3E - this.GCpi())
			return p;
        }
        
        //Wall Pressure Load Case B
		wall_B(){
			let p = {};
			p.Z1 = this.qh()*(this.GCpf_B().Z1 - this.GCpi())
            p.Z4 = this.qh()*(this.GCpf_B().Z4 - this.GCpi())
            p.Z5 = this.qh()*(this.GCpf_B().Z5 - this.GCpi())
			p.Z6 = this.qh()*(this.GCpf_B().Z6 - this.GCpi())
			p.Z1E = this.qh()*(this.GCpf_B().Z1E - this.GCpi())
            p.Z4E = this.qh()*(this.GCpf_B().Z4E - this.GCpi())
            p.Z5E = this.qh()*(this.GCpf_B().Z5E - this.GCpi())
			p.Z6E = this.qh()*(this.GCpf_B().Z6E - this.GCpi())

			// p.WWi = this.qh()*(this.GCpf_B().Z1 - this.GCpi())
            // p.LWi = this.qh()*(this.GCpf_B().Z4 - this.GCpi())
            // p.WWsi = this.qh()*(this.GCpf_B().Z5 - this.GCpi())
			// p.LWsi = this.qh()*(this.GCpf_B().Z6 - this.GCpi())
			// p.WWe = this.qh()*(this.GCpf_B().Z1E - this.GCpi())
            // p.LWe = this.qh()*(this.GCpf_B().Z4E - this.GCpi())
            // p.WWse = this.qh()*(this.GCpf_B().Z5E - this.GCpi())
			// p.LWse = this.qh()*(this.GCpf_B().Z6E - this.GCpi())
			return p;
        }
        //Roof Pressure Load Case B
        roof_B(){
			let p = {};
			p.Z2 = this.qh()*(this.GCpf_B().Z2 - this.GCpi())
			p.Z3 = this.qh()*(this.GCpf_B().Z3 - this.GCpi())
			p.Z2E = this.qh()*(this.GCpf_B().Z2E - this.GCpi())
			p.Z3E = this.qh()*(this.GCpf_B().Z3E - this.GCpi())

			// p.WWi = this.qh()*(this.GCpf_B().Z2 - this.GCpi())
			// p.LWi = this.qh()*(this.GCpf_B().Z3 - this.GCpi())
			// p.WWe = this.qh()*(this.GCpf_B().Z2E - this.GCpi())
			// p.LWe = this.qh()*(this.GCpf_B().Z3E - this.GCpi())
			return p;
        }
        
        //-----------------------------------------------------
        //PARAMETERS
        //----------------------------------------------------- 
        get a(){
            return this._a()
        }

   

    

}//CLASS