from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import os
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

app = FastAPI(
    title="Aesthetic AI Backend",
    description="FastAPI service for AI-powered aesthetic facial analysis using OpenAI models",
    version="1.0.0"
)

# Allow CORS from frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    analysis: str

# Initialize the ChatOpenAI model for vision
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.2,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Read file and encode
    contents = await file.read()
    base64_str = base64.b64encode(contents).decode("utf-8")

    # Create the prompt text
    prompt_text = (
        "You are a professional aesthetic clinician. "
        "Analyze the following image of a face. "
        "Identify visible imperfections (e.g., fine lines, volume loss, asymmetry) "
        "and recommend appropriate filler or Botox treatments with brief justification. "
        "Respond in structured bullet points."
    )

    try:
        # Create multimodal message for LangChain
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt_text},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_str}"
                    }
                }
            ]
        )
        
        # Use LangChain to invoke the model
        response = await llm.ainvoke([message])
        analysis = response.content
        
        return AnalysisResponse(analysis=analysis)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangChain error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "langchain": "enabled"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)