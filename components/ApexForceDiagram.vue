<template>
    <div>
        <vue-apex-charts width="450" type="area" :options="options" :series="series"></vue-apex-charts>
    </div>
    
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
    name:'ApexForceDiagram',
    middleware: ['auth'],
    components:{
        VueApexCharts,
    },//COMPONENTS
    props: {
      series: {type: Array, default: []},
      chartId : {type: String, default: ''},
    //   xTitle: {type: String, default: ''},
    //   yTitle: {type: String, default: ''},
    },
    data(){
        return{
            options: {
                chart: {
                    id: this.ChartId,
                    foreColor : '#FFF',
                    toolbar:{show: false},
                },//CHART
                grid: {
                    borderColor: '#545454',
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },//X AXIS
                    yaxis: {
                        lines: {
                            show: true,
                        }
                    },//Y AXIS
                },//GRID
                xaxis: {
                    //type: 'category',
                    //categories: [],
                    labels: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#545454',
                        height: 5,
                        width: '100%',
                        offsetX: 0,
                        offsetY: 0
                    },
                    axisTicks: {
                        show: true,
                        borderType: 'solid',
                        color: '#545454',
                        height: 10,
                        offsetX: 0,
                        offsetY: 0
                    },
                },//X AXIS
                yaxis: {
                    labels: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#545454',
                        height: 1,
                        width:5,
                        width: '100%',
                        offsetX: 0,
                        offsetY: 0
                    },
                },//Y AXIS
                dataLabels:{
                        enabled:false
                },//DATALABELS
                markers: {
                    size: 1,
                    strokeColor: '#FFF',
                    hover: {
                        size: 3,
                    }
                },//MARKERS
                tooltip: {
                    shared: false, intersect: true, x:{show: false}, theme: 'dark', 
                    onDatasetHover: {
                        highlightDataSeries: true,
                    },
                },//TOOLTIP
                stroke: {
                    show: true,
                    curve: 'straight',
                    lineCap: 'butt',
                    //colors: undefined,
                    width: 4,
                    dashArray: 0,      
                },//STROKE
               
            },//OPTIONS
           
        }//RETURN
    }//DATA

}//EXPORT
</script>

<style>

</style>
