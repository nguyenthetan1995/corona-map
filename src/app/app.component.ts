import { Component, AfterViewInit, OnInit } from '@angular/core';
import sampleData from './data/data.json';
import coronaviruss from './data/coronaviruss.json';
declare let L;
declare let $;
declare let Highcharts;
import * as Leaflet from 'leaflet'
import HeatmapOverlay from 'leaflet-heatmap';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'corona-map';
  currentDate: number = Date.now();
  map: any;
  marker: any = {};
  heatmapLayer: any = {};
  heat: any;
  numberrecovered = 1;
  totalnumbersick = 7
  numbersick =7;
  deaths = 0
  public Users:{ID: number, name: string, Lat: number, Lng: number, address: string}[] = sampleData;
  // tslint:disable-next-line: max-line-length
  public coronadata:{STT: number, address: string, Lat: number, Lng: number, deaths: number,recovered: number, number: number, danger: number}[] = coronaviruss;
  ngOnInit(){
  }
  ngAfterViewInit() {
    /* const markers = new L.MarkerClusterGroup({
      maxClusterRadius: 30,
      spiderfyOnMaxZoom: true
    });
    const coronamarkers = new L.MarkerClusterGroup({
      maxClusterRadius: 30,
      spiderfyOnMaxZoom: true
    }); */
    this.map = L.map('mapid').setView([21.131498, 105.774478], 12);
    const hospital = L.layerGroup();
    const corona = L.layerGroup();
    // tslint:disable-next-line: max-line-length
    L.tileLayer('https://maps.vietmap.vn/tm6/{z}/{x}/{y}@2x.png?apikey=f50f96fd875c023e6fd8acac6d9a7e0d15699071d3259542', {maxZoom: 18, minZoom: 0}).addTo(this.map);
    // tslint:disable-next-line: prefer-for-of
    for(let i = 0; i< this.Users.length; i++){
      let div = '<div class= "popup row">';
          div += '<div class= "col-sm-4">STT</div>';
          div += '<div class= "col-sm-8">'+ this.Users[i].ID+'</div>';
          div += '<div class= "col-sm-4">Tên</div>';
          div += '<div class= "col-sm-8">'+ this.Users[i].name+'</div>';
          div += '<div class= "col-sm-4">Địa chỉ</div>';
          div += '<div class= "col-sm-8">'+ this.Users[i].address+'</div>';
          div += '</div>';
          div += '</div>';
      const location = [this.Users[i].Lat, this.Users[i].Lng];
      this.marker[this.Users[i].Lat] = L.marker(location, { icon: L.icon({ iconUrl: './assets/hospital.png', iconSize: [30, 30] }) }).bindPopup(div);;
      hospital.addLayer(this.marker[this.Users[i].Lat]);
     /*  markers.addLayer(this.marker[this.Users[i].Lat]); */
    }

    const dataheat = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.coronadata.length; i++){
      const location = [this.coronadata[i].Lat, this.coronadata[i].Lng];
      const dat =[this.coronadata[i].Lat, this.coronadata[i].Lng, this.coronadata[i].number*1200]
      dataheat.push(dat);
      
    }
    this.map.addLayer(hospital);
    
    this.heat = L.heatLayer(dataheat, {radius: 50,maxZoom :18 });
    this.map.addLayer(this.heat)
    const height= $("#mat-figure").height();
    const width= $("#mat-figure").width();
 
    Highcharts.chart('container', {
     chart: {
        width: width,
        height: height
      },    
      title: {
          text: 'Đồ thị số trường hợp nhiễm virút corona tại Việt Nam'
      },

      yAxis: {
          title: {
              text: 'Số người'
          }
      },

      xAxis: {
           categories: ['27/1/2020', '28/1/2020', '29/1/2020', '30/1/2020', '31/1/2020', '1/2/2020', '2/2/2020']
          },

      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },
      series: [{
          name: 'Số người nhiễm',
          data: [0, 2, 2, 3, 5, 6,7]
      }],

      responsive: {
          rules: [{
              condition: {
                  maxWidth: 1000
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'middle'
                  }
              }
          }]
      }

  });
  }
  panto(id){
    for(let i = 0; i< this.coronadata.length; i++){
      if(id === this.coronadata[i].STT){
        const location = [this.coronadata[id-1].Lat, this.coronadata[id-1].Lng]
       /*  this.map.panTo(location); */
       this.numberrecovered = this.coronadata[id-1].recovered;
       this.numbersick= this.coronadata[id-1].number;
        this.map.flyTo(location, 14);

      }
    }
  }

}
