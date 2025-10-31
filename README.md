# Howdy-Orgs

![](frontend/src/components/Images/header.png?raw=true)

Howdy Orgs is a smart recommendation platform that helps Texas A&M students quickly discover student organizations that match their personal interests. With over 1,200 clubs on campus, students often feel overwhelmed navigating traditional lists or keyword-based search tools. Our system simplifies the process by combining two powerful methods: BM25 for keyword relevance ranking and SBERT (Sentence-BERT) for semantic matching. This hybrid approach ensures that students receive both contextually and semantically relevant organization recommendations within seconds of filling out a short interest form.

## Set up
```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run backend APIs
Run these commands on terminal one to get started with the backend apis
```
cd backend
uvicorn apis.main:app --reload --port 8000
```

## Run frontend
Run these commands on terminal one to get started with the frontend. Make sure you have node and npm installed
```
cd frontend
npm -i
npm start
```

## Demo

Link for our demo video: https://www.youtube.com/watch?v=r954naOYDRQ
