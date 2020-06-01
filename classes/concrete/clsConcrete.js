import {rebar} from '@/data/CON_Rebar'
import _ from 'lodash'

export default class Concrete {
    constructor({ b = 12, h = 24, rebarQty = 2, rebarSize = "#5", fc = 3000, Fy = 60, cov = 1.5, rebarSpa = 0 }){
        this.b = _.toNumber(b)
        this.h = _.toNumber(h)
        this.rebarQty = _.toNumber(rebarQty)
        this.rebarSize = rebarSize,
        this.fc = _.toNumber(fc)
        this.cov = _.toNumber(cov)
        this.Fy = _.toNumber(Fy) * 1000
        this.rebarSpa = _.toNumber(rebarSpa)

        this.phi_v = 0.75
        this.phi_p = 0.65
        this.phi_brg = 0.6
    }

    Ec(){
        return 57000*Math.pow(this.fc,0.5)
    }

    Es(){
        return 29000000
    }

    n(){
        return this.Es()/this.Ec()
    }

    Fr(){
        return 7.5*Math.pow(this.fc,0.5)
    }

    db(){
        return rebar(this.rebarSize).d
    }
    
    Ab(){
        return rebar(this.rebarSize).A
    }

    Ag(){
        return this.b * this.h
    }

    d(){
        return this.h - this.cov - rebar(this.rebarSize).d/2
    }//d

    Ast(){
        if(this.rebarSpa == 0){
            return rebar(this.rebarSize).A * this.rebarQty
        }
        else{
            return rebar(this.rebarSize).A * (12 / this.rebarSpa)
        }
    }

    a(){
        return (this.Ast()*this.Fy)/(0.85*this.fc*this.b)
    }//A
      
    beta(){
        return Math.max(0.85-((this.fc-4000)/1000)*0.05,0.65)
    }//BETA
      
    c(){
        return this.a()/this.beta()
    }//C
      
    et(){
        return ((this.d()-this.c())/this.c())*0.003
    }//ET
      
    phi(){
        return this.et() >= 0.005 ? 0.9 : 0.483 + 83.33*this.et()
    }//PHI
    
    fMn() {
        return this.phi()*this.Ast()*this.Fy*(this.d()-this.a()/2)/12000
        
    }// FLEXURAL CAPACITY

    fVn(){
    	return 0.75*2*Math.pow(this.fc,0.5)*this.b* this.d()/1000
    }// ONE WAY SHEAR CAPACITY
		
	fVnp(c){
        let bo = 4*(c + this.d())
    	return this.phi_f*4*Math.pow(this.fc,0.5)*bo*this.d()/1000
    }//PUNCHING SHEAR CAPACITY

    fPn(){
        return 0.8*this.phi_p*(this.Ast()*this.Fy + 0.85*this.fc*(this.Ag()-this.Ast))
    }


    fMn1({b=12, d, fc=3000, Ast=0.62, Fy=60000}) {
        let a = (Ast*Fy)/(0.85*fc*b)
        let beta = Math.max(0.85-((fc-4000)/1000)*0.05,0.65)
        let c = a/beta
        let et = ((d-c)/c)*0.003
        let phi = et >= 0.005 ? 0.9 : 0.483 + 83.33*et
        return phi*Ast*Fy*(d - a/2)/12000
    }// NOMINAL FLEXURAL CAPACITY


    Vc({b=12, d, fc=3000}){
        return 2*Math.pow(fc,0.5)*b* d/1000
    }//CONCRETE SHEAR CAPACITY

    Vs({Av=0.22, Fy=60000, b=12, d, S=12}){
        return Math.min(Av*(Fy/1000)*d/S, 8*Math.pow(fc,0.5)*b*d)
    }//STIRRUP SHEAR CAPACITY

    fVn1({b=12, d, fc=3000, Asv=0, Fy=60000,S=0}){
        let Vc = 2*Math.pow(fc,0.5)*b* d/1000
        let Vs = S > 0 ? Math.min(Asv*(Fy/1000)*d/S, 8*Math.pow(fc,0.5)*b*d) : 0
        return this.phi_v*(Vc + Vs)
    }//NOMINAL ONE WAY SHEAR CAPACITY


    fVnp1({C=12, d, fc=3000}){
        let bo = 4*(C + d)
    	return this.phi_v*4*Math.pow(fc,0.5)*bo*d/1000
    }//NOMINAL PUNCHING SHEAR CAPACITY

    fPn1({Ag ,fc=3000 , Ast, Fy=60}){
        return 0.8*this.phi_p*(Ast*Fy + 0.85*fc/1000*(Ag - Ast))
    }//NOMINAL AXIAL CAPACITY

    Ld({Fy=60000, fc=3000, rebarSize = "#5" , type="NWC", cov=1.5, spa=12, epoxy=false, spliceClass="A", Ktr = 0}){
        let lambda = (type == "NWC") ? 1 : (type == "SLW") ? 0.85 : 0.71
        let sig_t = cov <= 12 ? 1 : 1.3
        let sig_e = epoxy ? 1.2 : 1
        let db = rebar(rebarSize).d
        let sig_s = db <= 0.31 ? 0.8 : 1
        let Cb = Math.min(cov,spa)
        
        let k1 = 3/40
        let k2 = Fy/(lambda * Math.pow(fc,0.5))
        let k3 = (sig_t*sig_e*sig_s)
        let k4 = Math.min((Cb + Ktr)/db, 2.5)

        let ks = spliceClass == "A" ? 1 : 1.3

        return Math.max(k1*k2*k3/k4*db, 12)*ks
    }//TENSION DEVELOPMENT LENGTH

    Ldh({Fy=60000, fc=3000, rebarSize="#5", cov=1.5}){
        let kf = cov > 2.5 ? 0.7 : 1
        let k1 = 0.02*Fy*rebar(rebarSize).d/Math.pow(fc,0.5)
        let k2 = rebar(rebarSize).d <= 0.2 ? 8*rebar(rebarSize).d : 12*rebar(rebarSize).d
        return Math.max(k1*kf, k2, 6)
    }// TENSION DEVELOPMENT LENGTH OF HOOKED REBAR

    Ldc({Fy=60000,fc=3000,rebarSize="#5"}){
        let k1 = 0.02*Fy/Math.pow(fc,0.5)
        let k2 = 0.0003*Fy*rebar(rebarSize).d
        return Math.max(k1,k2,8)
    }// COMPRESSION DEVELOPMENT LENGTH

    clearRebarSpacing({b=12,cov=1.5,db=0.31,ds=0.11,rebarQty=4}){
        return (b - 2*cov - 2*ds - db * rebarQty)/(rebarQty - 1)
    }// CLEAR SPACING BETWEEN REBAR

    Asmin({b=12,d=10,fc=3000,Fy=60000}){
        return Math.max(3*Math.pow(fc,0.5)*b*d/Fy, 200*b*d/Fy)
    }

    Mcr({b=12,h=12,fc=3000}){
        let Ig = b*Math.pow(h,3)/12
        return this.Fr()*Ig/(h/2)
    }


}//CLASS