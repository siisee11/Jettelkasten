import React, { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import * as THREE from "three";

const TASKS_VERSION = "0.10.0";
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`;
const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

type GestureMode = "Idle" | "Orbit" | "Pan" | "Zoom" | "Select";
type GestureKey = "openPalm" | "pinch" | "fist" | "point" | "thumbsUp" | "vSign";
type Landmark = { x: number; y: number; z: number };

type HandGestureOverlayProps = {
  graphRef: React.MutableRefObject<any>;
  getNodeAtScreenPoint: (x: number, y: number) => any | null;
  onOpenNode: (node: any) => void;
  onHoverNode?: (node: any | null) => void;
  onSelectNode?: (node: any | null) => void;
  onRecenter?: () => void;
  selectedNodeId?: string | null;
};

type ParsedHand = {
  key: string;
  landmarks: Landmark[];
  handednessText: string;
  center: { x: number; y: number };
  indexTip: { x: number; y: number };
  pinchCenter: { x: number; y: number };
  gesture: Record<GestureKey, number>;
};

type ActiveAction = {
  mode: GestureMode;
  handKey: string;
  startedAt: number;
  activated: boolean;
  lastPoint?: { x: number; y: number };
  lastDistance?: number;
};

const SMOOTHING_WINDOW = 5;
const ACTIVATION_HOLD_MS = 180;
const SELECT_DWELL_MS = 500;
const THUMBS_UP_HOLD_MS = 300;
const V_SIGN_HOLD_MS = 500;
const DEAD_ZONE = 0.008;
const ZOOM_DEAD_ZONE = 0.008;
const PINCH_THRESHOLD = 0.09;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const getFingerExtendedScore = (landmarks: Landmark[], tipIdx: number, pipIdx: number) => {
  const wrist = landmarks[0];
  const tip = landmarks[tipIdx];
  const pip = landmarks[pipIdx];
  if (!wrist || !tip || !pip) return 0;
  const tipDist = distance(wrist, tip);
  const pipDist = distance(wrist, pip);
  return clamp((tipDist - pipDist) / 0.08, 0, 1);
};

const getThumbExtendedScore = (landmarks: Landmark[]) => {
  const wrist = landmarks[0];
  const tip = landmarks[4];
  const ip = landmarks[3];
  if (!wrist || !tip || !ip) return 0;
  const tipDist = distance(wrist, tip);
  const ipDist = distance(wrist, ip);
  return clamp((tipDist - ipDist) / 0.08, 0, 1);
};

const average = (values: number[]) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const orbitCamera = (graphRef: React.MutableRefObject<any>, deltaX: number, deltaY: number) => {
  const graph = graphRef.current;
  const camera = graph?.camera?.();
  const controls = graph?.controls?.();
  if (!camera || !controls?.target) return;

  const target = new THREE.Vector3(controls.target.x, controls.target.y, controls.target.z);
  const offset = new THREE.Vector3().subVectors(camera.position, target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  const speed = 2.2;

  spherical.theta -= deltaX * speed;
  spherical.phi = clamp(spherical.phi - deltaY * speed, 0.15, Math.PI - 0.15);

  const nextOffset = new THREE.Vector3().setFromSpherical(spherical);
  camera.position.copy(target.clone().add(nextOffset));
  camera.lookAt(target);
  controls.update?.();
};

const panCamera = (graphRef: React.MutableRefObject<any>, deltaX: number, deltaY: number) => {
  const graph = graphRef.current;
  const camera = graph?.camera?.();
  const controls = graph?.controls?.();
  if (!camera || !controls?.target) return;

  const target = new THREE.Vector3(controls.target.x, controls.target.y, controls.target.z);
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
  const up = camera.up.clone().normalize();
  const distanceToTarget = camera.position.distanceTo(target);
  const panScale = Math.max(0.2, distanceToTarget * 0.9);
  const panVector = new THREE.Vector3()
    .addScaledVector(right, -deltaX * panScale)
    .addScaledVector(up, deltaY * panScale);

  camera.position.add(panVector);
  target.add(panVector);
  controls.target.set(target.x, target.y, target.z);
  camera.lookAt(target);
  controls.update?.();
};

const zoomCamera = (graphRef: React.MutableRefObject<any>, distanceDelta: number) => {
  const graph = graphRef.current;
  const camera = graph?.camera?.();
  const controls = graph?.controls?.();
  if (!camera || !controls?.target) return;

  const target = new THREE.Vector3(controls.target.x, controls.target.y, controls.target.z);
  const offset = new THREE.Vector3().subVectors(camera.position, target);
  const currentDistance = offset.length();
  if (!currentDistance) return;

  const factor = clamp(1 + distanceDelta * 2.4, 0.85, 1.2);
  const nextDistance = clamp(currentDistance * factor, 35, 2500);
  offset.setLength(nextDistance);
  camera.position.copy(target.clone().add(offset));
  camera.lookAt(target);
  controls.update?.();
};

const normalizePoint = (point: { x: number; y: number }) => ({
  x: clamp(1 - point.x, 0, 1),
  y: clamp(point.y, 0, 1),
});

export default function HandGestureOverlay({
  graphRef,
  getNodeAtScreenPoint,
  onOpenNode,
  onHoverNode,
  onSelectNode,
  onRecenter,
  selectedNodeId,
}: HandGestureOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastHandTextRef = useRef("");
  const historyRef = useRef<Record<string, Record<GestureKey, number[]>>>({});
  const activeActionRef = useRef<ActiveAction | null>(null);
  const cursorHistoryRef = useRef<Array<{ x: number; y: number }>>([]);
  const hoverRef = useRef<any | null>(null);
  const selectDwellRef = useRef<{ nodeId: string; startedAt: number } | null>(null);
  const toggleHoldStartRef = useRef<number | null>(null);
  const recenterHoldStartRef = useRef<number | null>(null);
  const vSignArmedRef = useRef(true);
  const thumbsUpArmedRef = useRef(true);
  const openCooldownUntilRef = useRef(0);

  const [status, setStatus] = useState("Initializing hand tracker...");
  const [handText, setHandText] = useState("No hand detected");
  const [mode, setMode] = useState<GestureMode>("Idle");
  const [controlEnabled, setControlEnabled] = useState(true);
  const controlEnabledRef = useRef(controlEnabled);
  const selectedNodeIdRef = useRef<string | null>(selectedNodeId ?? null);
  const callbacksRef = useRef({
    getNodeAtScreenPoint,
    onOpenNode,
    onHoverNode,
    onSelectNode,
    onRecenter,
  });

  useEffect(() => {
    controlEnabledRef.current = controlEnabled;
  }, [controlEnabled]);

  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId ?? null;
  }, [selectedNodeId]);

  useEffect(() => {
    callbacksRef.current = {
      getNodeAtScreenPoint,
      onOpenNode,
      onHoverNode,
      onSelectNode,
      onRecenter,
    };
  }, [getNodeAtScreenPoint, onOpenNode, onHoverNode, onSelectNode, onRecenter]);

  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;

    const setModeIfChanged = (nextMode: GestureMode) => {
      setMode((currentMode) => (currentMode === nextMode ? currentMode : nextMode));
    };

    const updateGestureHistory = (handKey: string, gesture: Record<GestureKey, number>) => {
      if (!historyRef.current[handKey]) {
        historyRef.current[handKey] = {
          openPalm: [],
          pinch: [],
          fist: [],
          point: [],
          thumbsUp: [],
          vSign: [],
        };
      }
      const history = historyRef.current[handKey];
      (Object.keys(history) as GestureKey[]).forEach((key) => {
        history[key].push(gesture[key]);
        if (history[key].length > SMOOTHING_WINDOW) {
          history[key].shift();
        }
      });
      return {
        openPalm: average(history.openPalm),
        pinch: average(history.pinch),
        fist: average(history.fist),
        point: average(history.point),
        thumbsUp: average(history.thumbsUp),
        vSign: average(history.vSign),
      };
    };

    const toParsedHand = (
      landmarks: Landmark[],
      handednessText: string,
      handKey: string,
    ): ParsedHand | null => {
      if (!landmarks?.length) return null;
      const wrist = landmarks[0];
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];
      const pinkyTip = landmarks[20];
      const middleMcp = landmarks[9];
      if (!wrist || !thumbTip || !indexTip || !middleTip || !ringTip || !pinkyTip || !middleMcp) {
        return null;
      }

      const thumb = getThumbExtendedScore(landmarks);
      const index = getFingerExtendedScore(landmarks, 8, 6);
      const middle = getFingerExtendedScore(landmarks, 12, 10);
      const ring = getFingerExtendedScore(landmarks, 16, 14);
      const pinky = getFingerExtendedScore(landmarks, 20, 18);

      const pinchDistance = distance(thumbTip, indexTip);
      const pinch = clamp((PINCH_THRESHOLD - pinchDistance) / 0.05, 0, 1);

      const foldedOthers = average([1 - index, 1 - middle, 1 - ring, 1 - pinky]);
      const thumbVertical = clamp((landmarks[3].y - thumbTip.y) / 0.14, 0, 1);
      const thumbsUp = thumb * foldedOthers * thumbVertical;

      const point = index * (1 - middle) * (1 - ring) * (1 - pinky) * clamp(1.1 - thumb * 0.5, 0, 1);
      const vSign = index * middle * (1 - ring) * (1 - pinky);
      const openPalm = average([thumb, index, middle, ring, pinky]);
      const fist = average([1 - thumb, 1 - index, 1 - middle, 1 - ring, 1 - pinky]);

      const smoothedGesture = updateGestureHistory(handKey, {
        openPalm,
        pinch,
        fist,
        point,
        thumbsUp,
        vSign,
      });

      return {
        key: handKey,
        landmarks,
        handednessText,
        center: normalizePoint({ x: middleMcp.x, y: middleMcp.y }),
        indexTip: normalizePoint({ x: indexTip.x, y: indexTip.y }),
        pinchCenter: normalizePoint({
          x: (thumbTip.x + indexTip.x) / 2,
          y: (thumbTip.y + indexTip.y) / 2,
        }),
        gesture: smoothedGesture,
      };
    };

    const setHoverNode = (node: any | null) => {
      const prevId = hoverRef.current?.id ?? null;
      const nextId = node?.id ?? null;
      if (prevId === nextId) return;
      hoverRef.current = node;
      callbacksRef.current.onHoverNode?.(node);
    };

    const smoothCursor = (point: { x: number; y: number }) => {
      cursorHistoryRef.current.push(point);
      if (cursorHistoryRef.current.length > SMOOTHING_WINDOW) cursorHistoryRef.current.shift();
      const x = average(cursorHistoryRef.current.map((p) => p.x));
      const y = average(cursorHistoryRef.current.map((p) => p.y));
      return { x, y };
    };

    const clearSelectionTimers = (clearHover = false) => {
      selectDwellRef.current = null;
      if (clearHover) setHoverNode(null);
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
      context.drawImage(video, 0, 0, width, height);

      const result: HandLandmarkerResult = handLandmarker.detectForVideo(video, performance.now());
      const now = performance.now();

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

        const parsedHands = (result.landmarks ?? [])
          .map((landmarks, index) => {
            const handedness = result.handednesses?.[index]?.[0];
            const handednessText = handedness
              ? `${handedness.categoryName} ${(handedness.score ?? 0).toFixed(2)}`
              : `Hand ${index + 1}`;
            const handKey = handedness?.categoryName ?? `hand-${index}`;
            return toParsedHand(landmarks as Landmark[], handednessText, handKey);
          })
          .filter((value): value is ParsedHand => Boolean(value));

        const handKeys = new Set(parsedHands.map((hand) => hand.key));
        Object.keys(historyRef.current).forEach((handKey) => {
          if (!handKeys.has(handKey)) delete historyRef.current[handKey];
        });

        const nextText = parsedHands
          .map((hand) => {
            const entries: string[] = [hand.handednessText];
            if (hand.gesture.pinch > 0.65) entries.push("pinch");
            if (hand.gesture.fist > 0.65) entries.push("fist");
            if (hand.gesture.point > 0.65) entries.push("point");
            if (hand.gesture.vSign > 0.65) entries.push("v-sign");
            if (hand.gesture.thumbsUp > 0.65) entries.push("thumbs-up");
            return entries.join(" / ");
          })
          .join(" | ");

        const normalizedText = nextText || "No hand detected";
        if (normalizedText !== lastHandTextRef.current) {
          lastHandTextRef.current = normalizedText;
          setHandText(normalizedText);
        }

        const strongestVSign = parsedHands.length
          ? parsedHands.reduce((best, hand) => (hand.gesture.vSign > best.gesture.vSign ? hand : best))
          : null;
        if (strongestVSign && strongestVSign.gesture.vSign >= 0.7) {
          if (vSignArmedRef.current) {
            if (toggleHoldStartRef.current === null) toggleHoldStartRef.current = now;
            if (now - toggleHoldStartRef.current >= V_SIGN_HOLD_MS) {
              vSignArmedRef.current = false;
              toggleHoldStartRef.current = null;
              setControlEnabled((value) => {
                const next = !value;
                controlEnabledRef.current = next;
                return next;
              });
              activeActionRef.current = null;
              clearSelectionTimers(true);
            }
          }
        } else {
          toggleHoldStartRef.current = null;
          if (!strongestVSign || strongestVSign.gesture.vSign < 0.4) {
            vSignArmedRef.current = true;
          }
        }

        const strongestThumbsUp = parsedHands.length
          ? parsedHands.reduce((best, hand) =>
              hand.gesture.thumbsUp > best.gesture.thumbsUp ? hand : best,
            )
          : null;
        if (controlEnabledRef.current && strongestThumbsUp && strongestThumbsUp.gesture.thumbsUp >= 0.7) {
          if (thumbsUpArmedRef.current) {
            if (recenterHoldStartRef.current === null) recenterHoldStartRef.current = now;
            if (now - recenterHoldStartRef.current >= THUMBS_UP_HOLD_MS) {
              thumbsUpArmedRef.current = false;
              recenterHoldStartRef.current = null;
              callbacksRef.current.onRecenter?.();
            }
          }
        } else {
          recenterHoldStartRef.current = null;
          if (!strongestThumbsUp || strongestThumbsUp.gesture.thumbsUp < 0.4) {
            thumbsUpArmedRef.current = true;
          }
        }

        if (!controlEnabledRef.current) {
          activeActionRef.current = null;
          clearSelectionTimers(true);
          setModeIfChanged("Idle");
          context.restore();
          animationRef.current = requestAnimationFrame(render);
          return;
        }

        const handsByPinch = [...parsedHands].sort((a, b) => b.gesture.pinch - a.gesture.pinch);
        const pinchHands = handsByPinch.filter((hand) => hand.gesture.pinch >= 0.65);
        const handsByFist = [...parsedHands].sort((a, b) => b.gesture.fist - a.gesture.fist);
        const handsByPoint = [...parsedHands].sort((a, b) => b.gesture.point - a.gesture.point);

        let candidate: ActiveAction | null = null;
        let pointNode: any | null = null;

        if (pinchHands.length >= 2) {
          const first = pinchHands[0];
          const second = pinchHands[1];
          const zoomHandKey = [first.key, second.key].sort().join("+");
          candidate = {
            mode: "Zoom",
            handKey: zoomHandKey,
            startedAt: now,
            activated: false,
            lastDistance: distance(first.pinchCenter, second.pinchCenter),
          };
        } else if (pinchHands.length === 1) {
          candidate = {
            mode: "Orbit",
            handKey: pinchHands[0].key,
            startedAt: now,
            activated: false,
            lastPoint: pinchHands[0].pinchCenter,
          };
        } else if (handsByFist[0] && handsByFist[0].gesture.fist >= 0.68) {
          candidate = {
            mode: "Pan",
            handKey: handsByFist[0].key,
            startedAt: now,
            activated: false,
            lastPoint: handsByFist[0].center,
          };
        } else if (handsByPoint[0] && handsByPoint[0].gesture.point >= 0.65) {
          const cursor = smoothCursor(handsByPoint[0].indexTip);
          const screenX = cursor.x * window.innerWidth;
          const screenY = cursor.y * window.innerHeight;
          pointNode = callbacksRef.current.getNodeAtScreenPoint(screenX, screenY);
          setHoverNode(pointNode);
          candidate = {
            mode: "Select",
            handKey: handsByPoint[0].key,
            startedAt: now,
            activated: false,
            lastPoint: cursor,
          };
        }

        const currentAction = activeActionRef.current;
        if (!candidate) {
          activeActionRef.current = null;
          setModeIfChanged("Idle");
          clearSelectionTimers(true);
          context.restore();
          animationRef.current = requestAnimationFrame(render);
          return;
        }

        if (!currentAction || currentAction.mode !== candidate.mode || currentAction.handKey !== candidate.handKey) {
          activeActionRef.current = candidate;
        }

        const action = activeActionRef.current;
        if (!action) {
          setModeIfChanged("Idle");
          context.restore();
          animationRef.current = requestAnimationFrame(render);
          return;
        }

        if (!action.activated && now - action.startedAt >= ACTIVATION_HOLD_MS) {
          action.activated = true;
        }

        if (!action.activated) {
          if (action.mode === "Select") {
            setModeIfChanged("Select");
          } else {
            setModeIfChanged("Idle");
          }
          if (action.mode !== "Select") {
            clearSelectionTimers(true);
          }
          context.restore();
          animationRef.current = requestAnimationFrame(render);
          return;
        }

        setModeIfChanged(action.mode);
        if (action.mode !== "Select") {
          clearSelectionTimers();
        }

        if (action.mode === "Zoom" && pinchHands.length >= 2) {
          const currentDistance = distance(pinchHands[0].pinchCenter, pinchHands[1].pinchCenter);
          const prevDistance = action.lastDistance ?? currentDistance;
          const delta = currentDistance - prevDistance;
          action.lastDistance = currentDistance;
          if (Math.abs(delta) >= ZOOM_DEAD_ZONE) {
            zoomCamera(graphRef, delta);
          }
        } else if (action.mode === "Orbit" && pinchHands.length === 1) {
          const point = pinchHands[0].pinchCenter;
          const prev = action.lastPoint ?? point;
          const dx = point.x - prev.x;
          const dy = point.y - prev.y;
          action.lastPoint = point;

          const screenX = point.x * window.innerWidth;
          const screenY = point.y * window.innerHeight;
          const hoveredByPinch = callbacksRef.current.getNodeAtScreenPoint(screenX, screenY);
          setHoverNode(hoveredByPinch);
          if (
            hoveredByPinch &&
            selectedNodeIdRef.current &&
            hoveredByPinch.id === selectedNodeIdRef.current &&
            now >= openCooldownUntilRef.current
          ) {
            openCooldownUntilRef.current = now + 900;
            callbacksRef.current.onOpenNode(hoveredByPinch);
            context.restore();
            animationRef.current = requestAnimationFrame(render);
            return;
          }

          if (Math.hypot(dx, dy) >= DEAD_ZONE) {
            orbitCamera(graphRef, dx, dy);
          }
        } else if (action.mode === "Pan" && handsByFist[0]) {
          const point = handsByFist[0].center;
          const prev = action.lastPoint ?? point;
          const dx = point.x - prev.x;
          const dy = point.y - prev.y;
          action.lastPoint = point;
          if (Math.hypot(dx, dy) >= DEAD_ZONE) {
            panCamera(graphRef, dx, dy);
          }
        } else if (action.mode === "Select" && pointNode) {
          const hoveredNodeId = pointNode.id;
          if (!selectDwellRef.current || selectDwellRef.current.nodeId !== hoveredNodeId) {
            selectDwellRef.current = { nodeId: hoveredNodeId, startedAt: now };
          } else if (now - selectDwellRef.current.startedAt >= SELECT_DWELL_MS) {
            callbacksRef.current.onSelectNode?.(pointNode);
            selectDwellRef.current = { nodeId: hoveredNodeId, startedAt: now + 1_000_000 };
          }
        }
      }
      if (!result?.landmarks?.length) {
        activeActionRef.current = null;
        clearSelectionTimers(true);
        setModeIfChanged("Idle");
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
      callbacksRef.current.onHoverNode?.(null);
    };
  }, [graphRef]);

  return (
    <div className="hand-gesture-overlay">
      <div className="hand-gesture-status">{status}</div>
      <div className={`hand-gesture-mode hand-gesture-mode-${mode.toLowerCase()}`}>{mode}</div>
      <canvas ref={canvasRef} className="hand-gesture-canvas" />
      <video ref={videoRef} className="hand-gesture-video-hidden" playsInline muted />
      <div className="hand-gesture-label">
        {handText} | Control: {controlEnabled ? "ON" : "OFF"}
      </div>
    </div>
  );
}
