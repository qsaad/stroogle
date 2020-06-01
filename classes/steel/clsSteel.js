export default class Steel {
    constructor({ method="ASD",Fy=50}){
        this.method = method
        this.Fy = Fy
        this.E = 29000
        this.G = 11200
    }

    phiF(){
		return (this.method == "ASD") ? 0.6 : 0.9
	}//FLEXURE
	
	phiV(){
		return (this.method == "ASD") ? 0.67 : 1
	}//SHEAR
	
	phiT(){
		return (this.method == "ASD") ? 0.6 : 0.9
	}//TENSION
	
	phiP(){
		return (this.method == "ASD") ? 0.6 : 0.9
	}//AXIAL

	phiBrg(){
		return (this.method == "ASD") ? 0.4 : 0.65
	}//AXIAL

	phiTr(){
		return (this.method == "ASD") ? 0.6 : 0.9
	}//TORSION

	phiTb(){
		return (this.method == "ASD") ? 0.5 : 0.75
	}//ANCHOR ROD TENSION 

	phiVb(){
		return (this.method == "ASD") ? 0.5 : 0.75
	}//ANCHOR ROD SHEAR

	DLF(){
		return (this.method == "ASD") ? 1 : 1.2
	}//DEAD LOAD

	LLF(){
		return (this.method == "ASD") ? 1 : 1.6
	}//DEAD LOAD
	

    

    
}//CLASS