import { useEffect, useState, useRef, useCallback } from "react";
import MediaStreamRecorder from "msr";

const useToggle = (initialValue: boolean) => {
  const [isRecording, setIsRecording] = useState<boolean>(initialValue);
  const toggleIsRecording = useCallback(
    () => setIsRecording((isRecording) => !isRecording),
    []
  );

  return { isRecording, toggleIsRecording };
};

const mediaOptions = {
  mimeType: "audio/wav",
  bufferSize: 2048,
  sampleRate: 44100,
};

const useRecorder = (open: boolean) => {
  const [audioURL, setAudioURL] = useState<Blob[]>([]);
  const { isRecording, toggleIsRecording } = useToggle(false);

  const recorder = useRef<{ [key: string]: any }>({});
  const stream = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (open) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then(function (str) {
          console.log("ready to record!");
          stream.current = str;
          recorder.current = new MediaStreamRecorder(str);
          recorder.current.mimeType = mediaOptions.mimeType;
          recorder.current.bufferSize = mediaOptions.bufferSize;
          recorder.current.sampleRate = mediaOptions.sampleRate;

          // listen to dataavailable, which gets triggered whenever we have
          // an audio blob available
          recorder.current.ondataavailable = (blob) => {
            if (blob) {
                console.log(blob)
              setAudioURL((audioURL) => [...audioURL, blob]);
            }
          };
          //  recorder.current.addEventListener("dataavailable", onRecordingReady);
        })
        .catch((err) => console.log(err));
    }
  }, [open]);

  const startRecording = useCallback(() => {
    recorder.current.start();
    toggleIsRecording();
  }, [recorder, toggleIsRecording]);

  const stopRecording = useCallback(() => {
    recorder.current.stop();
    setAudioURL([]);
    toggleIsRecording();
  }, [recorder, toggleIsRecording]);

  const clearRecording = useCallback(() => {
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop();
      setAudioURL([]);
      toggleIsRecording();
      if (stream.current !== null) {
        stream.current.getAudioTracks().forEach((track) => {
          track.stop();
        });
      }
    }
  }, [recorder, stream, toggleIsRecording]);

  return {
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    clearRecording,
  };
};

export default useRecorder;
