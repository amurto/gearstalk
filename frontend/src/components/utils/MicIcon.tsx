import React from "react";
import "./MicIcon.scss";

const MicIcon: React.FC<{ isRecording: boolean }> = ({ isRecording }) => {
  return (
    <div className="frame">
      <div className="center">
        <div className="mic_container">
          <div className={`mic_body ${isRecording && "mic_animate"}`}>
            <div className="mic_pill"></div>
            <div className="mic_hole"></div>
            <div className="mic_stand"></div>
            <div className="mic_bottom"></div>
          </div>
          <div className={`dots ${isRecording && "animate"}`}>
            <div className={`dots_left ${isRecording && "animate"}`} />
            <div className={`dots_middle ${isRecording && "animate"}`} />
            <div className={`dots_right ${isRecording && "animate"}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicIcon;
