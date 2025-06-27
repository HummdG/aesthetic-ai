
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
from langchain import LLMChain, PromptTemplate
from langchain.chat_models import ChatOpenAI

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

# Prepare LangChain prompt template
template = (
    "You are a professional aesthetic clinician. "
    "Analyze the following base64-encoded image of a face. "
    "Identify visible imperfections (e.g., fine lines, volume loss, asymmetry) "
    "and recommend appropriate filler or Botox treatments with brief justification. "
    "Respond in structured bullet points.\n"
    "Image (base64): {image_data}"
)
prompt = PromptTemplate(input_variables=["image_data"], template=template)

# Initialize the ChatOpenAI model
llm = ChatOpenAI(model_name="o4-mini", temperature=0.2)
chain = LLMChain(llm=llm, prompt=prompt)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Read file and encode
    contents = await file.read()
    base64_str = base64.b64encode(contents).decode("utf-8")

    # Run LLMChain
    analysis = chain.run(image_data=base64_str)

    return AnalysisResponse(analysis=analysis)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)