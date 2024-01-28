import * as React from "react";
import Book, { BookOptions } from "epubjs/types/book";
import { RenditionOptions } from "epubjs/types/rendition";
import { Contents, Rendition } from "epubjs";
import Toc from 'types/toc'
import Page from 'types/page'
import ViewerLayout from 'types/viewerLayout'

export interface ViewerRef extends HTMLDivElement {
  prevPage: () => void;
  nextPage: () => void;
  getCurrentCfi: () => string;
  
  onHighlight: (
    cfiRange: string, 
    callback: (e: any) => void,
    color?: string
  ) => void;
  offHighlight: (cfiRange: string) => void;
  setLocation: (location: string) => void;
}
export interface EpubViewerProps {
  url: string;
  epubFileOptions?: BookOptions;
  epubOptions?: RenditionOptions;
  style?: Object;
  location?: string;
  bookChanged?(book: Book): void;
  rendtionChanged?(rendition: Rendition): void;
  pageChanged?(page: Page): void;
  tocChanged?(value: Toc[]): void;
  selectionChanged?(cfiRange: string, contents: Contents): void;
  loadingView?: React.ReactNode;
}

declare class EpubViewer extends React.Component<EpubViewerProps, ViewerRef> {}
export interface ReactViewerProps {
  url: string;
  viewerLayout?: ViewerLayout;
  viewerStyle?: BookStyle;
  viewerOption?: BookOption;
  onBookInfoChange?: (book: BookType) => void;
  onPageChange?: (page: Page) => void;
  onTocChange?: (toc: Toc[]) => void;
  onSelection?: (cfiRange: string, contents: Contents) => void;
  loadingView?: React.ReactNode;
}

declare class ReactEpubViewer extends React.Component<ReactViewerProps, ViewerRef> {}

export { EpubViewer, ReactEpubViewer };