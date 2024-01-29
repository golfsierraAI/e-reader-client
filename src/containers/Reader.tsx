import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { ReactEpubViewer } from "react-epub-viewer";
// containers
import Header from "containers/Header";
import Footer from "containers/Footer";
import Nav from "containers/menu/Nav";
import Option from "containers/menu/Option";
import Learning from "containers/menu/Note";
import ContextMenu from "containers/commons/ContextMenu";
import Snackbar from "containers/commons/Snackbar";
// components
import ViewerWrapper from "components/commons/ViewerWrapper";
import LoadingView from "LoadingView";
// slices
import store from "slices";
import { updateBook, updateCurrentPage, updateToc } from "slices/book";
// hooks
import useMenu from "lib/hooks/useMenu";
import useHighlight from "lib/hooks/useHighlight";
// styles
import "lib/styles/readerStyle.css";
import viewerLayout from "lib/styles/viewerLayout";
// types
import { RootState } from "slices";
import { ViewerRef } from "types";
import Book, { BookStyle, BookOption } from "types/book";
import Page from "types/page";
import Toc from "types/toc";
import { useLocation } from "react-router";

const Reader = ({ loadingView }: Props) => {
  const dispatch = useDispatch();
  const bookUrl = useRef(useLocation().state.url);
  const currentLocation = useSelector<RootState, Page>(
    (state) => state.book.currentLocation
  );

  const viewerRef = useRef<ViewerRef | any>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const optionRef = useRef<HTMLDivElement | null>(null);
  const learningRef = useRef<HTMLDivElement | null>(null);

  const [isContextMenu, setIsContextMenu] = useState<boolean>(false);

  const [bookStyle, setBookStyle] = useState<BookStyle>({
    fontFamily: "Montserrat",
    fontSize: 18,
    lineHeight: 1.4,
    marginHorizontal: 15,
    marginVertical: 5,
  });

  const [bookOption, setBookOption] = useState<BookOption>({
    flow: "paginated",
    resizeOnOrientationChange: true,
    spread: "auto",
  });

  const [navControl, onNavToggle] = useMenu(navRef, 300);
  const [optionControl, onOptionToggle, emitEvent] = useMenu(optionRef, 300);
  const [learningControl, onLearningToggle] = useMenu(learningRef, 300);
  const {
    selection,
    onSelection,
    onClickHighlight,
    onAddHighlight,
    onRemoveHighlight,
    onUpdateHighlight,
  } = useHighlight(viewerRef, setIsContextMenu, bookStyle, bookOption.flow);

  const onBookInfoChange = (book: Book) => dispatch(updateBook(book));

  const onLocationChange = (loc: string) => {
    if (!viewerRef.current) return;
    if (currentLocation.currentPage === 0) {
      setBookStyle({ ...bookStyle, marginVertical: 6 });
      setTimeout(() => {
        viewerRef.current.setLocation(loc);
      });
    } else {
      viewerRef.current.setLocation(loc);
    }
  };

  const onPageMove = (type: "PREV" | "NEXT") => {
    const node = viewerRef.current;
    if (!node || !node.prevPage || !node.nextPage) return;

    if (currentLocation.currentPage === 0) {
      setBookStyle({ ...bookStyle, marginVertical: 6 });
      setTimeout(() => {
        type === "PREV" && node.prevPage();
        type === "NEXT" && node.nextPage();
      });
    } else {
      type === "PREV" && node.prevPage();
      type === "NEXT" && node.nextPage();
    }
  };

  const onTocChange = (toc: Toc[]) => dispatch(updateToc(toc));

  const onBookStyleChange = (bookStyle_: BookStyle) => setBookStyle(bookStyle_);

  const onBookOptionChange = (bookOption_: BookOption) =>
    setBookOption(bookOption_);

  const onPageChange = (page: Page) => dispatch(updateCurrentPage(page));

  const onContextMenu = (cfiRange: string) => {
    const result = onSelection(cfiRange);
    setIsContextMenu(result);
  };

  const onContextmMenuRemove = () => setIsContextMenu(false);

  return (
    <>
      <ViewerWrapper>
        <Header
          onNavToggle={onNavToggle}
          onOptionToggle={onOptionToggle}
          onLearningToggle={onLearningToggle}
        />
        <ReactEpubViewer
          url={bookUrl.current}
          viewerLayout={viewerLayout}
          viewerStyle={bookStyle}
          viewerOption={bookOption}
          onBookInfoChange={onBookInfoChange}
          onPageChange={onPageChange}
          onTocChange={onTocChange}
          onSelection={onContextMenu}
          loadingView={loadingView || <LoadingView />}
          ref={viewerRef}
        />
        <Footer
          title={currentLocation.chapterName}
          nowPage={currentLocation.currentPage}
          totalPage={currentLocation.totalPage}
          onPageMove={onPageMove}
        />
      </ViewerWrapper>

      <Nav
        control={navControl}
        onToggle={onNavToggle}
        onLocation={onLocationChange}
        ref={navRef}
      />

      <Option
        control={optionControl}
        bookStyle={bookStyle}
        bookOption={bookOption}
        bookFlow={bookOption.flow}
        onToggle={onOptionToggle}
        emitEvent={emitEvent}
        onBookStyleChange={onBookStyleChange}
        onBookOptionChange={onBookOptionChange}
        ref={optionRef}
      />

      <Learning
        control={learningControl}
        onToggle={onLearningToggle}
        onClickHighlight={onClickHighlight}
        emitEvent={emitEvent}
        viewerRef={viewerRef}
        ref={learningRef}
      />

      <ContextMenu
        active={isContextMenu}
        viewerRef={viewerRef}
        selection={selection}
        onAddHighlight={onAddHighlight}
        onRemoveHighlight={onRemoveHighlight}
        onUpdateHighlight={onUpdateHighlight}
        onContextmMenuRemove={onContextmMenuRemove}
      />

      <Snackbar />
    </>
  );
};

const ReaderWrapper = ({ loadingView }: Props) => {
  return (
    <Provider store={store}>
      <Reader loadingView={loadingView} />
    </Provider>
  );
};

interface Props {
  loadingView?: React.ReactNode;
}
declare global {
  interface Window {
    bookUrl?: any;
  }
}

export default ReaderWrapper;
