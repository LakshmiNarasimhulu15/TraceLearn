import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "qwen_coder")

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_PATH,
    local_files_only=True
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    quantization_config=bnb_config,
    device_map="auto",
    local_files_only=True
)
model.eval()
def generate_explanation(prompt: str) -> str:
    """
    Generates explanation using local Phi-3 model.
    Fully offline. 4-bit quantized.
    """
    try:
        print("[LLM] Starting inference")
        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=3500
        )

        inputs = {k: v.to(model.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=500,  # Reduced for speed
                temperature=0.6,
                top_p=0.9,
                do_sample=True,
                repetition_penalty=1.1
            )

        decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)

        response = decoded[len(prompt):].strip()
        print(f"[LLM] Generated response length: {len(response)}")
        return response
    except Exception as e:
        print(f"[LLM] Error in generate_explanation: {e}")
        import traceback
        traceback.print_exc()
        return ""