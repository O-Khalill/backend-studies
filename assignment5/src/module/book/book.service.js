import { books } from "../../model/books.model.js";
import { db } from "../../DB/connection.db.js";
import { logs } from "../../model/logs.model.js";
export async function createBook() {
  return await db.command({
    create: "books",
    validator: {
      $jsonSchema: {
        required: ["title"],
        properties: { title: { bsonType: "string", minLength: 1 } },
      },
    },
  });
}
export async function insertBook(data) {
  return await books().insertOne(data);
}
export async function insertMultipleBooks(data) {
  return await books().insertMany(data);
}

export async function createTitleIndex() {
  return await books().createIndex({ title: 1 });
}

export async function updateBookYear(title, year) {
  return await books().updateOne({ title }, { $set: { year } });
}
export async function findBookByTitle(title) {
  return await books().findOne({ title });
}

export async function findBooksByYearRange(from, to) {
  return await books()
    .find({ year: { $gte: from, $lte: to } })
    .toArray();
}

export async function findBooksByGenre(genre) {
  return await books().find({ genres: genre }).toArray();
}

export async function skipLimit() {
  return await books().find().sort({ year: -1 }).skip(2).limit(3).toArray();
}
export async function findBooksByYearInt() {
  return await books()
    .find({ year: { $type: "int" } })
    .toArray();
}

export async function findExlucdeHorrorScifi(genre) {
  return await books()
    .find({ genres: { $nin: ["Horro", "Science Fiction"] } })
    .toArray();
}
export async function deleteBooksBeforeYear(year) {
  return await books().deleteMany({ year: { $lt: year } });
}

export async function aggregateBooks() {
  return await books()
    .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
    .toArray();
}
export async function aggregateBooksProjected() {
  return await books()
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ])
    .toArray();
}
export async function aggregateBooksUnwindGenres() {
  return await books()
    .aggregate([
      { $unwind: "$genres" },
      { $project: { _id: 0, title: 1, genres: 1 } },
    ])
    .toArray();
}

export async function aggregateLogsWithBooks() {
  return await logs()
    .aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book_details",
        },
      },
      {
        $project: {
          _id: 0,
          action: 1,
          "book_details.title": 1,
          "book_details.author": 1,
          "book_details.year": 1,
        },
      },
    ])
    .toArray();
}
