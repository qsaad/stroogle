import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
//import puppeteer from 'puppeteer'

export const pdf =  {
    data(){
        return{
           
        }
    },//DATA
    created(){
        
    },
    computed:{
       
        
    },
    methods:{
        printPDF(){
            html2canvas(document.getElementById('module'))
                .then((canvas) =>{
                    let imgData = canvas.toDataURL("image/png", 0.5);
                    let pdf = new jsPDF();

                    pdf.addImage(imgData, 'PNG', 7, 7);
                    pdf.save("calculation.pdf");
            })

            // (async () => {
            //     const browser = await puppeteer.launch()
            //     const page = await browser.newPage()
            //     await page.goto('https://www.google.com/'); ?
            //     //await page.goto('https://www.google.ru/')

            //     await page.screenshot({path: 'example.png'});

            //      await browser.close();
            // })()
       }//PRINT PDF
    }//METHODS
}//EXPORT