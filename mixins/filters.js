export default {
    filters: {
        dp0(value) {
            return parseFloat(value).toFixed(0)
        },
        dp1(value) {
            return parseFloat(value).toFixed(1)
        },
        dp2(value) {
            return parseFloat(value).toFixed(2)
        },
        dp3(value) {
            return parseFloat(value).toFixed(3)
        }
    }
}//EXPORT