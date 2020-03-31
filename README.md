# mongoose-auto-increment [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url]

> Mongoose plugin that auto-increments any ID field on your schema every time a document is saved.

---

> This is the module used by [mongoose-simpledb](https://github.com/codetunnel/mongoose-simpledb) to increment Number IDs. You are perfectly able to use this module by itself if you would like. However, if you're looking to make your life easier when using [mongoose](http://mongoosejs.com/) then I highly recommend you check out simpledb. It's a small wrapper around mongoose but it makes it extremely easy to deal with your models and draws a clear path for how to use mongoose in your application.

## Getting Started

> npm install mongoose-auto-increment

Once you have the plugin installed it is very simple to use. Just get reference to it, initialize it by passing in your
mongoose connection and pass `autoIncrement.plugin` to the `plugin()` function on your schema.

`promisedApi` was added to allow plugin setup to be easier as connections are not always setup synchronously. Therefore your plugin setup
can be deferred to when the autoIncrement api is actually ready. See examples below.

> Note: You only need to initialize MAI once.

````js
import mongoose, { Schema } from 'mongoose';
import { initialize, promisedApi, plugin } from '@znemz/mongoose-auto-increment';

const connection = createConnection("mongodb://localhost/myDatabase");

initialize(connection); // imagine this happens somewhere else async

const bookSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    title: String,
    genre: String,
    publishDate: Date
});

export let Book;

export const BookAsync = promisedApi.then(() => {
  bookSchema.plugin(plugin, 'Book');
  Book = connection.model('Book', bookSchema);
  return Book;
});
````

That's it. Now you can create book entities at will and they will have an `_id` field added of type `Number` and will automatically increment with each new document. Even declaring references is easy, just remember to change the reference property's type to `Number` instead of `ObjectId` if the referenced model is also using the plugin.

````js
const authorSchema = new Schema({
    name: String
});
    
const bookSchema = new Schema({
    author: { type: Number, ref: 'Author' },
    title: String,
    genre: String,
    publishDate: Date
});

promisedApi.then(() => {
  bookSchema.plugin(plugin, 'Book');
  authorSchema.plugin(plugin, 'Author');
});
````

### Want a field other than `_id`?

````js
bookSchema.plugin(autoIncrement.plugin, { model: 'Book', field: 'bookId' });
````

### Want that field to start at a different number than zero or increment by more than one?

````js
bookSchema.plugin(plugin, {
    model: 'Book',
    field: 'bookId',
    startAt: 100,
    incrementBy: 100
});
````

Your first book document would have a `bookId` equal to `100`. Your second book document would have a `bookId` equal to `200`, and so on.

### Want to know the next number coming up?

````js
const Book = connection.model('Book', bookSchema);
Book.nextCount((err, count) => {

    // count === 0 -> true

    const book = new Book();
    book.save((err) => {

        // book._id === 0 -> true

        book.nextCount((err, count) => {

            // count === 1 -> true

        });
    });
});
````

nextCount is both a static method on the model (`Book.nextCount(...)`) and an instance method on the document (`book.nextCount(...)`).

### Want to reset counter back to the start value?

````js
bookSchema.plugin(autoIncrement.plugin, {
    model: 'Book',
    field: 'bookId',
    startAt: 100
});

const Book = connection.model('Book', bookSchema);
const book = new Book();

book.save( (err) => {

    // book._id === 100 -> true

    book.nextCount((err, count) => {

        // count === 101 -> true

        book.resetCount((err, nextCount) => {

            // nextCount === 100 -> true

        });

    });

});
````

[npm-image]: https://img.shields.io/npm/v/@znemz/mongoose-auto-increment.svg
[npm-url]: https://www.npmjs.com/package/mongoose-auto-increment
[travis-image]: https://img.shields.io/travis/nmccready/mongoose-auto-increment.svg
[travis-url]: https://travis-ci.org/nmccready/mongoose-auto-increment
[coveralls-image]: https://coveralls.io/repos/github/nmccready/mongoose-auto-increment/badge.svg
[coveralls-url]: https://coveralls.io/github/nmccready/mongoose-auto-increment?branch=master
