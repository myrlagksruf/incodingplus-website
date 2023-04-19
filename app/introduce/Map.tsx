'use client'

import { FC, useEffect, useRef } from "react"

export const MapElement:FC = () => {
    const mapElement = useRef(null);
    useEffect(() => {
      const { naver } = window;
      if (!mapElement.current || !naver) return;
  
      const location = new naver.maps.LatLng(37.308145, 126.8320995);
      const mapOptions: naver.maps.MapOptions = {
        center: location,
        zoom: 14,
        zoomControl: false,
        scrollWheel:false,
        disableDoubleClickZoom:true,
        disableDoubleTapZoom:true,
        disableTwoFingerTapZoom:true,
      };
      const map = new naver.maps.Map(mapElement.current, mapOptions);
      new naver.maps.Marker({
        position: location,
        map,
        title:'인코딩플러스 학원',
      });
      return () => {
        map.destroy()
      }
    }, []);
  
  
    return (<div ref={mapElement} style={{ minHeight: '400px' }} />);
}