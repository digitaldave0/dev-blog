---
title: "Building a Local RAG System with Ollama: PDF Indexing, Training, and GUI Search"
date: 2024-10-24
categories: [AI, Machine Learning, Python, RAG, Ollama]
tags: [ollama, rag, pdf-indexing, python, gui, langchain, streamlit]
layout: post
excerpt: >
  Retrieval-Augmented Generation (RAG) is a powerful technique that combines the strengths of large language models with external knowledge sources. In this post, we'll build a complete local RAG system using Ollama, Python, and a few PDFs. You'll learn how to index documents, enhance a model with your data, and create a simple GUI for interactive searching.
---

## What We'll Build

- **Local AI Setup**: Use Ollama to run a language model locally
- **Document Indexing**: Process and index PDF documents for retrieval
- **RAG Pipeline**: Combine retrieval with generation for accurate answers
- **GUI Interface**: A simple web app for querying your knowledge base

## Prerequisites

- Python 3.8+
- Ollama installed (download from [ollama.ai](https://ollama.ai))
- A few PDF documents to index

Install required Python packages:

```bash
pip install langchain ollama streamlit pypdf2 faiss-cpu sentence-transformers
```

## Step 1: Set Up Ollama and Pull a Model

First, install and start Ollama, then pull a small model like Llama 2 7B:

```bash
# Install Ollama (if not already done)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2:7b
```

Test the model:

```bash
ollama run llama2:7b
```

## Step 2: Index PDF Documents

Create a script to load and index your PDFs:

```python
import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

def create_vector_store(pdf_paths):
    """Load PDFs, split text, and create vector store"""

    # Load documents
    documents = []
    for pdf_path in pdf_paths:
        loader = PyPDFLoader(pdf_path)
        documents.extend(loader.load())

    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    texts = text_splitter.split_documents(documents)

    # Create embeddings and vector store
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(texts, embeddings)

    # Save the vector store
    vectorstore.save_local("pdf_index")

    return vectorstore

# Usage
pdf_files = ["document1.pdf", "document2.pdf", "document3.pdf"]
vector_store = create_vector_store(pdf_files)
```

## Step 3: Create the RAG Pipeline

Now build the RAG system that retrieves relevant information and generates answers:

```python
from langchain.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

def setup_rag_system():
    """Set up the complete RAG system"""

    # Load the vector store
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    vectorstore = FAISS.load_local("pdf_index", embeddings)

    # Initialize Ollama LLM
    llm = Ollama(model="llama2:7b")

    # Create RAG chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True
    )

    return qa_chain

# Test the system
rag_system = setup_rag_system()
result = rag_system({"query": "What are the main topics in my documents?"})
print(result["result"])
```

## Step 4: Build a Simple GUI with Streamlit

Create a web interface for easy querying:

```python
import streamlit as st
from rag_system import setup_rag_system

# Initialize the RAG system
@st.cache_resource
def load_rag():
    return setup_rag_system()

rag_chain = load_rag()

# Streamlit UI
st.title("Local RAG PDF Search")
st.write("Ask questions about your indexed PDF documents")

query = st.text_input("Enter your question:")

if query:
    with st.spinner("Searching and generating answer..."):
        result = rag_chain({"query": query})

        st.subheader("Answer:")
        st.write(result["result"])

        st.subheader("Source Documents:")
        for i, doc in enumerate(result["source_documents"]):
            with st.expander(f"Source {i+1}"):
                st.write(doc.page_content)
                st.write(f"**Page:** {doc.metadata.get('page', 'N/A')}")
```

Save this as `app.py` and run with:

```bash
streamlit run app.py
```

## Step 5: Fine-tuning (Optional Enhancement)

While Ollama models are pre-trained, you can fine-tune for your specific domain:

```python
# Create training data from your PDFs
from langchain.prompts import PromptTemplate

def create_training_data(documents):
    """Generate Q&A pairs from documents for fine-tuning"""
    # This is a simplified example
    training_data = []

    for doc in documents:
        # Generate questions and answers based on content
        # In practice, you'd use more sophisticated methods
        pass

    return training_data

# Note: Actual fine-tuning with Ollama requires additional tools
# Consider using tools like Axolotl or Unsloth for local fine-tuning
```

## Usage and Benefits

1. **Run the indexing script** to process your PDFs
2. **Start the Streamlit app** for the GUI
3. **Ask questions** about your documents

**Benefits:**

- **Privacy**: Everything runs locally
- **Cost-effective**: No API calls to external services
- **Customizable**: Fine-tune for specific domains
- **Fast**: Local inference is quick

## Potential Improvements

- Add more document types (DOCX, TXT, etc.)
- Implement conversation memory
- Add document upload functionality to the GUI
- Use larger, more capable models
- Implement proper fine-tuning workflows

This setup gives you a powerful local AI assistant that can answer questions based on your specific documents. Experiment with different models and document collections to see what works best for your use case!
