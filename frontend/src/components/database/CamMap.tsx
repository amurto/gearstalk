import React, { useState, useMemo } from "react";
import MapGL, { Popup } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";

import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  width: string;
  height: string;
  viewState: {
    latitude: number;
    longitude: number;
    zoom?: number;
    pitch?: number;
    bearing?: number;
  };
  onViewStateChange: ({ viewState }: { viewState: any }) => void;
  libraries: {
    [key: string]: any;
  }[];
}

const CamMap: React.FC<Props> = ({
  width,
  height,
  viewState,
  onViewStateChange,
  libraries,
}) => {
  const data = useMemo(() => {
    let items: any[] = [];
    for (let i = 0; i < libraries.length; i++) {
      items.push([
        libraries[i].longitude,
        libraries[i].latitude,
        libraries[i]._id.$oid,
        libraries[i].formatted_address,
      ]);
    }
    return items;
  }, [libraries]);

  const [location, setLocation] = useState<{
    oid: string;
    latitude: string | null;
    longitude: string | null;
    address: string | null
  }>({
    oid: "",
    latitude: null,
    longitude: null,
    address: "",
  });

  const radius = 5;
  const lineWidth = 4;

  const layers = [
    new ScatterplotLayer({
      id: "scatter-plot",
      data: data,
      getRadius: 500 * radius,
      radiusMaxPixels: 15,
      radiusMinPixels: 0.5,
      getFillColor: [117, 193, 255],
      stroked: true,
      getLineWidth: 500 * lineWidth,
      lineWidthMaxPixels: 10,
      getLineColor: [117, 193, 255, 76],
      getPosition: (d) => [d[0], d[1], 0],
      pickable: true,
      onClick: ({ object }) => {
        console.log(object);
        setLocation({
          oid: object[2],
          longitude: object[0],
          latitude: object[1],
          address: object[3],
        });
      },
    }),
  ];

  const clearPopUp = () => {
    setLocation({
      oid: "",
      latitude: null,
      longitude: null,
      address: null,
    });
  };

  return (
    <MapGL
      width={width}
      height={height}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      mapStyle="mapbox://styles/gisfeedback/cjvod9hc909kh1eo9nj23g33k"
    >
      <DeckGL viewState={viewState} layers={layers} />
      {location.oid && (
        <Popup
          style={{ background: "#000000" }}
          longitude={location.longitude}
          latitude={location.latitude}
          onClose={clearPopUp}
        >
          <div>
            <p>{location.address}</p>
          </div>
        </Popup>
      )}
    </MapGL>
  );
};

export default CamMap;
