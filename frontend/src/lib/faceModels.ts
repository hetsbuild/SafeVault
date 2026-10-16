const MODEL_FILES = [
  "/models/face_recognition/face_recognition_model-weights_manifest.json",
  "/models/face_recognition/face_recognition_model-shard1",
  "/models/face_recognition/face_recognition_model-shard2",
  "/models/tiny_face_detector/tiny_face_detector_model-weights_manifest.json",
  "/models/tiny_face_detector/tiny_face_detector_model-shard1",
  "/models/face_landmark_68/face_landmark_68_model-weights_manifest.json",
  "/models/face_landmark_68/face_landmark_68_model-shard1",
];

let pending: Promise<void> | null = null;

/**
 * Downloads the ~6.7 MB of face-api.js weights into the HTTP cache.
 *
 * face-api.js has no cache handling of its own, so calling loadFromUri()
 * downloads everything on the first visit and stalls the verify screen.
 * Warming the files up front (ideally while the app is idle) means the
 * later loadFromUri() calls are served from cache instead.
 *
 * "force-cache" reuses an existing entry when present and otherwise fetches
 * and stores, which is what we want even when the dev server replies no-cache.
 */
export function prefetchFaceModels(): Promise<void> {
  if (pending) return pending;

  pending = Promise.all(
    MODEL_FILES.map((file) =>
      fetch(file, { cache: "force-cache" })
        .then((res) => (res.ok ? res.arrayBuffer() : null))
        .catch(() => null)
    )
  ).then(() => undefined);

  return pending;
}

/**
 * Starts warming the models during browser idle time.
 * Safe to call repeatedly; the work only happens once per page load.
 */
export function warmFaceModelsInBackground() {
  const run = () => {
    void prefetchFaceModels();
  };

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }

  const timer = window.setTimeout(run, 1500);
  return () => window.clearTimeout(timer);
}