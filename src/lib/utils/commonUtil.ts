import { EpubCFI } from "epubjs";
// types
import { BookStyle, BookFlow } from "types/book";

export const timeFormatter = (time: Date): string => {
  const yyyy = time.getFullYear();
  const mm = time.getMonth() + 1;
  const dd = time.getDate();
  const msg = `${yyyy}-${mm}-${dd}`;

  return msg;
};

export const compareCfi = (cfi_1: string, cfi_2: string): number => {
  const epubcfi = new EpubCFI();
  return epubcfi.compare(cfi_1, cfi_2);
};

export const cfiRangeSpliter = (cfiRange: string) => {
  const content = cfiRange.slice(8, -1);
  const [origin, start, end] = content.split(",");

  if (!origin || !start || !end) return null;

  const startCfi = `epubcfi(${origin + start})`;
  const endCfi = `epubcfi(${origin + end})`;
  return { startCfi, endCfi };
};

export const clashCfiRange = (baseCfiRange: string, targetCfiRange: string) => {
  const splitCfi1 = cfiRangeSpliter(baseCfiRange);
  const splitCfi2 = cfiRangeSpliter(targetCfiRange);

  if (!splitCfi1 || !splitCfi2) return null;

  const { startCfi: s1, endCfi: e1 } = splitCfi1;
  const { startCfi: s2, endCfi: e2 } = splitCfi2;

  if (
    (compareCfi(s2, s1) <= 0 && compareCfi(s1, e2) <= 0) ||
    (compareCfi(s2, e1) <= 0 && compareCfi(e1, e2) <= 0) ||
    (compareCfi(s1, s2) <= 0 && compareCfi(e2, e1) <= 0)
  ) {
    return true;
  }
  return false;
};

export const getParagraphCfi = (cfiRange: string) => {
  if (!cfiRange) return;

  const content = cfiRange.slice(8, -1);
  const [origin, start, end] = content.split(",");

  if (!origin || !start || !end) return null;

  const cfi = `epubcfi(${origin})`;
  return cfi;
};

export const getNodefromCfi = (cfi: string): HTMLElement | null => {
  const epubcfi = cfi.slice(8, -1);

  const pureCfi = epubcfi.replace(/\[.*?\]/gi, "");

  const splitCfi = pureCfi.split("!");
  if (splitCfi.length < 1 || splitCfi[1] === "") {
    return null;
  }

  const cfiPath: number[] = splitCfi[1]
    .split("/")
    .slice(2)
    .map((x) => Number(x));

  const iframe = document.querySelector("iframe");
  if (!iframe) return null;

  const iframeBody = iframe.contentWindow && iframe.contentWindow.document.body;
  if (!iframeBody) return null;

  let component: HTMLElement | null = iframeBody;

  for (let idx of cfiPath) {
    const childNodes: any = component && component.childNodes;

    const filtered = [...childNodes].filter(
      (n) => !n.dataset || !n.dataset.bookmark || !n.dataset.highlight
    );
    component = filtered[idx - 1];

    if (!component) {
      component = null;
      break;
    }
  }

  return component;
};

export const getSelectionPosition = (
  viewer: any,
  bookStyle: BookStyle,
  bookFlow: BookFlow,
  MIN_VIEWER_WIDTH: number,
  MIN_VIEWER_HEIGHT: number,
  VIEWER_HEADER_HEIGHT: number,
  CONTEXTMENU_WIDTH: number
): { x: number; y: number; height: number; width: number } | null => {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

  const iframeWidth = viewer.offsetWidth;

  const scrollTop = viewer.querySelector("div").scrollTop;

  const iframe = viewer.querySelector("iframe");
  const selection_ =
    iframe && iframe.contentWindow && iframe.contentWindow.getSelection();
  if (!selection_ || selection_.rangeCount === 0) return null;

  const range = selection_.getRangeAt(0);
  const {
    x: selectionX,
    y: selectionY,
    height: selectionHeight,
    width: selectionWidth,
  } = range.getBoundingClientRect();

  const marginLeft = ~~(
    (((windowWidth - MIN_VIEWER_WIDTH) / 100) * bookStyle.marginHorizontal) /
    2
  );
  const marginTop =
    bookFlow === "scrolled-doc"
      ? 0
      : ~~(
          (((windowHeight - VIEWER_HEADER_HEIGHT - MIN_VIEWER_HEIGHT) / 100) *
            bookStyle.marginVertical) /
          2
        );

  const x = ~~(
    (selectionX % iframeWidth) +
    marginLeft +
    (selectionWidth / 2 - CONTEXTMENU_WIDTH / 2)
  );
  const y = ~~(
    selectionY +
    selectionHeight +
    VIEWER_HEADER_HEIGHT +
    marginTop -
    scrollTop
  );

  return {
    x,
    y,
    height: selectionHeight,
    width: selectionWidth,
  };
};

export function debounce<Params extends any[]>(
  timeout: number,
  func: (...args: Params) => any
): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
