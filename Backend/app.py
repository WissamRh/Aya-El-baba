# app.py
from flask import Flask, jsonify, request
from config import Config
from db import db
from flask_cors import CORS

from model.book import Book  
from model.user import User

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app) 

from auth_routes import auth_routes
app.register_blueprint(auth_routes)


@app.route("/books", methods=["POST"])
def add_book():
    data = request.get_json()
    if not data.get("title") or not data.get("author"):
        return jsonify({"error": "Title and author are required"}), 400

    new_book = Book(
        title=data["title"],
        author=data["author"],
        genre=data.get("genre"),
        year_published=data.get("year_published"),
        isbn=data.get("isbn"),
        checked_in=data.get("checked_in", True)
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added", "book_id": new_book.id}), 201

@app.route("/books/<int:book_id>", methods=["PUT"])
def edit_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    data = request.get_json()
    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.genre = data.get("genre", book.genre)
    book.year_published = data.get("year_published", book.year_published)
    book.isbn = data.get("isbn", book.isbn)
    book.checked_in = data.get("checked_in", book.checked_in)

    db.session.commit()
    return jsonify({"message": "Book updated"})

@app.route("/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted"})


@app.route("/books", methods=["GET"])
def list_books():
    books = Book.query.all()
    return jsonify([
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "year_published": book.year_published,
            "isbn": book.isbn,
            "checked_in": book.checked_in
        }
        for book in books
    ])

@app.route("/books/search", methods=["GET"])
def search_books():
    title = request.args.get("title")
    author = request.args.get("author")

    query = Book.query

    if title:
        query = query.filter(Book.title.ilike(f"%{title}%"))
    if author:
        query = query.filter(Book.author.ilike(f"%{author}%"))

    books = query.all()

    results = [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "year_published": book.year_published,
            "isbn": book.isbn,
            "checked_in": book.checked_in
        }
        for book in books
    ]

    return jsonify(results)



@app.route("/books/<int:book_id>/checkout", methods=["POST"])
def checkout_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    if not book.checked_in:
        return jsonify({"error": "Book is already checked out"}), 400

    book.checked_in = False
    db.session.commit()
    return jsonify({"message": f"Book '{book.title}' has been checked out"})


@app.route("/books/<int:book_id>/checkin", methods=["POST"])
def checkin_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    if book.checked_in:
        return jsonify({"error": "Book is already checked in"}), 400

    book.checked_in = True
    db.session.commit()
    return jsonify({"message": f"Book '{book.title}' has been checked in"})

if __name__ == "__main__":

    app.run(debug=True)