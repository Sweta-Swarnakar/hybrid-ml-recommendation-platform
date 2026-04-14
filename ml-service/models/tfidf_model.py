from sklearn.feature_extraction.text import TfidfVectorizer

# global vectorizer
vectorizer = TfidfVectorizer(stop_words="english")

def train(corpus):
    """
    Train TF-IDF on corpus and return matrix
    """
    return vectorizer.fit_transform(corpus)