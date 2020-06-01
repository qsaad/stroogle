
export default class Masonry {
    constructor({ fm = 1500, Fy = 60}){
        this.emu = 0.0025
        this.fm = fm
        this.Fy = Fy 
        this.Es = 29000
        this.Em = 0.9*this.fm
        this.n = this.Es/this.Em
        this.fr = 2.5*Math.pow(this.fm,0.5)
    }//CONSTRUCTOR

    ey(){
        return this.Fy/this.Es
    }

    //ALLOWABLE FLEXURE STRESS
    Fb(){
        return this.fm/3;
    }//Fb

    //ALLOWABLE REBAR STRESS
    Fs(){
        if(this.Fy == 60){
            return 32000;
        }
        else{
            return 20000;
        }
    }//Fs

    Fr(){
        return 2.5*Math.pow(this.fm,0.5)
    }

    rho_b(){
        return this.n/((2*this.Fs()/this.Fb())*(this.n + this.Fs()/this.Fb()))
    }

    phi_f(){
        return 0.9
    }
    phi_p(){
        return 0.9
    }
    phi_v(){
        return 0.8
    }
    phi_b(){
        return 0.6
    }

}//CLASS