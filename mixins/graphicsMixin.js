

export const graphics =  {
    data(){
        return{
            width : 350,
            height : 350,
            isEdit: 'P',

            messages : [],
            parameters : []
            
        }//RETURN
    },//DATA
    created(){
       

    },//CREATED
    computed:{
        yGrid(){
            return _.range(0,this.width,10)
        },
        xGrid(){
            return _.range(0,this.height,10)
        },
       
    },//COMPUTED
    methods:{
        edit(val){
            this.isEdit = val
        },

        SF(M){
            switch(true){
                case M < 25 : 
                    return 2
                    break
                case M < 50 : 
                    return 1
                    break
                case M < 100 : 
                    return 0.5
                    break
                case M < 200 : 
                    return 0.25
                    break
                case M < 300 : 
                    return 0.17
                    break
                default:
                    return 0.1
                    break
            }
        },

        //---------------------------------------------------
        //BELOW TO BE DELETED
        //----------------------------------------------------


        supportPath({xo=0, yo=0}){
            let path = ''
            let x = 8
            let y = 10
            path = `M${xo},${yo} l${-x},${y} h${2*x} Z`
            return path
        },
        bendingMomentPath({xo=0, yo=0, M, L=12, YF=1, rotation=0}){
            let path = ''
            let XF = 1
            path = `M${xo},${yo} `

            path = path +  _.map(M, item =>{
                return ` l${xo + item.x*XF},${yo + item.y*YF}`
            })

            return path
        },
        arrowPath({xo=0, yo=0, length=20, rotation=0}){
            let path = ''
            let headSize = 7

            switch(rotation){
                case 90:
                    path = `M${xo},${yo} v${-length} 
                            M${xo},${yo} l${-headSize},${-headSize} 
                            M${xo},${yo} l${headSize},${-headSize}`
                    break;
                case 0:
                    path = `M${xo},${yo} h${length} 
                            M${xo},${yo} l${headSize},${-headSize} 
                            M${xo},${yo} l${headSize},${headSize}`
                    break;
                case 270:
                    path = `M${xo},${yo} v${length} 
                            M${xo},${yo} l${-headSize},${headSize} 
                            M${xo},${yo} l${headSize},${headSize}`
                    break;
                case 180:
                    path = `M${xo},${yo} h${length} 
                            M${xo},${yo} l${headSize},${-headSize} 
                            M${xo},${yo} l${headSize},${headSize}`
                    break;
            }
            return path
        },//ARROW PATH

        dimensionPath({xo=0, yo=0, length=20, rotation=0}){
            let path = ''
            let headSize = 7

            switch(rotation){
                case 0:
                    path = `M${xo},${yo} h${length} 
                            M${xo},${yo} v${-headSize} M${xo},${yo} v${headSize} 
                            M${xo+length},${yo} v${-headSize} M${xo+length},${yo} v${headSize}`
                    break;
                case 90:
                    path = `M${xo},${yo} v${-length} 
                            M${xo},${yo} h${-headSize} M${xo},${yo} h${headSize} 
                            M${xo},${yo-length} h${-headSize} M${xo},${yo-length} h${headSize}`
                    break;
                case 180:
                    path = `M${xo},${yo} h${-length} 
                            M${xo},${yo} v${-headSize} M${xo},${yo} v${headSize} 
                            M${xo-length},${yo} v${-headSize} M${xo-length},${yo} v${headSize}`
                    break;
                case 270:
                    path = `M${xo},${yo} v${length} 
                            M${xo},${yo} h${-headSize} M${xo},${yo} h${headSize} 
                            M${xo},${yo+length} h${-headSize} M${xo},${yo+length} h${headSize}`
                    break;
            }
            
            return path
        },//DIMENSION PATH

        uniformLoadPath({xo=0, yo=0, L=30, w=40, rotation=0, direction="CW"}){
            let path = ''
            if(direction == "CW"){
                switch(rotation){
                    case 0:
                        path = `M${xo},${yo} h${L} v${-w} h${-L} Z`
                        break;
                    case 90:
                        path = `M${xo},${yo} v${L} h${-w} v${-L} Z`
                        break;
                    case 180:
                        path = `M${xo},${yo} h${-L} v${-w} h${L} Z`
                        break;
                    case 270:
                        path = `M${xo},${yo} v${-L} h${-w} v${L} Z`
                        break;
                }
            }
            else{
                // switch(rotation){
                //     case 0:
                //         path = `M${xo},${yo} a${r} ${r} 0,0,0 ${2*r},0 
                //                 M${xo+2*r},${yo} l${-1.5*headSize},${0.7*headSize}
                //                 M${xo+2*r},${yo} l${1.2*headSize},${1.0*headSize}`
                //         break;
                //     case 90:
                //         path = `M${xo},${yo} a${r} ${r} 0,0,1 0,${2*r} 
                //                 M${xo},${yo} l${1.8*headSize},${-0.7*headSize} 
                //                 M${xo},${yo} l${0.7*headSize},${1.5*headSize}`
                //         break;
                //     case 180:
                //         path = `M${xo},${yo} a${r} ${r} 0,0,0 ${-2*r},0 
                //                 M${xo-2*r},${yo} l${-1.0*headSize},${-1.5*headSize} 
                //                 M${xo-2*r},${yo} l${1.5*headSize},${-0.5*headSize}`
                //         break;
                //     case 270:
                //         path = `M${xo},${yo} a${r} ${r} 0,0,0 0,${2*r} 
                //                 M${xo},${yo+2*r} l${-0.5*headSize},${-1.5*headSize} 
                //                 M${xo},${yo+2*r} l${-1.4*headSize},${1.0*headSize}`
                //         break;
                // }
            }
            
            return path
        },//RECT PATH

        momentPath({xo=0, yo=0, rotation=0, direction="CW"}){
            let path = ''
            let headSize = 7
            let r = 15

            if(direction == "CW"){
                switch(rotation){
                    case 0:
                        path = `M${xo},${yo} a${r} ${r} 0,0,0 ${2*r},0 
                                M${xo},${yo} l${-0.8*headSize},${1.5*headSize} 
                                M${xo},${yo} l${1.4*headSize},${0.5*headSize}`
                        break;
                    case 90:
                        path = `M${xo},${yo} a${r} ${r} 0,0,0 0,${2*r} 
                                M${xo},${yo} l${-0.8*headSize},${1.5*headSize} 
                                M${xo},${yo} l${-1.4*headSize},${-0.5*headSize}`
                        break;
                    case 180:
                        path = `M${xo},${yo} a${r} ${r} 0,0,1 ${2*r},0 
                                M${xo+2*r},${yo} l${-1.5*headSize},${-0.7*headSize} 
                                M${xo+2*r},${yo} l${1.2*headSize},${-0.7*headSize}`
                        break;
                    case 270:
                        path = `M${xo},${yo} a${r} ${r} 0,0,1 0,${2*r} 
                                M${xo},${yo+2*r} l${0.8*headSize},${-1.5*headSize} 
                                M${xo},${yo+2*r} l${1.4*headSize},${1.2*headSize}`
                        break;
                }
            }
            else{
                switch(rotation){
                    case 0:
                        path = `M${xo},${yo} a${r} ${r} 0,0,0 ${2*r},0 
                                M${xo+2*r},${yo} l${-1.5*headSize},${0.7*headSize}
                                M${xo+2*r},${yo} l${1.2*headSize},${1.0*headSize}`
                        break;
                    case 90:
                        path = `M${xo},${yo} a${r} ${r} 0,0,1 0,${2*r} 
                                M${xo},${yo} l${1.8*headSize},${-0.7*headSize} 
                                M${xo},${yo} l${0.7*headSize},${1.5*headSize}`
                        break;
                    case 180:
                        path = `M${xo},${yo} a${r} ${r} 0,0,0 ${-2*r},0 
                                M${xo-2*r},${yo} l${-1.0*headSize},${-1.5*headSize} 
                                M${xo-2*r},${yo} l${1.5*headSize},${-0.5*headSize}`
                        break;
                    case 270:
                        path = `M${xo},${yo} a${r} ${r} 0,0,0 0,${2*r} 
                                M${xo},${yo+2*r} l${-0.5*headSize},${-1.5*headSize} 
                                M${xo},${yo+2*r} l${-1.4*headSize},${1.0*headSize}`
                        break;
                }
            }
            
            
            return path
        },//DIMENSION PATH
       
    }//METHODS
}//EXPORT