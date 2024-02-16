export type TypeMessage = {
  _id: number;
  author: string;
  message: string;
  timestamp: number;
  token: string;
};

export type TypeMessagePost = {
  data: TypeMessage[];
};