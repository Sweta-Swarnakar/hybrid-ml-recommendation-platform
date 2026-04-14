from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity
from models.tfidf_model import train

app = FastAPI()


class Book(BaseModel):
    id: str
    description: str
    genre: str


class RecommendRequest(BaseModel):
    book_id: str
    books: list[Book]


@app.get("/")
def root():
    return {"status": "ML service running"}


@app.post("/recommend")
def recommend(data: RecommendRequest):
    # limit input size (performance)
    books = data.books[:200]

    # find target book index
    idx = next((i for i, b in enumerate(books) if b.id == data.book_id), None)

    if idx is None:
        return {"recommendations": []}

    # prepare corpus
    corpus = [b.description or "" for b in books]

    # handle empty data
    if not any(corpus):
        return {"recommendations": []}

    # TF-IDF training
    tfidf_matrix = train(corpus)

    # cosine similarity
    scores = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()

    results = []
    for i, score in enumerate(scores):
        if books[i].id == data.book_id:
            continue

        # boost same genre
        if books[i].genre == books[idx].genre:
            score += 0.5

        results.append((i, score))

    # sort & pick top 5
    results = sorted(results, key=lambda x: x[1], reverse=True)[:5]

    return {
        "recommendations": [books[i].id for i, _ in results]
    }