import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .map-container{
      height:100%;
      width:100%;
    }

    .row{
      background-color: white;
      bottom: 50px;
      left: 50px;
      border-radius: 5px;
      padding:10px;
      position:fixed;
      z-index: 999;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') divMap!:ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -75.376853657672, 9.292399659789558 ];

  constructor() {
   }
  
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

    // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker()
    .setLngLat(this.center)
    .addTo(this.map);
 

    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if(this.map.getZoom() > 18){
         this.map.zoomTo(18);
      }
    })

    this.map.on('move', (ev) => {
       const target = ev.target;
       const {lng, lat} = target.getCenter();
       this.center = [lng, lat];
    });

  }

  zoomIn(){
    this.map.zoomIn();
  }

  zoomOut(){
    this.map.zoomOut();
  }

  zoomCambio(value:string){
    this.map.zoomTo(Number(value));
  }

  ngOnDestroy(): void {
   this.map.off('zoom', ()=> {});
   this.map.off('zoomend', ()=> {});
   this.map.off('move', ()=> {});
  }
}
