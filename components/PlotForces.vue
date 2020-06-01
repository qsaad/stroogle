<template>
    <div>
        <vue-apex-charts width="100%" type="area" :options="options" :series="series"></vue-apex-charts>
    </div>
    
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
    name:'PlotForces',
    middleware: [],
    components:{
        VueApexCharts,
    },//COMPONENTS
    props: {
      series: {type: Array, default: []},
      chartId : {type: String, default: ''},

    },
    data(){
        return{
            options: {
                chart: {
                    id: this.ChartId,
                    toolbar:{show: false},
                },//CHART
                legend:{
                    show:false
                },
                markers:{
                    size : 0
                },
                stroke:{
                    curve : 'smooth'
                },
                dataLabels:{
                        enabled:false
                },//DATALABELS
            },//OPTIONS
           
        }//RETURN
    }//DATA

}//EXPORT
</script>

<style scoped>

</style>
