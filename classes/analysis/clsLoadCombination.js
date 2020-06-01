
export default class LoadCombination{
    constructor({PD=0, PL=0, MD=0, ML=0, VD=0, VL=0, method="ASD", loadcase=1 }){
        this.PD = PD
        this.PL = PL
        this.MD = MD
        this.ML = ML
        this.VD = VD
        this.VL = VL
        this.method = method
        this.loadcase = loadcase
        this.DF = 1
        this.LF = 1
    }//CONSTRUCTOR

    combinations(){


    }

    loadFactor(){
        switch(this.loadcase){
            case 1: 
                this.DF = this.method == 'ASD' ? 1 : 1.2
                this.LF = this.method == 'ASD' ? 1 : 1.6
            break;
            case 2: 
                this.DF = this.method == 'ASD' ? 1 : 1.2
                this.LF = this.method == 'ASD' ? 1 : 1.6
            break;
            case 3: 
                this.DF = this.method == 'ASD' ? 1 : 1.2
                this.LF = this.method == 'ASD' ? 1 : 1.6
            break;
            case 4: 
                this.DF = this.method == 'ASD' ? 1 : 1.2
                this.LF = this.method == 'ASD' ? 1 : 1.6
            break;
            case 5: 
                this.DF = this.method == 'ASD' ? 1 : 1.2
                this.LF = this.method == 'ASD' ? 1 : 1.6
            break;
            case 6: 
                this.DF = this.method == 'ASD' ? 1 : 1.2
                this.LF = this.method == 'ASD' ? 1 : 1.6
            break;
            default: 
                this.DF = this.method == 'ASD' ? 1 : 1.2
                this.LF = this.method == 'ASD' ? 1 : 1.6
            break;
        }
    }//LOAD FACTOR

    P(){
        return this.DF*this.PD + this.LF*this.PL
    }

    M(){
        return this.DF*this.MD + this.LF*this.ML
    }

    V(){
        return this.DF*this.VD + this.LF*this.VL
    }
    
}//CLASS