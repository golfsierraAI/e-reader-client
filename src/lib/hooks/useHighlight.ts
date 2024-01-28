import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
// slices
import { pushHighlight, popHighlight, updateHighlight } from "slices/book";
import { newSnackbar } from "slices/snackbar";
// utils
import {
  getParagraphCfi,
  clashCfiRange,
  getSelectionPosition,
  compareCfi,
  cfiRangeSpliter,
  getNodefromCfi,
} from "lib/utils/commonUtil";
// styles
import viewerLayout, { contextmenuWidth } from "lib/styles/viewerLayout";
// types
import { RootState } from "slices";
import { BookStyle, BookFlow } from "types/book";
import Page from "types/page";
import Selection from "types/selection";
import Highlight from "types/highlight";

const useHighlight = (
  viewerRef: any,
  setIsContextMenu: React.Dispatch<React.SetStateAction<boolean>>,
  bookStyle: BookStyle,
  bookFlow: BookFlow
) => {
  const dispatch = useDispatch();
  const currentLocation = useSelector<RootState, Page>(
    (state) => state.book.currentLocation
  );
  const highlights = useSelector<RootState, Highlight[]>(
    (state) => state.book.highlights
  );

  const [selection, setSelection] = useState<Selection>({
    update: false,
    x: 0,
    y: 0,
    height: 0,
    cfiRange: "",
    content: "",
  });

  const onSelection = useCallback(
    (cfiRange: string): boolean => {
      if (!viewerRef.current) return false;

      const iframe = viewerRef.current.querySelector("iframe");
      if (!iframe) return false;

      const iframeWin = iframe.contentWindow;
      if (!iframeWin) return false;

      const filtered = highlights.filter((highlight) =>
        clashCfiRange(highlight.cfiRange, cfiRange)
      );

      if (filtered.length > 0) {
        dispatch(
          newSnackbar({
            text: "There are already registered highlights in your selection.",
            type: "WARNING",
          })
        );

        iframeWin.getSelection().removeAllRanges();
        return false;
      }

      const position = getSelectionPosition(
        viewerRef.current,
        bookStyle,
        bookFlow,
        viewerLayout.MIN_VIEWER_WIDTH,
        viewerLayout.MIN_VIEWER_HEIGHT,
        viewerLayout.VIEWER_HEADER_HEIGHT,
        contextmenuWidth
      );
      if (!position) return false;

      const { x, y, height } = position;

      const content = iframeWin.getSelection().toString().trim();

      if (content.length === 0) return false;

      setSelection({
        update: false,
        x,
        y,
        height,
        cfiRange,
        content,
      });

      return true;
    },
    [dispatch, viewerRef, highlights, bookFlow, bookStyle, setSelection]
  );

  const onClickHighlight = useCallback(
    (highlightNode: HTMLElement) => {
      const targetNode = highlightNode.parentElement;
      if (!targetNode) return;

      const cfiRange = targetNode.dataset.epubcfi;
      if (!cfiRange) return;

      const { x, y, width, height } = targetNode.getBoundingClientRect();

      setSelection({
        update: true,
        x: x + width / 2 - contextmenuWidth / 2,
        y: y + height,
        height,
        cfiRange,
        content: "",
      });
    },
    [setSelection]
  );

  const onAddHighlight = useCallback(
    (color: string) => {
      const paragraphCfi = getParagraphCfi(selection.cfiRange);
      if (!paragraphCfi) return;

      const highlight: Highlight = {
        key: paragraphCfi + selection.cfiRange,
        accessTime: new Date().toISOString(),
        createTime: new Date().toISOString(),
        color,
        paragraphCfi,
        cfiRange: selection.cfiRange,
        chpaterName: currentLocation.chapterName,
        pageNum: currentLocation.currentPage,
        content: selection.content,
      };

      dispatch(pushHighlight(highlight));

      setSelection({ ...selection, update: true });
    },
    [dispatch, selection, currentLocation]
  );

  const onUpdateHighlight = useCallback(
    (highlight: Highlight | null, color: string) => {
      if (!highlight) return;

      dispatch(
        updateHighlight({
          ...highlight,
          color,
        })
      );
    },
    [dispatch]
  );

  const onRemoveHighlight = useCallback(
    (key: string, cfiRange: string) => {
      if (!viewerRef.current || !key) return;

      dispatch(popHighlight(key));

      dispatch(
        newSnackbar({
          text: "The highlight removed successful!",
          type: "INFO",
        })
      );

      viewerRef.current.offHighlight(cfiRange);
    },
    [dispatch, viewerRef]
  );

  useEffect(() => {
    if (!viewerRef.current) return;

    const iframe = viewerRef.current.querySelector("iframe");
    if (!iframe) return;

    const iframeWin = iframe.contentWindow;
    if (!iframeWin) return;

    highlights.forEach((highlight) => {
      const cfiRange = cfiRangeSpliter(highlight.cfiRange);
      if (!cfiRange) return;

      const { startCfi } = cfiRange;

      if (
        compareCfi(currentLocation.startCfi, startCfi) < 1 &&
        compareCfi(currentLocation.endCfi, startCfi) > -1
      ) {
        const node = getNodefromCfi(highlight.paragraphCfi);
        if (!node) return;

        viewerRef.current.onHighlight(
          highlight.cfiRange,
          (e: any) => {
            onClickHighlight(e.target);
            setIsContextMenu(true);
          },
          highlight.color
        );

        iframeWin.getSelection().removeAllRanges();
      }
    });
  }, [
    dispatch,
    viewerRef,
    currentLocation,
    highlights,
    onRemoveHighlight,
    onClickHighlight,
    setIsContextMenu,
  ]);

  return {
    selection,
    onSelection,
    onClickHighlight,
    onAddHighlight,
    onRemoveHighlight,
    onUpdateHighlight,
  };
};

export default useHighlight;
