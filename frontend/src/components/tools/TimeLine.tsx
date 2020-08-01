import React from "react";
import { IconButton, Chip, Avatar } from "@material-ui/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import Dot from "../utils/Dot";

import "./TimeLine.css";
import SpotDialog from "./SpotDialog";
import ImageDialog from "./ImageDialog";

interface Props {
  data: any[];
}

const TimeLine: React.FC<Props> = ({ data }) => {
  const dir: string[] = ["left", "right"];
  const months: string[] = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sepr",
    "Oct",
    "Nov",
    "Dec",
  ];
  const toDateString = (date: string) => {
    const day: string = String(parseInt(date.slice(8, 10)));
    const mon: string = months[parseInt(date.slice(5, 7)) - 1];
    const year: string = date.slice(0, 4);
    return day + " " + mon + ", " + year;
  };
  return (
    <div className="timeline-container">
      <div className="timeline">
        {data.map((d, i) => (
          <div key={i} className={`timestamp-container ${dir[i % 2]}`}>
            <i className="icon">
              <IconButton style={{ padding: "0px" }} color="primary">
                <PlayCircleFilledIcon fontSize="large" />
              </IconButton>
            </i>
            <div className="date">{d.time}</div>
            <div className="timestamp-content">
              <h2>{toDateString(d.date)}</h2>
              <div style={{ color: "#fff", marginBottom: "10px" }}>
                {d.sublocality}
              </div>
              <div>
                {d.colors.map((color: string, index: number) => (
                  <Dot key={index} color={color} />
                ))}
              </div>
              <div style={{ marginBottom: "10px" }}>
                {d.labels.map((label: string, index: number) => (
                  <Chip
                    key={index}
                    color="primary"
                    style={{
                      margin: "5px 3px",
                      color: "#1C233E",
                      fontWeight: 600,
                    }}
                    label={label}
                    avatar={<Avatar>{label.charAt(0)}</Avatar>}
                  />
                ))}
              </div>
              <div style={{ padding: "10px 5px" }}>
                <SpotDialog latitude={d.coord.latitude} longitude={d.coord.longitude} address={d.sublocality} />
                <ImageDialog timestamp={d.frame_sec} video_id={d.video_id} /> 
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
