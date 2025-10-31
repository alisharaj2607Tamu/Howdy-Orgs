import json
import pandas as pd
from sentence_transformers import SentenceTransformer, util
import torch

from rank_bm25 import BM25Okapi



class BM25Helper:
    def __init__(self):
        self.dataset_path = "./data_preprocessing/tamu_organizations_img.json"
        self.data = None
        self.bm25 = None
        self.n = 3

    def load_data(self):
        with open(self.dataset_path, "r") as f:
            self.data = json.load(f)
        return
    
    def store_corpus(self):
        corpus = [item["description"] for item in self.data]
        tokenized_corpus = [doc.lower().split() for doc in corpus]
        self.bm25 = BM25Okapi(tokenized_corpus)
        return
    
    def get_ranks(self, query):
        tokenized_query = query.lower().split()
        top_n = self.bm25.get_top_n(tokenized_query, self.data, n=self.n)
        return top_n
    

class SBERTRecommender:
    def __init__(self):
        self.org_df = None
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.corpus_embeddings = None

    def load_data(self):
        self.org_df = pd.read_csv("./data/Organisations_Master.csv")  
        self.org_df.fillna("", inplace=True)

        corpus = [self.build_weighted_text(row) for _, row in self.org_df.iterrows()]
        self.corpus_embeddings = self.model.encode(corpus, convert_to_tensor=True, normalize_embeddings=True)

    def build_weighted_text(self, row):
        title = ((row['title'] + " ") * 5).strip()
        desc = ((str(row.get('description', '')) + " ") * 3).strip()
        keywords = " ".join([
            str(row.get('Keyword1', '')),
            str(row.get('Keyword2', '')),
            str(row.get('Keyword3', ''))
        ])
        return f"{title} {desc} {keywords}".strip()

    def get_ranked_orgs_by_email(self, email: str):
        user_df = pd.read_csv("./data/Users_Master.csv")
        user_row = user_df[user_df['Email'].str.strip().str.lower() == email.strip().lower()]
        
        if user_row.empty:
            raise ValueError(f"No user with email {email}")

        user = user_row.iloc[0]
        query = f"{user['Interest1']} {user['Interest2']} {user['Interest3']}"

        query_embedding = self.model.encode(query, convert_to_tensor=True, normalize_embeddings=True)
        scores = util.dot_score(query_embedding, self.corpus_embeddings)[0]
        max_score = torch.max(scores).item() if torch.max(scores).item() > 0 else 1
        match_percentages = [round((s.item() / max_score) * 100, 2) for s in scores]

        result = self.org_df.copy()
        result["SBERT_score"] = scores.cpu().numpy()
        result["match_percentage"] = match_percentages

        # ✅ Combine keyword columns into a single list
        result["keywords"] = result[["Keyword1", "Keyword2", "Keyword3"]].values.tolist()

        # ✅ Return relevant fields, including new 'keywords' list
        return result.sort_values(by="SBERT_score", ascending=False).reset_index(drop=True)[
            ["primary_key", "title", "match_percentage", "SBERT_score", "keywords"]
        ]



    # def get_ranked_orgs(self, user_id: int):
    #     user_df = pd.read_csv("./data/Users_Master.csv")

    #     # Find user by ID
    #     user_row = user_df[user_df['ID'] == user_id]
    #     if user_row.empty:
    #         raise ValueError(f"No user with ID {user_id}")
        
    #     user = user_row.iloc[0]
    #     query = f"{user['Interest1']} {user['Interest2']} {user['Interest3']}"

    #     query_embedding = self.model.encode(query, convert_to_tensor=True, normalize_embeddings=True)
    #     scores = util.dot_score(query_embedding, self.corpus_embeddings)[0]
    #     max_score = torch.max(scores).item() if torch.max(scores).item() > 0 else 1
    #     match_percentages = [round((s.item() / max_score) * 100, 2) for s in scores]

    #     result = self.org_df.copy()
    #     result["SBERT_score"] = scores.cpu().numpy()
    #     result["match_percentage"] = match_percentages

    #     return result.sort_values(by="SBERT_score", ascending=False).reset_index(drop=True)[
    #         ["primary_key", "title", "match_percentage", "SBERT_score", "Keyword1", "Keyword2", "Keyword3"]
    #     ]
