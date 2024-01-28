type Book = {
  coverURL: string;
  title: string;
  description: string;
  published_date: string;
  modified_date: string;
  author: string;
  publisher: string;
  language: string;
};

export type BookStyle = {
  fontFamily: BookFontFamily;
  fontSize: number;
  lineHeight: number;
  marginHorizontal: number;
  marginVertical: number;
};

export type BookFontFamily = "Origin" | "Roboto" | "Montserrat";

export type BookFlow = "paginated" | "scrolled-doc";

export type BookOption = {
  flow: BookFlow;
  resizeOnOrientationChange: boolean;
  spread: "auto" | "none";
};

export default Book;
