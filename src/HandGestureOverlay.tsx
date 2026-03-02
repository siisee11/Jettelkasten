import React, { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { getAngleDelta, getClosenessDelta } from "./handGestureMath";

const TASKS_VERSION = "0.10.0";
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`;
const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

const PINCH_THRESHOLD = 0.08;
const MOTION_DEADZONE = 0.0015;
const ZOOM_DEADZONE = 0.002;
const TWIST_DEADZONE = 0.01;
const MOTION_LIMIT = 0.06;
const TWIST_TO_ORBIT_SCALE = 0.45;
const SHOW_CAMERA_FEED = false;

type GestureMode = "idle" | "orbit" | "zoom";

export type GestureControlEvent = {
  mode: GestureMode;
  deltaX?: number;
  deltaY?: number;
  zoomDelta?: number;
};

type Landmark = { x: number; y: number; z?: number };

type Props = {
  onControl?: (event: GestureControlEvent) => void;
};

const distance2D = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);

const clampMagnitude = (value: number, maxAbs = MOTION_LIMIT) =>
  Math.max(-maxAbs, Math.min(maxAbs, value));

const applyDeadzone = (value: number, deadzone: number) =>
  Math.abs(value) < deadzone ? 0 : clampMagnitude(value);

const isPinch = (landmarks: Landmark[]) => {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  if (!thumbTip || !indexTip) return false;
  return distance2D(thumbTip, indexTip) < PINCH_THRESHOLD;
};

const pinchCenter = (landmarks: Landmark[]) => {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  if (!thumbTip || !indexTip) return null;
  return {
    x: (thumbTip.x + indexTip.x) * 0.5,
    y: (thumbTip.y + indexTip.y) * 0.5,
  };
};

const modeLabel = (mode: GestureMode) => {
  switch (mode) {
    case "orbit":
      return "Orbit";
    case "zoom":
      return "Zoom";
    default:
      return "Idle";
  }
};

export default function HandGestureOverlay({ onControl }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastHandTextRef = useRef("");

  const lastModeRef = useRef<GestureMode>("idle");
  const prevOrbitPointRef = useRef<{ x: number; y: number } | null>(null);
  const prevZoomDistanceRef = useRef<number | null>(null);
  const prevTwoHandAngleRef = useRef<number | null>(null);

  const [status, setStatus] = useState("Initializing hand tracker...");
  const [handText, setHandText] = useState("No hand detected · Idle");

  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;

    const resetMotionRefs = () => {
      prevOrbitPointRef.current = null;
      prevZoomDistanceRef.current = null;
      prevTwoHandAngleRef.current = null;
    };

    const sendControl = (event: GestureControlEvent) => {
      if (lastModeRef.current !== event.mode) {
        resetMotionRefs();
      }
      lastModeRef.current = event.mode;
      onControl?.(event);
    };

    const getGestureEvent = (landmarksList: Landmark[][]): GestureControlEvent => {
      if (!landmarksList.length) {
        return { mode: "idle" };
      }

      if (landmarksList.length >= 2) {
        const first = landmarksList[0];
        const second = landmarksList[1];
        if (isPinch(first) && isPinch(second)) {
          const centerA = pinchCenter(first);
          const centerB = pinchCenter(second);
          if (centerA && centerB) {
            const dist = distance2D(centerA, centerB);
            const prevDist = prevZoomDistanceRef.current;
            prevZoomDistanceRef.current = dist;

            const currentAngle = Math.atan2(centerB.y - centerA.y, centerB.x - centerA.x);
            const prevAngle = prevTwoHandAngleRef.current;
            prevTwoHandAngleRef.current = currentAngle;

            let twistOrbitDelta = 0;
            if (prevAngle !== null) {
              const angleDelta = getAngleDelta(prevAngle, currentAngle);
              twistOrbitDelta = applyDeadzone(angleDelta * TWIST_TO_ORBIT_SCALE, TWIST_DEADZONE);
            }

            let zoomDelta = 0;

            if (prevDist !== null) {
              const raw = getClosenessDelta(prevDist, dist);
              zoomDelta = applyDeadzone(raw, ZOOM_DEADZONE);
            }

            if (twistOrbitDelta !== 0) {
              return { mode: "orbit", deltaX: twistOrbitDelta, deltaY: 0, zoomDelta };
            }

            if (zoomDelta !== 0) {
              return { mode: "zoom", zoomDelta };
            }
            return { mode: "zoom", zoomDelta: 0 };
          }
        }
      }

      const hand = landmarksList[0];
      const pinch = isPinch(hand);

      if (pinch) {
        const center = pinchCenter(hand);
        if (!center) return { mode: "idle" };
        const prev = prevOrbitPointRef.current;
        prevOrbitPointRef.current = center;
        if (!prev) return { mode: "orbit", deltaX: 0, deltaY: 0 };

        const deltaX = applyDeadzone(center.x - prev.x, MOTION_DEADZONE);
        const deltaY = applyDeadzone(center.y - prev.y, MOTION_DEADZONE);
        return { mode: "orbit", deltaX, deltaY };
      }

      return { mode: "idle" };
    };

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
      if (SHOW_CAMERA_FEED) {
        context.drawImage(video, 0, 0, width, height);
      }

      const result: HandLandmarkerResult = handLandmarker.detectForVideo(video, performance.now());
      const landmarksList = (result.landmarks ?? []) as Landmark[][];
      const gestureEvent = getGestureEvent(landmarksList);
      sendControl(gestureEvent);

      const drawingUtils = new DrawingUtils(context);
      for (const landmarks of landmarksList) {
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF5252",
          lineWidth: 1,
          radius: 2.5,
        });
      }

      const handInfoText = (result.handednesses ?? [])
        .map((entries) => {
          const primary = entries?.[0];
          if (!primary) return "Hand";
          return `${primary.categoryName} ${(primary.score ?? 0).toFixed(2)}`;
        })
        .join(" | ");

      const normalizedText = `${handInfoText || "No hand detected"} · ${modeLabel(gestureEvent.mode)}`;
      if (normalizedText !== lastHandTextRef.current) {
        lastHandTextRef.current = normalizedText;
        setHandText(normalizedText);
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
  }, [onControl]);

  return (
    <div className="hand-gesture-overlay">
      <div className="hand-gesture-status">{status}</div>
      <canvas ref={canvasRef} className="hand-gesture-canvas" />
      <video ref={videoRef} className="hand-gesture-video-hidden" playsInline muted />
      <div className="hand-gesture-label">{handText}</div>
    </div>
  );
}
