/**
 * Shared PDF export via a hidden iframe that loads `/reyzumes/:id?print=true`.
 *
 * Uses the print-mode page (full layout) instead of cloning the zoomed editor.
 * Height is based on real content — not pageCount×297mm — so Safari's forced
 * margins do not create a trailing blank page.
 */

export type PrintReyzumeOptions = {
  reyzumeId: string;
  onReady?: () => void;
  onError?: (message: string) => void;
  /** Called when the job is cancelled (navigate away, replaced by a new print). */
  onCancel?: () => void;
};

/** Cancels any in-flight print job so rapid clicks don't stack iframes. */
let activeCleanup: (() => void) | null = null;

export function printReyzumeViaIframe({
  reyzumeId,
  onReady,
  onError,
  onCancel,
}: PrintReyzumeOptions): () => void {
  // Replace any previous job before starting a new one.
  activeCleanup?.();

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "1024px";
  iframe.style.height = "768px";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.style.zIndex = "-9999";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.src = `/reyzumes/${reyzumeId}?print=true&t=${Date.now()}`;

  let settled = false;
  let outcome: "pending" | "ready" | "error" = "pending";

  const cleanup = (reason: "cancel" | "finish" = "cancel") => {
    if (settled) return;
    settled = true;
    window.removeEventListener("message", handleMessage);
    clearTimeout(timeoutId);
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
    if (activeCleanup === cleanup) {
      activeCleanup = null;
    }
    // Only dismiss loading UI if we never reached ready/error (navigate-away / replaced).
    if (reason === "cancel" && outcome === "pending") {
      onCancel?.();
    }
  };

  const timeoutId = setTimeout(() => {
    outcome = "error";
    cleanup("finish");
    onError?.("Failed to prepare PDF. Please try again.");
  }, 12000);

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    if (
      event.data?.type !== "REYZUME_READY_TO_PRINT" ||
      event.data?.id !== reyzumeId
    ) {
      return;
    }

    clearTimeout(timeoutId);
    window.removeEventListener("message", handleMessage);

    try {
      const iframeDoc = iframe.contentDocument;
      const container =
        iframeDoc?.querySelector<HTMLElement>("[data-pdf-container]") ??
        iframeDoc?.body;

      if (iframeDoc && container) {
        container.style.setProperty("transform", "none", "important");
        container.style.setProperty("max-width", "none", "important");
        // Drop full-page padding so scrollHeight = real content, not N×A4.
        container.style.setProperty("min-height", "0", "important");
        container.style.setProperty("height", "auto", "important");

        void container.offsetHeight; // reflow after clearing min-height

        const contentHeight = Math.max(
          container.scrollHeight,
          container.offsetHeight
        );

        // Size the print document to content only. Rounding up to A4 multiples
        // (or min-height: 297mm) makes Safari emit an extra blank page.
        iframeDoc.documentElement.style.setProperty(
          "height",
          `${contentHeight}px`,
          "important"
        );
        iframeDoc.body.style.setProperty(
          "height",
          `${contentHeight}px`,
          "important"
        );
        iframeDoc.documentElement.style.setProperty(
          "overflow",
          "visible",
          "important"
        );
        iframeDoc.body.style.setProperty("overflow", "visible", "important");
        iframeDoc.documentElement.style.setProperty(
          "min-height",
          "0",
          "important"
        );
        iframeDoc.body.style.setProperty("min-height", "0", "important");
      }

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      outcome = "ready";
      onReady?.();
    } catch (err) {
      console.error("Print error inside iframe:", err);
      outcome = "error";
      onError?.("Failed to open print dialog.");
      cleanup("finish");
      return;
    }

    setTimeout(() => cleanup("finish"), 3000);
  };

  window.addEventListener("message", handleMessage);
  document.body.appendChild(iframe);
  activeCleanup = cleanup;

  return () => cleanup("cancel");
}
