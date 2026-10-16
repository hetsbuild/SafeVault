import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "../../api";
import { updateUser } from "../../lib/auth";
import { prefetchFaceModels } from "../../lib/faceModels";

type FaceRecognitionProps = {
  mode?: "save" | "verify" | "delete";
  type?: string;
};

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ mode = "save", type }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<string>("Loading face models...");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasFace, setHasFace] = useState<boolean | null>(null);
  const [noFaceRegistered, setNoFaceRegistered] = useState(false);
  const [done, setDone] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const navigate = useNavigate();
  const { id, kind } = useParams();

  // In delete mode the item kind comes from the route (/faceverify/delete/:kind/:id);
  // in verify mode it comes from the "type" prop.
  const plural = mode === "delete" ? kind : type;
  const isFolder = plural === "folders";
  const itemName = isFolder ? "folder" : "note";
  const deletePath = isFolder ? `/deletefolder/${id}` : `/deletenote/${id}`;
  const badKind = mode === "delete" && plural !== "notes" && plural !== "folders";

  const deleteAfterVerify = async () => {
    setStatus("✅ Face matched! Deleting...");
    stopVideo();

    const { data, ok } = await request<{ success: boolean; msg?: string }>(deletePath, {
      method: "DELETE",
    });

    if (ok && data?.success) {
      toast.success(data.msg || `Moved ${itemName} to trash`);
      navigate(`/${plural}`);
    } else {
      setStatus("❌ " + (data?.msg || `Could not delete this ${itemName}`));
      setSubmitting(false);
    }
  };

  const stopVideo = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          /* autoplay may be blocked */
        }
      }
    } catch {
      setCameraError(true);
    }
  }, []);

  useEffect(() => {
    if (badKind) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadModels = async () => {
      // Makes sure the weights are in the HTTP cache before loadFromUri()
      // asks for them, instead of discovering a cold download here.
      await prefetchFaceModels();
      if (cancelled) return;

      setStatus("Loading recognition model...");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition/");
      if (cancelled) return;

      setStatus("Loading face detector...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector/");
      if (cancelled) return;

      setStatus("Loading landmark model...");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68/");
    };

    const run = async () => {
      // Camera permission and the model download happen at the same time
      // instead of one waiting on the other.
      const camera = startVideo();

      try {
        await loadModels();
      } catch {
        if (cancelled) return;
        setStatus("🚫 Error loading face models");
        setLoading(false);
        await camera;
        return;
      }

      await camera;
      if (cancelled) return;

      setLoading(false);
      setStatus("Ready. Look at the camera.");
    };

    run();

    return () => {
      cancelled = true;
      stopVideo();
    };
  }, [startVideo, stopVideo, badKind]);

  useEffect(() => {
    if (mode !== "save") return;
    request<{ hasFace: boolean }>("/profile", {}, false).then(({ data }) => {
      if (data) {
        setHasFace(data.hasFace);
        updateUser({ hasFace: data.hasFace });
      }
    });
  }, [mode]);

  const handleCapture = async () => {
    if (!videoRef.current || submitting || loading) return;

    setSubmitting(true);
    setStatus("Detecting face...");

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatus("❌ No face detected. Make sure your face is well lit and visible.");
        setSubmitting(false);
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      if (mode === "save") {
        const { data, ok } = await request<{ success: boolean; message?: string }>(
          "/saveface",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descriptor }),
          },
          false
        );

        if (ok && data?.success) {
          updateUser({ hasFace: true });
          setHasFace(true);
          setDone(true);
          setStatus("✅ Face registered successfully!");
          toast.success("Face registered!");
          stopVideo();
        } else {
          setStatus("❌ " + (data?.message || "Failed to save face"));
          setSubmitting(false);
        }
      } else {
        const { data } = await request<{
          verified?: boolean;
          success?: boolean;
          message?: string;
        }>(
          "/verifyface",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descriptor }),
          },
          false
        );

        if (data?.verified) {
          if (mode === "delete") {
            await deleteAfterVerify();
            return;
          }
          setStatus("✅ Face matched! Opening...");
          toast.success("Face verified!");
          stopVideo();
          setTimeout(() => navigate(`/${type}/${id}`), 700);
        } else if (data?.message?.includes("No face registered")) {
          stopVideo();
          setNoFaceRegistered(true);
          setStatus("❌ You have not registered your face yet.");
        } else {
          setStatus("❌ Face did not match. Try again.");
          setSubmitting(false);
        }
      }
    } catch {
      setStatus("🚫 Something went wrong. Try again.");
      setSubmitting(false);
    }
  };

  const isSave = mode === "save";
  const isDelete = mode === "delete";
  const title = isSave
    ? hasFace
      ? "Update Face"
      : "Register Face"
    : isDelete
      ? "Verify to Delete"
      : "Verify Face";

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-center space-y-4">
      <div className="text-2xl font-bold text-indigo-600">{title}</div>

      {isSave && hasFace && !done && (
        <p className="text-sm text-green-600 font-medium">
          ✓ A face is already registered on this account. Capturing again will replace it.
        </p>
      )}

      {badKind && (
        <div className="space-y-3">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            🚫 This link is not valid. The item type is missing.
          </p>
          <Link to="/home" className="inline-block text-indigo-600 font-medium underline">
            Back to dashboard →
          </Link>
        </div>
      )}

      <p className="text-gray-500 text-sm">
        {isSave
          ? "Your face is stored securely with your account and is used to unlock private items."
          : isDelete
            ? `Verify your face to move this private ${itemName} to trash.`
            : "Look into the camera to unlock this private item."}
      </p>

      {!noFaceRegistered && !cameraError && !badKind && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width={320}
          height={240}
          className="w-full rounded-xl border-2 border-gray-200 bg-black"
        />
      )}

      {cameraError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          🚫 Unable to access webcam. Allow camera access in your browser and reload this page.
        </p>
      )}

      {!noFaceRegistered && !cameraError && !badKind && (
        <button
          onClick={handleCapture}
          disabled={loading || submitting || done}
          className={`mt-2 px-6 py-2 rounded-lg font-medium text-white transition ${
            loading || submitting || done
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading
            ? "Loading..."
            : submitting
              ? "Processing..."
              : isSave
                ? hasFace
                  ? "Update Face"
                  : "Save Face"
                : isDelete
                  ? "Verify & Delete"
                  : "Verify Face"}
        </button>
      )}

      {noFaceRegistered && (
        <div className="space-y-3">
          <p className="text-sm text-red-500">No face registered for this account.</p>
          <Link to="/facesave" className="inline-block text-indigo-600 font-medium underline">
            Register your face now →
          </Link>
        </div>
      )}

      {done && isSave && (
        <Link
          to="/home"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Go to dashboard
        </Link>
      )}

      {status && <div className="text-sm font-medium text-gray-700">{status}</div>}

      <button
        onClick={() => {
          stopVideo();
          if (isSave) {
            navigate("/home");
          } else {
            navigate(-1);
          }
        }}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        ← Go back
      </button>
    </div>
  );
};

export default FaceRecognition;