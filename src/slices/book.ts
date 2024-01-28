import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// types
import Book from "types/book";
import Page from "types/page";
import Toc from "types/toc";
import Highlight, { Color } from "types/highlight";
// lib
import palette from "lib/styles/palette";

const initialBook: Book = {
  coverURL: "",
  title: "",
  description: "",
  published_date: "",
  modified_date: "",
  author: "",
  publisher: "",
  language: "",
};

const initialCurrentLocation: Page = {
  chapterName: "-",
  currentPage: 0,
  totalPage: 0,
  startCfi: "",
  endCfi: "",
  base: "",
};

const initialColorList: Color[] = [
  { name: "Red", code: palette.red4 },
  { name: "Orange", code: palette.orange4 },
  { name: "Yellow", code: palette.yellow4 },
  { name: "Green", code: palette.green4 },
  { name: "Blue", code: palette.blue4 },
  { name: "Purple", code: palette.purple4 },
];

const initialState: BookState = {
  book: initialBook,
  currentLocation: initialCurrentLocation,
  toc: [],
  highlights: [],
  colorList: initialColorList,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    updateBook(state, action: PayloadAction<Book>) {
      state.book = action.payload;
    },

    updateCurrentPage(state, action: PayloadAction<Page>) {
      state.currentLocation = action.payload;
    },

    clearBook(state) {
      state.book = initialBook;
    },
    updateToc(state, action: PayloadAction<Toc[]>) {
      state.toc = action.payload;
    },
    clearToc(state) {
      state.toc = [];
    },
    pushHighlight(state, action: PayloadAction<Highlight>) {
      const check = state.highlights.filter(
        (h) => h.key === action.payload.key
      );
      if (check.length > 0) return;
      state.highlights.push(action.payload);
    },
    updateHighlight(state, action: PayloadAction<Highlight>) {
      const new_idx = action.payload.key;
      const old_idx = state.highlights.map((h) => h.key).indexOf(new_idx);
      state.highlights.splice(old_idx, 1, action.payload);
    },
    popHighlight(state, action: PayloadAction<string>) {
      const idx = state.highlights.map((h) => h.key).indexOf(action.payload);
      state.highlights.splice(idx, 1);
    },
  },
});

export interface BookState {
  book: Book;
  currentLocation: Page;
  toc: Toc[];
  highlights: Highlight[];
  colorList: Color[];
}

export const {
  updateBook,
  clearBook,
  updateCurrentPage,
  updateToc,
  clearToc,
  pushHighlight,
  updateHighlight,
  popHighlight,
} = bookSlice.actions;

export default bookSlice.reducer;
