import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor{
  color:string;
  marker?: mapboxgl.Marker;
  center?: [number, number]
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [
    `
    .map-container{
      height:100%;
      width:100%;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right:20px;
      z-index: 99;
    }

    li{
      cursor:pointer;
    }

    `
  ]
})
export class MarkersComponent implements OnInit, AfterViewInit {

  @ViewChild('map') divMap!:ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [ -75.376853657672, 9.292399659789558 ];
  markers: MarkerColor[]=[];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log('After', this.divMap);

    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = "Hola Mundo";



    // Create a default Marker and add it to the map.
    //  new mapboxgl.Marker()
    // .setLngLat(this.center)
    // .addTo(this.map);


  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const marker = new mapboxgl.Marker({
      draggable:true,
      color: color,
    })
    .setLngLat(this.center)
    .addTo(this.map);

    this.markers.push({color, marker: marker});

    this.saveLocalStorage();

    marker.on('dragend', () => {
      this.saveLocalStorage()
    });

  }

  irMarcador(marker?:mapboxgl.Marker){
    this.map.flyTo({
     center: marker!.getLngLat()
    })
  }

  saveLocalStorage(){
   const lngLatArr: MarkerColor[]= [];

   this.markers.forEach(m => {
    const color = m.color;
    const {lng, lat} = m.marker!.getLngLat();

    lngLatArr.push({
      color:color,
      center: [lng, lat]
    });

   })

   localStorage.setItem('marcadores', JSON.stringify(lngLatArr));



  }

  leerLocalStorage(){

    if(!localStorage.getItem('marcadores')){
     return
    } 

    const lngLatArr: MarkerColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat( m.center! )
      .addTo( this.map );

      this.markers.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.saveLocalStorage()
      });
    });

  
  }


  borrarMarcador( i: number ){
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveLocalStorage();
  }

}
