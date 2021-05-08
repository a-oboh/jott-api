import { HttpError } from "./httpError";

export  default function paginate(data: [], page: string, limit: string) {
  try {
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());

    let nextPage: number;
    let previousPage: number;

    // index to start the count from
    const startIndex = (pageNum - 1) * limitNum;

    // index to end the count
    const endIndex = pageNum * limitNum;

    const result = data.slice(startIndex, endIndex);

    if (endIndex < data.length) {
      nextPage = pageNum + 1;
    }

    if (startIndex > 0) {
      previousPage = pageNum - 1;
    }

    const paginatedData: data = {
      result: result as [],
      nextPage,
      previousPage,
      limitNum,
    };

    return paginatedData;
  } catch (err) {
    throw new HttpError(err, 500);
  }
}

interface data {
  result: [];
  nextPage: number;
  previousPage: number;
  limitNum: number;
}
