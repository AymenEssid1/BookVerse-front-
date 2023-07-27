import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';


import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';
import { DataService } from 'src/app/SERVICE/DataService';

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  price: number;
  quantity:number
}

// Add the quantitySold property to the Book interface
interface BookWithQuantitySold extends Book {
  quantitySold: number;
}

interface year {
  value: string;
  viewValue: string;
}

export interface salesOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

export interface yearlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

export interface monthlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}
export type pie = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};



interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AppDashboardComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public salesOverviewChart!: Partial<salesOverviewChart> | any;
  public yearlyChart!: Partial<yearlyChart> | any;
  public monthlyChart!: Partial<monthlyChart> | any;
  public catChart!: Partial<pie> | any;


  years: year[] = [];
  getyears() {
    for (let year = 2021; year <= 2123; year++) {
      this.years.push({ value: year.toString(), viewValue: year.toString() });
    }
  }

  /*
    // recent transaction
    stats: stats[] = [
      {
        id: 1,
        time: '09.30 am',
        color: 'primary',
        subtext: 'Payment received from John Doe of $385.90',
      },
      {
        id: 2,
        time: '10.30 am',
        color: 'accent',
        title: 'New sale recorded',
        link: '#ML-3467',
      },
      {
        id: 3,
        time: '12.30 pm',
        color: 'success',
        subtext: 'Payment was made of $64.95 to Michael',
      },
      {
        id: 4,
        time: '12.30 pm',
        color: 'warning',
        title: 'New sale recorded',
        link: '#ML-3467',
      },
      {
        id: 5,
        time: '12.30 pm',
        color: 'error',
        title: 'New arrival recorded',
        link: '#ML-3467',
      },
      {
        id: 6,
        time: '12.30 pm',
        color: 'success',
        subtext: 'Payment Done',
      },
    ];
  
    */

  constructor(private dataService: DataService) {
    // sales overview chart
    this.salesOverviewChart = {
      series: [
        {
          name: 'Eanings this year',
          data: [355, 390, 300, 350, 390, 180, 355, 390],
          color: '#5D87FF',
        },
        {
          name: 'Eanings last year',
          data: [355, 390, 300, 350, 390, 180, 355, 390],
          color: '#fff',
        },
      ],

      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
      },
      chart: {
        type: 'bar',
        height: 435,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        sparkline: { enabled: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: true},
      xaxis: {
        type: 'category',
        categories: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'

        ],
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 1000,
        tickAmount: 2,
        labels: {
          style: {
            cssClass: 'grey--text lighten-2--text fill-color',
          },
          formatter: (value: number) => Math.floor(value).toString(),
        },
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: 'butt',
        colors: ['transparent'],
      },
      tooltip: { theme: 'light' },

      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    };


    // MONTHLYYYYYYYYYYYY
    this.monthlyChart = {
      series: [60, 40],

      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 130,
      },
      colors: ['#5D87FF', '#000000'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: '75%',
            background: 'transparent',
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },

    };

    // YAERLYYYYYYYYYYYYYYYYYY
    this.yearlyChart = {
      series: [
        {
          name: 'new',
          color: '#49BEFF',
          data: [25, 66, 20, 40, 12, 58, 20],
        },
        {
          name: 'last',
          color: '#49BEFF',
          data: [25, 50, 20, 40, 12, 58, 20],
        },
      ],

      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 100,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#E8F7F0'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },

    };
    ///CATT*************************
    this.catChart = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team 999", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 10,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]

    };
  }

  currentSalesData: number[] = [];
  lastSalesData: number[] = [];
  currentYear: number;
  currentMonth: number;
  currentYearSales: number;
  lastYearSales: number;
  diff: number;

  thisMonthEarning: number;
  lastMonthEarning: number;
  thismonthName: string;
  diff2: number

  getMonthName(monthNumber: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNames[monthNumber - 1];

  }

  ngOnInit() {
    this.getyears();
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth() + 1; // Adding 1 because months are zero-based (0 = January, 1 = February, ...)
    this.thismonthName = this.getMonthName(this.currentMonth);

    this.dataService.getTotalSalesByYearAndMonth(this.currentYear).subscribe(
      (data: number[]) => {
       // console.log(data);
        this.currentSalesData = data.slice(0, 12); // First 12 elements
        
        this.lastSalesData = data.slice(12); // Rest of the elements
        this.thisMonthEarning = this.currentSalesData[this.currentMonth - 1]
        this.lastMonthEarning = this.lastSalesData[this.currentMonth - 1]
        this.calculateTotalSales();
       // console.log(this.currentSalesData);
       // console.log(this.lastSalesData);
        this.updateChart();
        this.updateWave();
        this.updatePie();
      },
      (error: any) => {
        console.error('Error fetching sales data:', error);
      }
    );

    this.getData();

  }
  calculateTotalSales(): void {
    this.currentYearSales = this.currentSalesData.reduce((sum, value) => sum + value, 0);
    this.lastYearSales = this.lastSalesData.reduce((sum, value) => sum + value, 0);
    const salesDifference = this.currentYearSales - this.lastYearSales;
    if(this.lastYearSales!=0)
   { const percentDifference = (salesDifference / this.lastYearSales) * 100;
    this.diff = percentDifference;
}else{this.diff = this.currentYearSales}

    const salesDifference2 = this.thisMonthEarning - this.lastMonthEarning;
    if(this.lastMonthEarning!=0)
   {const percentDifference2 = (salesDifference2 / this.lastMonthEarning) * 100;
    console.log(percentDifference2);
    this.diff2 = percentDifference2;}
    else{this.diff2=this.thisMonthEarning}

  }
  selectedYearNumber :number=new Date().getFullYear();;
  onYearSelected(selectedYear: string): void {
    this.selectedYearNumber = parseInt(selectedYear, 10); 
    this.period=parseInt(selectedYear, 10); 
    this.getData();
    this.getTotalSalesByYearAndMonth(this.selectedYearNumber)
    
  }
  
  getTotalSalesByYearAndMonth(year :number){

    this.dataService.getTotalSalesByYearAndMonth(year).subscribe(
      (data: number[]) => {
        this.currentSalesData = data.slice(0, 12); // First 12 elements
        this.lastSalesData = data.slice(12); // Rest of the elements
        this.thisMonthEarning = this.currentSalesData[this.currentMonth - 1]
        this.lastMonthEarning = this.lastSalesData[this.currentMonth - 1]
        this.calculateTotalSales();
       // console.log(this.currentSalesData);
        //console.log(this.lastSalesData);
        this.updateChart();
        this.updateWave();
        this.updatePie();
      },
      (error: any) => {
        console.error('Error fetching sales data:', error);
      }
    );

  }

  updateChart(): void {
    const maxSalesValue1 = Math.max(...this.currentSalesData);
    const maxSalesValue2 = Math.max(...this.lastSalesData);
    const maxSalesValue=Math.max(maxSalesValue1,maxSalesValue2)
    const maxSalesValueLog = Math.ceil(Math.log10(maxSalesValue));
    const roundedMaxSalesValue = Math.ceil(maxSalesValue / 10 ** (maxSalesValueLog - 1)) * 10 ** (maxSalesValueLog - 1);

    this.salesOverviewChart.series = [
      {
        name: 'Selected year Sales',
        data: this.currentSalesData,
        color: '#5D87FF',
      },
      {
        name: ' Previous year Sales',
        data: this.lastSalesData,
        color: '#000000',
      }
    ];
    this.salesOverviewChart.yaxis = [
      {
        show: true,
        min: 0,
        max: roundedMaxSalesValue,
        tickAmount: 5,
        labels: {
          style: {
            cssClass: 'grey--text lighten-2--text fill-color',

          }, formatter: (value: number) => Math.round(value).toString(),
        },
      }
    ];
    // Make the graph bars thicker by increasing the columnWidth value
    this.salesOverviewChart.plotOptions = {
      bar: {
        horizontal: false,
        columnWidth: '50%', 
        borderRadius: [4],
      },
    };
  }
  updateWave(): void {
    this.yearlyChart.series = [{
      name: 'new',
      color: '#49BEFF',
      data: this.currentSalesData.map((value) => parseFloat(value.toFixed(2))),
    },
    {
      name: 'last',
      color: '#000000',
      data: this.lastSalesData.map((value) => parseFloat(value.toFixed(2))),
    },];
  }
  updatePie(): void {
    // Calculate the percentage for current and last year sales
    const totalSales = this.thisMonthEarning + this.lastMonthEarning;
    const currentMonthPercentage = (this.thisMonthEarning / totalSales) * 100;
    const lastMonthPercentage = (this.lastMonthEarning / totalSales) * 100;
    this.monthlyChart.series = [currentMonthPercentage, lastMonthPercentage]
      ;
  }

  booksSoldByCategoryData:any
  mostSoldBooksData:any
  leastSoldBooksData:any
  dataSource1: MatTableDataSource<BookWithQuantitySold>;
  displayedColumns: string[] = ['Book',  'quantity', 'sold', 'category'];
  dataSource2: MatTableDataSource<BookWithQuantitySold>;
  displayedColumns2: string[] = ['Book', 'quantity', 'sold', 'category'];


  period:number=2023;
  onBarClickHandler(xAxisValue: string) {
    console.log('Clicked on bar with x-axis value:', xAxisValue);
    // You can perform any other actions with the x-axis value here
  }

  onBarClick(){
    console.log("hello");
  }
  getData() {
    //const period = 2023; 

    forkJoin({
      mostSoldBooks: this.dataService.getMostSoldBooks(this.period),
      leastSoldBooks: this.dataService.getLeastSoldBooks(this.period),
      booksSoldByCategory: this.dataService.getBooksSoldByCategory(this.period),
      //totalSalesthis:this.dataService.getTotalSalesByYearAndMonth(this.currentYear)
    }).subscribe(
      (data: any) => {
        console.log(data.mostSoldBooks);
        this.mostSoldBooksData = data.mostSoldBooks;
        this.dataSource1 = new MatTableDataSource(this.mostSoldBooksData);
       // console.log(this.dataSource1);
        this.leastSoldBooksData = data.leastSoldBooks;
        this.dataSource2 = new MatTableDataSource(this.leastSoldBooksData);
        this.booksSoldByCategoryData = data.booksSoldByCategory;
       // console.log(this.extractValues(this.booksSoldByCategoryData));
       // console.log('Most Sold Books:', this.mostSoldBooksData)
        ;
       // console.log('Least Sold Books:', this.leastSoldBooksData);
       // console.log('Books Sold By Category:', this.booksSoldByCategoryData);

       this.catChart.series = this.extractValues(this.booksSoldByCategoryData);
       this.catChart.labels=this.extractCategories(this.booksSoldByCategoryData);
       // console.log(this.extractCategories(this.booksSoldByCategoryData))
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  
  extractValues(data: { [key: string]: number }): number[] {
    const values: number[] = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        values.push(data[key]);
      }
    }
    return values;
  }

  extractCategories(data: { [key: string]: number }): string[] {
    return Object.keys(data);
  }

  

  

}
