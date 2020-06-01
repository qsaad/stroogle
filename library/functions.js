
export default {
    
}

//---------------------------------------------
//TRIGONOMETRY
//---------------------------------------------
export function rtd(val){
    return val * 180/Math.PI
}

export function dtr(val){
    return val * Math.PI/180
}

export function tan_inv(value){
    return rtd(Math.atan(value))
}
export function cos_inv(value){
    return rtd(Math.acos(value))
}
export function sin_inv(value){
    return rtd(Math.asin(value))
}
export function sin(alpha){
    return Math.sin(dtr(alpha))
}
export function cos(alpha){
    return Math.cos(dtr(alpha))
}
export function tan(alpha){
    return Math.tan(dtr(alpha))
}

export function I1(alpha,IX,IY,IXY){
    // let sin = this.sin_alpha(alpha)
    // let cos = this.cos_alpha(alpha)
    return IX*Math.pow(cos(alpha),2)-2*IXY*sin(alpha)*cos(alpha)+IY*Math.pow(sin(alpha),2)
}

export function I2(alpha,IX,IY,IXY){
    // let sin = this.sin_alpha(alpha)
    // let cos = this.cos_alpha(alpha)
    return IX*sin(alpha)*cos(alpha)+IXY*Math.pow(cos(alpha),2)+IXY*Math.pow(sin(alpha),2)-IY**sin(alpha)*cos(alpha)
}

export function interpolate(x1,y1,x2,y2,x){
    return y1 + (x-x1)*(y2-y1)/(x2-x1);
}

//RETURN MINIMUM NON-ZERO VALUE FROM LIST OF NUMBERS
export function ArrayMin(){
    let arr = [];
    for(let i=0;i<arguments.length;i++){
      if(arguments[i]>0){
        arr.push(arguments[i]);
      }
    }
    return Math.min.apply( Math,arr);
  }

//RETURN MAXIMUM NON-ZERO VALUE FROM LIST OF NUMBERS
export function ArrayMax(){
    let arr = [];
    for(let i=0;i<arguments.length;i++){
      if(arguments[i]>0){
        arr.push(arguments[i]);
      }
    }
    return Math.max.apply( Math,arr);
  }

  //CONVERT DECIMAL TO FRACTION
export function deciToFrac(val){
    let ft = Math.trunc(val);
    let inch = (val - Math.trunc(val))*12;
    let inch16 = (inch - Math.trunc(inch))*16;

    if(inch16 > 0){
        switch(Math.round(inch16)){
            case 0:
                if(Math.trunc(inch) === 12){
                    return (ft + 1) + ' ft ' + 0 + ' in'
                }
                else{
                    return ft + ' ft ' + Math.trunc(inch) + ' in'
                }
                break;
            case 2:
                return ft + ' ft ' + Math.trunc(inch) + ' 1/8 in'
                break;
            case 4:
                return ft + ' ft ' + Math.trunc(inch) + ' 1/4 in'
                break;
            case 6:
                return ft + ' ft ' + Math.trunc(inch) + ' 3/8 in'
                break;
            case 8:
                return ft + ' ft ' + Math.trunc(inch) + ' 1/2 in'
                break;
            case 10:
                return ft + ' ft ' + Math.trunc(inch) + ' 5/8 in'
                break;
            case 12:
                return ft + ' ft ' + Math.trunc(inch) + ' 3/4 in'
                break;
            case 14:
                return ft + ' ft ' + Math.trunc(inch) + ' 7/8 in'
                break;
            case 16:
                return ft + ' ft ' + (Math.trunc(inch)+1) + ' in'
                break;
            default:
                return ft + ' ft ' + Math.trunc(inch) + ' ' + Math.round(inch16) + '/16 in'
                break;
        }
    }
    else{
        if(Math.trunc(inch) == 12){
            return (ft + 1) + ' ft ' + 0 + ' in'
        }
        else{
            return ft + ' ft ' + Math.trunc(inch) + ' in'
        }
        
    }
  }//DECI TO FRAC