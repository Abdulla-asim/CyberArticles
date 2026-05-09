import os
from fastapi import FastAPI, Depends, HTTPException, Header  # type: ignore
from fastapi.responses import StreamingResponse  # type: ignore
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials  # type: ignore
from openai import OpenAI  # type: ignore
from typing import Optional  # type: ignore

app = FastAPI()

GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

@app.get("/api")
def idea(
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard),
    x_api_key: Optional[str] = Header(None)
):
    user_id = creds.decoded["sub"]  # User ID from JWT
    
    # Get API key from header or fall back to env variable
    api_key = x_api_key or os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="No API key provided. Please add your Google Gemini API key in Settings."
        )
    
    try:
        client = OpenAI(base_url=GEMINI_BASE_URL, api_key=api_key)
        prompt = [{"role": "user", "content": "Find latest cybersecurity articles from https://hacker-news.firebaseio.com/v0/topstories and return 1 working url and then a compelling summary, formatted with Headings, sub-headings and bullet points."}]
        stream = client.chat.completions.create(model="gemini-3.1-flash-lite", messages=prompt, stream=True)

        def event_stream():
            for chunk in stream:
                text = chunk.choices[0].delta.content
                if text:
                    lines = text.split("\n")
                    for line in lines[:-1]:
                        yield f"data: {line}\n\n"
                        yield "data:  \n"
                    yield f"data: {lines[-1]}\n\n"

        return StreamingResponse(event_stream(), media_type="text/event-stream")
    except Exception as e:
        error_msg = str(e)
        if "API key" in error_msg or "authentication" in error_msg.lower():
            raise HTTPException(
                status_code=401,
                detail="Invalid API key. Please check your Google Gemini API key in Settings."
            )
        raise HTTPException(status_code=500, detail=f"Error: {error_msg}")
