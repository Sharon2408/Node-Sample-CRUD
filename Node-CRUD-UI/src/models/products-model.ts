export interface Products {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string;
  }

  export interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
  }

  