/**
 * Wait until print layout is actually ready instead of a fixed 1s sleep.
 * Resolves when fonts are ready and [data-pdf-container] has a real height,
 * or when the safety timeout hits (whichever comes first).
 */
export async function waitForPrintLayoutReady(options?: {
  /** Max wait so a hung layout never blocks print forever. */
  timeoutMs?: number;
  containerSelector?: string;
}): Promise<{
  waitedMs: number;
  reason: "layout" | "timeout";
  containerHeight: number;
  fontsReady: boolean;
}> {
  const timeoutMs = options?.timeoutMs ?? 2000;
  const containerSelector = options?.containerSelector ?? "[data-pdf-container]";
  const started = performance.now();

  let fontsReady = false;
  try {
    if (document.fonts?.ready) {
      // Don't let a hung fonts.ready promise block the whole print window.
      await Promise.race([
        document.fonts.ready.then(() => {
          fontsReady = true;
        }),
        new Promise<void>((resolve) =>
          setTimeout(resolve, Math.min(timeoutMs, 1500))
        ),
      ]);
    }
  } catch {
    fontsReady = false;
  }

  const getHeight = () => {
    const el = document.querySelector<HTMLElement>(containerSelector);
    return el ? Math.max(el.scrollHeight, el.offsetHeight) : 0;
  };

  // Two animation frames let the browser commit layout after fonts apply.
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  if (getHeight() > 0) {
    return {
      waitedMs: Math.round(performance.now() - started),
      reason: "layout",
      containerHeight: getHeight(),
      fontsReady,
    };
  }

  // Poll briefly / observe until the builder mounts and sizes itself.
  const result = await new Promise<{
    waitedMs: number;
    reason: "layout" | "timeout";
    containerHeight: number;
    fontsReady: boolean;
  }>((resolve) => {
    let settled = false;
    const finish = (reason: "layout" | "timeout") => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      clearInterval(pollId);
      clearTimeout(timeoutId);
      resolve({
        waitedMs: Math.round(performance.now() - started),
        reason,
        containerHeight: getHeight(),
        fontsReady,
      });
    };

    const observer = new MutationObserver(() => {
      if (getHeight() > 0) finish("layout");
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const pollId = window.setInterval(() => {
      if (getHeight() > 0) finish("layout");
    }, 50);

    const timeoutId = window.setTimeout(() => finish("timeout"), timeoutMs);

    if (getHeight() > 0) finish("layout");
  });

  return result;
}
