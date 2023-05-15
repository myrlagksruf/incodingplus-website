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
      };
      const map = new naver.maps.Map(mapElement.current, mapOptions);
      let marker = new naver.maps.Marker({
        position: location,
        map,
        title:'인코딩플러스 학원',
        clickable:true,
        icon:{
          content:`<div style="position:relative;bottom:50px;right:20px; font-family: Apple SD Gothic Neo,Apple SD Gothic,sans-serif;cursor: pointer;z-index: 10;">
          <span style="position: absolute;bottom: -5px;width: 0;height: 0;border-color: #0475f4 transparent transparent;border-style: solid;border-width: 6px 4px 0;pointer-events: none;left: 17px;"></span>
          <div style="display: flex;gap:5px; border-radius: 23px;background: #0475f4;border: 0;padding:5px;padding-right:10px">
              <div style="font-size: 1px;line-height: 1px;">
                  <span style="position: relative;background-size: 263px 263px;overflow: hidden;display: inline-block;width: 33px;height: 33px;font-size: 0;color: transparent;vertical-align: top;background-position: -105px -105px;background-image: url(https://ssl.pstatic.net/static/maps/v5/pc/20230216150825/marker-face@2x.png);">
                      <span style="overflow: hidden;clip: rect(0 0 0 0);color: transparent;position: absolute;width: 1px;height: 1px;">플레이스</span>
                  </span>
              </div>
              <div style="display: flex;align-items:center;">
                <strong style="white-space: nowrap;color: #fff;letter-spacing: -.4px;font-size: 15px;font-weight: 600;">인코딩플러스학원</strong>
              </div>
          </div>
      </div>`,
        }
      });
      let listener = marker.addListener('click', () => {
        window.open('https://map.naver.com/v5/entry/place/1353598676?c=13,0,0,0,dh&placePath=%2Fhome%3Fentry=plt', '_blank');
      });
      return () => {
        marker.removeListener(listener);
        map.destroy();
      }
    }, []);
  
  
    return (<div ref={mapElement} style={{ minHeight: '400px' }} />);
}