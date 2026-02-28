import React, { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

const TASKS_VERSION = "0.10.0";
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`;
const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export default function HandGestureOverlay() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastHandTextRef = useRef("");

  const [status, setStatus] = useState("Initializing hand tracker...");
  const [handText, setHandText] = useState("No hand detected");

  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;

    const render = () => {
      if (!active) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const handLandmarker = handLandmarkerRef.current;

      if (!video || !canvas || !handLandmarker) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const width = video.videoWidth || 320;
      const height = video.videoHeight || 240;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const context = canvas.getContext("2d");
      if (!context) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      context.save();
      context.clearRect(0, 0, width, height);
      context.drawImage(video, 0, 0, width, height);

      const result: HandLandmarkerResult = handLandmarker.detectForVideo(video, performance.now());

      if (result) {
        const drawingUtils = new DrawingUtils(context);
        for (const landmarks of result.landmarks ?? []) {
          drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
            color: "#00E676",
            lineWidth: 2,
          });
          drawingUtils.drawLandmarks(landmarks, {
            color: "#FF5252",
            lineWidth: 1,
            radius: 2.5,
          });
        }

        const nextText = (result.handednesses ?? [])
          .map((entries) => {
            const primary = entries?.[0];
            if (!primary) return "Hand";
            return `${primary.categoryName} ${(primary.score ?? 0).toFixed(2)}`;
          })
          .join(" | ");

        const normalizedText = nextText || "No hand detected";
        if (normalizedText !== lastHandTextRef.current) {
          lastHandTextRef.current = normalizedText;
          setHandText(normalizedText);
        }
      }

      context.restore();
      animationRef.current = requestAnimationFrame(render);
    };

    let onLoadedData: (() => void) | null = null;

    const init = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setStatus("Camera is not available in this browser");
          return;
        }

        const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
        if (!active) return;

        try {
          handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_PATH,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        } catch (gpuError) {
          console.warn("GPU delegate unavailable, falling back to CPU", gpuError);
          handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_PATH,
            },
            runningMode: "VIDEO",
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        }

        if (!active) return;

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;

        const startRender = () => {
          if (!active) return;
          setStatus("Hand tracking live");
          if (animationRef.current === null) {
            animationRef.current = requestAnimationFrame(render);
          }
        };
        onLoadedData = startRender;
        video.addEventListener("loadeddata", startRender);

        await video.play();
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          startRender();
        }
      } catch (error) {
        console.error(error);
        setStatus("Failed to start hand tracker");
      }
    };

    init();

    return () => {
      active = false;

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      const video = videoRef.current;
      if (video && onLoadedData) {
        video.removeEventListener("loadeddata", onLoadedData);
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (video) {
        video.srcObject = null;
      }

      handLandmarkerRef.current = null;
    };
  }, []);

  return (
    <div className="hand-gesture-overlay">
      <div className="hand-gesture-status">{status}</div>
      <canvas ref={canvasRef} className="hand-gesture-canvas" />
      <video ref={videoRef} className="hand-gesture-video-hidden" playsInline muted />
      <div className="hand-gesture-label">{handText}</div>
    </div>
  );
}
