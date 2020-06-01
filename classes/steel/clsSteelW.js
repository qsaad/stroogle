import Steel from '@/classes/steel/clsSteel'
import _ from 'lodash'
import {ArrayMin} from '@/library/functions'

export default class SteelW extends Steel {
    constructor({ method, Fy, section, Lu, Lx, Ly,Kx = 1, Ky = 1, Cb = 1}) {
      super({ method, Fy })
      this.W = section
      this.c = 1
      this.Cb = Cb  //BEAM BENDING COEFFICIENT
      this.Lu = Lu*12
      this.Lx = Lx*12
      this.Ly = Ly*12
      this.Kx = Kx
      this.Ky = Ky
      this.A = section.A
      this.BF = section.BF
      this.D = section.D
      this.TF = section.TF
      this.TW = section.TW
      this.IX = section.IX
      this.IY = section.IY
    } // CONSTRUCTOR

    propParams(){
      return {
        A : this.A,
        BF : this.BF,
        D : this.D,
        TF : this.TF,
        TW : this.TW,
        IX : this.IX,
        IY : this.IY,
      }
    }
    //-------------------------------------------------
    //COMPACTNESS
    //-------------------------------------------------
    FlangeFlexure(){
      var k = Math.pow(this.E/this.Fy,0.5);
      return this.W.BF_2TF < 0.38*k ? "Compact": (this.W.BF_2TF < 1*k ? "Non-Compact": "Slender") ;
    }//FlangeFlexure
    
    WebFlexure(){
      var k = Math.pow(this.E/this.Fy,0.5);
      return this.W.H_TW < 3.76*k ? "Compact": (this.W.H_TW < 5.7*k ? "Non-Compact": "Slender") ;
    }//WwebFlexure
    
    FlangeCompression(){
      var k = Math.pow(this.E/this.Fy,0.5);
      return this.W.BF_2TF < 0.56*k ? "Compact": "Slender" ;
    }//FlangeCompression
    
    WebCompression(){
      var k = Math.pow(this.E/this.Fy,0.5);
      return this.W.BF_2TF < 1.49*k ? "Compact": "Slender" ;
    }//WebCompression

    //-------------------------------------------------
    //UNBRACED LENGTH LIMIT STATE
    //-------------------------------------------------
    Lp(){
		  return 1.76*this.W.RY*Math.pow(this.E/this.Fy,0.5);
	  }//Lp
	
	  Lr(){
		  let v1 = 1.95*this.W.RTS*this.E/(0.7*this.Fy);
		  let v2 = Math.pow((this.W.J*this.c)/(this.W.SX*this.W.HO),0.5);
      let v3 = 6.76*Math.pow((0.7*this.Fy*this.W.SX*this.W.HO)/(this.E*this.W.J*this.c),2);
      
		  return v1*v2*Math.pow(1+Math.pow(1+v3,0.5),0.5);
    }//Lr
    
    bracedLength(){
      if(this.Lu < this.Lp()){
          return "Lb < Lp";
      }
      if(this.Lu < this.Lr()){
          return "Lp < Lb < Lr";
      }
      else{
          return "Lb > Lr";
      }
    }//bracedLength

    //---------------------------------------------------------
    //FLEXURE - X
    //----------------------------------------------------------
	
    //YIELD
    Mpx(){
        return this.Fy*this.W.ZX;
    }//Mpx

    //Determine Fcr (F2-4)
	  Fcr(){
		  let v1 = (this.Cb*Math.pow(Math.PI,2)*this.E)/Math.pow(this.Lu/this.W.RTS,2);
		  let v2 = 0.078*(this.W.J*this.c)/(this.W.SX*this.W.HO)*Math.pow(this.Lu/this.W.RTS,2);
		  return v1*Math.pow(1+v2,0.5);
    }//Fcr
    
    //Determine Lateral Torsional Buckling Strength (F2-2 & F2-3)
	  Mltb(){
      if(this.Lu <= this.Lp()){
        return 0;
      }
      else if(this.Lu < this.Lr()){
        var v1 = this.Cb*(this.Mpx()-(this.Mpx()-0.7*this.Fy*this.W.SX)*((this.Lu-this.Lp())/(this.Lr()-this.Lp())));
        return Math.min(v1,this.Mpx());
      }
      else{
        return Math.min(this.Fcr()*this.W.SX,this.Mpx());
      }
    }//Mltb
    
    //Determine Compression Flange Local Buckling (F3-1 & F3-2)

	  Mflb(){
      if(this.FlangeFlexure() =="Compact"){
          return 0;
      }
      if(this.FlangeFlexure() =="Non-Compact"){
          let l = this.W.BF_2TF;
          let lpf = 0.38*Math.pow(this.E/this.Fy,0.5);
          let lrf = Math.pow(this.E/this.Fy,0.5);
          
          return (this.Mpx()-(this.Mpx()-0.7*this.Fy*this.W.SX)*((l-lpf)/(lrf-lpf)));
      }
      else{
          let k = 4/Math.pow(this.W.H_TW,0.5);
          let kc = 0;
          if(k < 0.35){
              kc = 0.35;
          }
          if(k > 0.76){
              kc = 0.76;
          }
          else{
              kc = k;
          }
          return ((0.9*this.E*kc*this.W.SX)/Math.pow(this.W.BF_2TF,2));
      }
    }//Mflb
    
    fMnx(){
      return this.phiF()*ArrayMin(this.Mpx(),this.Mltb(),this.Mflb())/12;
    }//fMnx

    //---------------------------------------------------------
    //FLEXURE - Y
    //----------------------------------------------------------

    Mpy(){
      return Math.min(this.Fy*this.W.ZY,1.6*this.Fy*this.W.SY);
    }//Mpy
    
    //Determine Fcr (F6-4)
    Fcry(){
      return (0.69*this.E)/Math.pow(this.W.BF_2TF,2);
    }//Fcry

    Mflby(){
      let l = this.W.BF_2TF;
      let lpf = 0.38*Math.pow(this.E/this.Fy,0.5);
      let lrf = Math.pow(this.E/this.Fy,0.5);

      if(this.FlangeFlexure()=="Compact"){
        return 0;
      }
      if(this.FlangeFlexure()=="Non-Compact"){
        return (this.Mpy()-(this.Mpy()-0.7*this.Fy*this.W.SY)*((l-lpf)/(lrf-lpf)));
      }
      else{
        return this.Fcry()*this.W.SY;
      }
    }//Mflby

    fMny(){
      return this.phiF()*ArrayMin(this.Mpy(),this.Mflby())/12
    }//fMny

    flexureParams(){
      return{
          Web : this.FlangeFlexure(),
          Flange : this.WebFlexure(),
          Lp : this.Lp()/12,
          Lr : this.Lr()/12,
          bracing : this.bracedLength(),
          c : this.c,
          Cb : this.Cb,
          SX : this.W.SX,
          HO : this.W.HO,
          J : this.W.J,
          ZX : this.W.ZX,
          Mpx : this.Mpx()/12,
          Fcr : this.Fcr(),
          Mltb : this.Mltb()/12,
          Mflb : this.Mflb()/12,
          ZY : this.W.ZY,
          Mpy : this.Mpx()/12,
          Fcry : this.Fcry(),
          Mflby : this.Mflby()/12,
          phiF : this.phiF()
      }
    }//FLEXURAL PARAMS

    //---------------------------------------------------------
    //AXIAL
    //----------------------------------------------------------
    //SLENDERNESS RATIO	
    SRx(){
      return this.Kx*this.Lx/this.W.RX
    }//SRx
	
	  SRy(){
		  return this.Ky*this.Ly/this.W.RY
	  }//SRy
	
	  SR(){
		  return Math.max(this.SRx(),this.SRy());
    }//SR
    
    //FLEXURAL BUCKLING STRESS
	  Fef(){
		  return Math.pow(Math.PI,2)*this.E/Math.pow(this.SR(),2);
    }//Fef
    
    //FLEXURAL-TORSIONAL AND BUCKLING STRESS
	  Fet(){
		  return ((Math.pow(Math.PI,2)*this.E*this.W.CW)/Math.pow(this.Ky*this.Ly,2)+this.G*this.W.J)*(1/(this.W.IX+this.W.IY));
	  }//Fet
	
	  Fe(){
		  return Math.min(this.Fef(),this.Fet());
    }//Fe
    
    //UNSTIFFENED ELEMENT REDUCTION FACTOR
	  Qs(){
      if(this.W.BF_2TF<=0.56*Math.pow(this.E/this.Fy,0.5)){
        return 1;
      }
      else if(this.W.BF_2TF<1.03*Math.pow(this.E/this.Fy,0.5)){
        return 1.415-0.74*(this.W.BF_2TF)*Math.pow(Fy/this.E,0.5);
      }
      else{
        return (0.69*this.E)/(this.Fy*Math.pow(this.W.BF_2TF,2)); 
      }
    }//Qs
    
    //STIFFENED ELEMENT REDUCTION FACTOR
    // be(){
    //   return 1.92*this.W.TW*Math.pow(this.E/f)*(1-0.34/this.W.BF_2TF*Math.pow(this.E/f,0.5));
    // }
    // Aeff(){
    //   return this.be()*this.W.TW+2*this.W.BF*this.W.TF;
    // }
	  Qa(){
      let f
      if(this.SR() <= 4.71*Math.pow(this.E/this.Fy,0.5)){
        f = Math.pow(0.658,this.Fy/this.Fe())*this.Fy;
      }
      else{
        f = 0.877*this.Fe();
      }
      
      if(this.W.H_TW>=1.49*Math.pow(this.E/f,0.5)){
        let be = 1.92*this.W.TW*Math.pow(this.E/f)*(1-0.34/this.W.BF_2TF*Math.pow(this.E/f,0.5));
        let Aeff = be*this.W.TW+2*this.W.BF*this.W.TF;
        return Aeff/this.W.A;
      }
      else{
        return 1; 
      }
    }//Qa
    
    Q(){
      return this.Qs()*this.Qa();
    }//Q

    Fcra(){
      if(this.SR() <= 4.71*Math.pow(this.E/(this.Q()*this.Fy),0.5)){
        return this.Q()*Math.pow(0.658,(this.Q()*this.Fy)/this.Fe())*this.Fy;
      }
      else{
        return 0.877*this.Fe();
      }
    }//Fcra

    fPn(){
      return this.phiP()*this.Fcra()*this.W.A
    }//fPn

    axialParams(){
      return {
          Flange : this.FlangeCompression(),
          Web : this.FlangeCompression(),
          SRx : this.SRx(),
          SRy : this.SRy(),
          SR : this.SR(),
          Fef : this.Fef(),
          Fet : this.Fet(),
          Fe : this.Fe(),
          Qa : this.Qa(),
          Qs : this.Qs(),
          //be : this.be(),
          //Aeff : this.Aeff(),
          Q : this.Q(),
          Fcra : this.Fcra(),
          phiP : this.phiP()
      }
  }//AXIAL PARAMS

//---------------------------------------------------------
//SHEAR - Y
//----------------------------------------------------------
	  Aw(){
		  return this.W.D*this.W.TW
    }
    Hw(){
      return this.W.H_TW
    }
    Cvy(){
      if(this.W.H_TW<=2.24*Math.pow(this.E/this.Fy,0.5)){
        return 1;
      }
      else{
        let kv = (this.W.H_TW<260) ? 5: 1.2;
        
        if(this.W.H_TW<=1.1*Math.pow(kv*this.E/this.Fy,0.5)){
          return 1;
        }
        if(this.W.H_TW<=1.37*Math.pow(kv*this.E/this.Fy,0.5)){
          return 1.1*Math.pow(kv*this.E/this.Fy,0.5)/this.W.H_TW;
        }
        else{
          return (1.51*this.E*kv)/(Math.pow(this.W.H_TW,2)*this.Fy);
        }
      }
    }//Cvy
    fVny(){
      return this.phiV()*this.Fy*this.Aw()*this.Cvy();
    }
  //---------------------------------------------------------
  //SHEAR - X
  //----------------------------------------------------------
    Cvx(){
      return 1
    }
    Af(){
		  return this.W.BF*this.W.TF
    }
    fVnx(){
      return this.phiV()*this.Fy*this.Af()*this.Cvx();
    }

    shearParams(){
      return{
          Cvx : this.Cvx(),
          Aw : this.Aw(),
          Cvy : this.Cvy(),
          Af : this.Af()
      }
    }//SHEAR PARAMS

  //---------------------------------------------------------
  //TENSION
  //----------------------------------------------------------
	  fTn(){
		  return this.phiT()*this.Fy*this.W.A;
    }//fTn
    
    tensionParams(){
      return{
          A : this.W.A,
          phiT : this.phiT(),
      }
    }//TENSION PARAMS

  //---------------------------------------------------------
  //TORSION
  //----------------------------------------------------------

    fTrn(){
      return 1
    }

    torsionParams(){
      return {
          J : this.W.J,
          phiTr : this.phiTr()
      }
    }//TORSION PARAMS

   
  } //CLASS