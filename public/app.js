document.addEventListener("alpine:init",()=>{Alpine.data("MoonShineYandexMap",i=>{let a=null,o=null;const{deletePlacemarkButtonLabel:l,fitToBoundsButtonLabel:r,defaultIconColor:c,selectedIconColor:d,defaultMapCenter:m,defaultMapZoom:h,mapSavedData:p}=i,n={center:m,zoom:h,placemarks:[]};return{defaultIconColor:c,selectedIconColor:d,deletePlacemarkButtonLabel:l,fitToBoundsButtonLabel:r,mapDataToJson:"",mapData:{},init(){this.initializeDataBinding(),this.initializeMap()},initializeDataBinding(){this.$watch("mapData",t=>{this.mapDataToJson=JSON.stringify(t)});try{this.mapData={...n,...p}}catch{this.mapData={...n}}},initializeMap(){ymaps.ready(()=>{this.createMapInstance(),this.setupMapControls(),this.setupMapEventListeners(),this.loadInitialPlacemarks()})},createMapInstance(){a=new ymaps.Map(this.$refs.map,{center:this.mapData.center,zoom:this.mapData.zoom,controls:["zoomControl","searchControl"]}),a.behaviors.disable("scrollZoom")},setupMapControls(){const t=this.createControlButton(this.deletePlacemarkButtonLabel,this.handleDeletePlacemark.bind(this)),e=this.createControlButton(this.fitToBoundsButtonLabel,this.handleFitToBounds.bind(this));a.controls.add(t,{float:"right",floatIndex:100}).add(e,{float:"right",floatIndex:100})},createControlButton(t,e){const s=new ymaps.control.Button({data:{content:t},options:{selectOnClick:!1,maxWidth:[30,100,150]}});return s.events.add("click",e),s},setupMapEventListeners(){a.events.add("boundschange",t=>{this.mapData.zoom=t.get("newZoom")}),a.events.add("actionend",()=>{this.mapData.center=a.getCenter()}),a.events.add("click",t=>{this.addPlacemark(t.get("coords"))})},loadInitialPlacemarks(){this.mapData.placemarks.forEach(t=>{this.addPlacemark(t,!1)})},resetIconColorPlacemark(){a.geoObjects.each(t=>t.options.set("iconColor",this.defaultIconColor))},updatePlacemarksForMapData(){const t=[];a.geoObjects.each(e=>{t.push(e.geometry.getCoordinates())}),this.mapData.placemarks=t},addPlacemark(t,e=!0){this.resetIconColorPlacemark();const s=new ymaps.Placemark(t,{},{draggable:!0,preset:"islands#governmentCircleIcon",iconColor:e?this.selectedIconColor:this.defaultIconColor});this.setupPlacemarkEventListeners(s),a.geoObjects.add(s),e&&(o=s,this.updatePlacemarksForMapData())},setupPlacemarkEventListeners(t){t.events.add("dragstart",()=>{this.resetIconColorPlacemark(),t.options.set("iconColor",this.selectedIconColor),o=t}).add("dragend",()=>this.updatePlacemarksForMapData()).add("click",()=>{this.resetIconColorPlacemark(),t.options.set("iconColor",this.selectedIconColor),o=t})},handleDeletePlacemark(){o?(a.geoObjects.remove(o),o=null,this.updatePlacemarksForMapData()):alert("Выберите метку для удаления.")},handleFitToBounds(){const t={checkZoomRange:!0,duration:500,zoomMargin:100};if(this.mapData.placemarks.length===1){a.setCenter(this.mapData.placemarks[0],this.mapData.zoom,t);return}if(this.mapData.placemarks.length>1){const e=a.geoObjects.getBounds();a.setBounds(e,t)}}}})});
