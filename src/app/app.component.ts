import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Rx";
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
export class AppComponent implements AfterViewInit {

 constructor(private http: HttpClient) {
   this.http.get(this.localUrl).subscribe((data: any)=>{
     this.coronadata = data;
   }) 
  }
  title = 'corona-map';
  currentDate: number = Date.now();
  private map: any;
  marker: any = {};
  heatmapLayer: any = {};
  heat: any;
  numberrecovered = 1;
  totalnumbersick = 7
  numbersick =7;
  deaths = 0;
  downloadJsonHref: any;
  addaddress='';
  addnumber=0;
  adddeaths=0;
  addrecovered=0;
  addaradius=0;
  private location: {lat:number,lng:number}[] = [];

  public Users:{ID: number, name: string, Lat: number, Lng: number, address: string}[] = sampleData;
  localUrl = 'http://localhost:8086/posts';
  // tslint:disable-next-line: max-line-length
  public coronadata:{id: number, address: string, Lat: number, Lng: number, deaths: number,recovered: number, number: number, danger: number}[] = coronaviruss;
  private initMap(): void {
    let lat;
    let lng;
    this.map = L.map('mapid').setView([21.131498, 105.774478], 12).on('click', function(e) {
      console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
      lat = e.latlng.lat;
      lng = e.latlng.lng;
      $('.modal').modal('show');
      console.log(this.location);;
    });
    L.tileLayer('https://maps.vietmap.vn/tm6/{z}/{x}/{y}@2x.png?apikey=f50f96fd875c023e6fd8acac6d9a7e0d15699071d3259542', {maxZoom: 18, minZoom: 0}).addTo(this.map);
    const hospital = L.layerGroup();
    const corona = L.layerGroup();
    // tslint:disable-next-line: max-line-length
    
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
  }
  ngAfterViewInit(): void {
    /* this.map = L.map('mapid').setView([21.131498, 105.774478], 12).on('click', function(e) {
      console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
      this.location.lat = e.latlng.lat;
      this.location.lng = e.latlng.lng;
      console.log(this.location);
      $('.modal').modal('show');
    }); */
    this.initMap();
    
    
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
    
    const data1 = {
      id : this.coronadata.length+1,
      address: this.addaddress,
      number:this.addnumber,
      deaths: this.adddeaths,
      danger:this.addrecovered,
      recovered: this.addaradius,
      Lat: 0, 
      Lng: 0
    }
    this.http.post(this.localUrl,data1).subscribe((data: any)=>{
      this.coronadata.push(data1);
      const dataheat = [];
      //this.map.removeLayer(this.heat);
      for (let i = 0; i < this.coronadata.length; i++){
        const location = [this.coronadata[i].Lat, this.coronadata[i].Lng];
        const dat =[this.coronadata[i].Lat, this.coronadata[i].Lng, this.coronadata[i].number*1200]
        dataheat.push(dat);
      }
      console.log(dataheat);
      this.heat = L.heatLayer(dataheat, {radius: 50,maxZoom :18 });
      this.map.addLayer(this.heat)
      $('.modal').modal('hide');
    })
  }
  panto(id){
    for(let i = 0; i< this.coronadata.length; i++){
      if(id === this.coronadata[i].id){
        const location = [this.coronadata[id-1].Lat, this.coronadata[id-1].Lng]
       /*  this.map.panTo(location); */
       this.numberrecovered = this.coronadata[id-1].recovered;
       this.numbersick= this.coronadata[id-1].number;
        this.map.flyTo(location, 14);

      }
    }
  }
  
  add($event){
      
    /* this.http.get(this.localUrl).subscribe((data: any)=>{
      this.coronadata = data;
      console.log(data);
    }) */
   /*  coronaviruss.splice(coronaviruss.length - 1, 0, data); */
    
  }
}
