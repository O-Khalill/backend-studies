import { Router } from "express";
import {
  aggregateBooks,
  aggregateBooksProjected,
  aggregateBooksUnwindGenres,
  aggregateLogsWithBooks,
  createBook,
  createTitleIndex,
  deleteBooksBeforeYear,
  findBookByTitle,
  findBooksByGenre,
  findBooksByYearInt,
  findBooksByYearRange,
  findExlucdeHorrorScifi,
  insertBook,
  insertMultipleBooks,
  skipLimit,
  updateBookYear,
} from "./book.service.js";

export const bookRouter = new Router();

bookRouter.post("", async (req, res) => {
  try {
    const book = await createBook();
    res.status(200).json({ message: book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.post("/index", async (req, res) => {
  try {
    const result = await createTitleIndex();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.post("/insert-book", async (req, res) => {
  try {
    const { title, author, year, genres } = req.body;
    const result = await insertBook({ title, author, year, genres });
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.post("/insert-books", async (req, res) => {
  try {
    const books = req.body;
    const result = await insertMultipleBooks(books);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.patch("/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const { year } = req.body;
    const result = await updateBookYear(title, year);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/title", async (req, res) => {
  try {
    const title = req.query.title;
    const result = await findBookByTitle(title);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/year", async (req, res) => {
  try {
    const from = Number(req.query.from);
    const to = Number(req.query.to);
    const result = await findBooksByYearRange(from, to);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/genre", async (req, res) => {
  try {
    const genre = req.query.genre;
    const result = await findBooksByGenre(genre);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/skip-limit", async (req, res) => {
  try {
    const result = await skipLimit();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

bookRouter.get("/year-int", async (req, res) => {
  try {
    const result = await findBooksByYearInt();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/exclude-genres", async (req, res) => {
  try {
    const result = await findExlucdeHorrorScifi();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.delete("/before-year", async (req, res) => {
  try {
    const year = Number(req.query.year);
    const result = await deleteBooksBeforeYear(year);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/aggregate1", async (req, res) => {
  try {
    const result = await aggregateBooks();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/aggregate2", async (req, res) => {
  try {
    const result = await aggregateBooksProjected();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/aggregate3", async (req, res) => {
  try {
    const result = await aggregateBooksUnwindGenres();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
bookRouter.get("/aggregate4", async (req, res) => {
  try {
    const result = await aggregateLogsWithBooks();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
