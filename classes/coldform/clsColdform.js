export default class Coldform {
    constructor({ method="ASD"}){
        this.method = method
        this.E = 29000
        this.G = 11200
    }


	DLF(){
		return (this.method == "ASD") ? 1 : 1.2;
	}//DEAD LOAD

	LLF(){
		return (this.method == "ASD") ? 1 : 1.6;
	}//DEAD LOAD
	

    

    
}//CLASS