export function anchor(size){
    switch (size){
        case '1/4':
            return {d:0.25,A:0.049}
            break
        case '3/8':
            return {d:0.375,A:0.110}
            break
        case '1/2':
            return {d:0.5,A:0.196}
            break
        case '5/8':
                return {d:0.625,A:0.307}
                break
        case '3/4':
            return {d:0.75,A:0.442}
            break
        case '7/8':
            return {d:0.875,A:0.601}
            break
        case '1':
            return {d:1,A:0.785}
            break
        case '1 1/8':
            return {d:1.125,A:994}
            break
        case '1 1/4':
            return {d:1.25,A:1.227}
            break
        case '1 1/2':
            return {d:1.50,A:1.766}
            break
    }//SWITCH
}//EXPORT DEFAULT