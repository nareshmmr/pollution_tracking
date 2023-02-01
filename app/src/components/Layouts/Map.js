import React, { useState, useEffect, useRef } from "react";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import * as olProj from "ol/proj";
import * as olStyle from "ol/style";
import * as olSrcVector from "ol/source";
import * as olLayerVector from "ol/layer";
import * as olGeom from "ol/geom";
import * as ol from "ol";
import { useSelector } from "react-redux";


function OpenLayer(props) {
  const [map, setMap] = useState();
  const mapElement = useRef();
  const _latitude = useSelector(state=>state.latitude);
  const _longitude = useSelector(state=>state.longitude);
  const zoom = useSelector(state=>state.zoom);
  let center = olProj.transform([_longitude, _latitude], "EPSG:4326", "EPSG:3857");
  let marker = new ol.Feature({
    geometry: new olGeom.Point(center),
    name: null,
  });


  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [new TileLayer({
        source: new OSM({ wrapX: true })
      }),
      new olLayerVector.Vector({
        source: new olSrcVector.Vector({
          features: [marker]
        }),
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        style: new olStyle.Style({
          image: new olStyle.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: '../../../dist/img/icons8-location-48.png',
          }),
          text: new olStyle.Text({
            textAlign: 'center',
            font: 13 + 'px Calibri,sans-serif',
            fill: new olStyle.Fill({ color: '#000' }),
            stroke: new olStyle.Stroke({
              color: '#fff', width: 1
            }),
            text: "lat : " + Math.round(_latitude * 100) / 100 + " ,lng : " + Math.round(_longitude * 100) / 100,
          }),
        }),
      }),
      ],
      controls: [],
      overlays: [],
    };
    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapElement.current);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, [_latitude, _longitude]);

  if (map) {
    map.on('singleclick', function (evt) {
      let coordinates = olProj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'); 
      props.setNewLatLonZm(coordinates[0], coordinates[1], map.getView().getZoom());
    });
  }

  return (
    <div ref={mapElement} style={{ height: '70vh', width: '100%' }} />
  );
}
export default OpenLayer;
