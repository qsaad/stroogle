import {rebar} from '@/data/CON_Rebar'
import Masonry from '@/classes/masonry/clsMasonry'

export default class MasonryCapacity extends Masonry {
    constructor({ fm, Fy, b = 7.625, h = 12, L = 16 , rebarSize = "#5",  rebarSpa = 32 , rebarQty = 2, cov = 2 }) {
        super({fm, Fy})
        this.b = b
        this.h = h
        this.L = L
        this.cov = cov
        this.rebarSize = rebarSize
        this.rebarSpa = rebarSpa
        this.rebarQty = rebarQty

    }//CONSTRUCTOR

    emu(){
        return 0.0025
    }

    //REBAR DIAMETER
    db(){
        return rebar(this.rebarSize).d
    }//db

    d(){
        return this.h-this.cov-this.db()/2
    }

    //AREA OF REBAR
    Ab(){
        return rebar(this.rebarSize).A
    }//Ab

    //TOTAL AREA OF FLEXURAL STEEL
    Ast(){
        return this.Ab()*this.rebarQty
    }

    //ACTUAL REINFORCEMENT RATIO
    rho(){
        return this.Ast()/(this.b*this.d())
    }

    //BALANCED REINFORCEMENT RATIO
    rho_b(){
        return 0.8*(this.fm/(this.Fy*1000))*0.8*(this.emu/(this.ey()+this.emu))
    }

    failureMode(){
        if(this.rho() < this.rho_b()){
            return {
                value : 'ductile',
                comment : '&rho; < &rho;<sub>b</sub>'
            }
        }
        else{
            return{
                value : 'brittle',
                comment : '&rho; > &rho;<sub>b</sub>'
            }
        }
    }

    

    //COMPRESSION BLOCK
    a(){
        // let a1
        // let c1
        // let esu1
        // let Fs1 
        // a1 = (this.Ast()*this.Fy*1000)/(0.8*this.fm*this.b)
        // c1 = a1/0.8
        // esu1 = (this.d()-c1)/c1*this.emu
        // Fs1 = esu1*this.Es

        // if(Fs1 < this.Fy){
        //     a1 = (this.Ast()*Fs1*1000)/(0.8*this.fm*this.b)
        // }
        // return a1

        return (this.Ast()*this.Fy*1000)/(0.8*this.fm*this.b)
    }

    //NEUTRAL AXIS
    c(){
        return this.a()/0.8
    }

    //STRAIN IN REBAR
    esu(){
        return (this.d()-this.c())/this.c()*this.emu
    }

    forceMode(){
        switch(true){
            case this.esu() < this.ey() : 
                return {value :'Compression' , comment : '&epsilon;<sub>s</sub> < ' + this.ey().toFixed(4)}
                break
            case this.esu() < 0.005 : 
                return {value :'Transition' , comment : '&epsilon;<sub>s</sub> < 0.0050'}
                break
            case this.esu() >= 0.005 : 
                return {value :'Tension' , comment : '&epsilon;<sub>s</sub> > 0.0050'}
                break
        }
    }
    
    
    //ACTUAL STRAIN IN REBAR
    Fs(){
        return this.esu()*this.Es
    }

    fMn(){
        return this.phi_f()*this.Ast()*Math.min(this.Fs(),this.Fy)*1000*(this.d()-this.a()/2)/12
    }

    flexureParams(){
        return [
            {name : 'd', value : this.d().toFixed(2), unit:'in', comment :'Effective Depth'},
            {name : '&rho;', value : this.rho().toFixed(4), unit:'', comment :'% Rebar'},
            {name : '&rho;<sub>b</sub>', value : this.rho_b().toFixed(4), unit:'', comment :'Balance % Rebar'},
            {name : 'Failure Mode', value : this.failureMode().value, unit:'', comment :this.failureMode().comment},
            {name : 'a', value : this.a().toFixed(2), unit:'in', comment :'Compression Block Depth'},
            {name : 'c', value : this.c().toFixed(2), unit:'in', comment :'Neutral Axis'},
            {name : '&epsilon;<sub>s</sub>', value : this.esu().toFixed(4), unit:'', comment :'Rebar Strain'},
            {name : 'Force Mode', value : this.forceMode().value, unit:'', comment :this.forceMode().comment},
            {name : 'F<sub>s</sub>', value : this.Fs().toFixed(2), unit:'ksi', comment :'Rebar Stress'},
        ]
    }//FLEXURE PARAMS
        
    

    

    Pn(){

    }

    Mn(){

    }

    Vn(){

    }
}//CLASS