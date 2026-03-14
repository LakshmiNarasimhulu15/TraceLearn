# TraceLearn

TraceLearn is a full-stack Python code execution and visualization platform designed to help learners understand how Python programs run internally.

It provides:

• Python code editor  
• Step-by-step execution tracing  
• Variable and memory visualization  
• Heap / object style inspection  
• Console output tracking  
• Input handling  
• Math expression visualization  
• Error display with line numbers  
• Thread detection  
• AI generated explanation of code  

The project contains:

Frontend → React + Vite + Tailwind + Monaco Editor  
Backend → Django + Django REST Framework  
AI Engine → Transformers + Torch + BitsAndBytes (4-bit quantization)

---

# Project Structure


tracelearn/
│
├── backend/
│ ├── manage.py
│ ├── requirements.txt
│ ├── accounts/
│ ├── session/
│ ├── execution/
│ ├── ai_engine/
│ ├── core/
│ ├── tracelearn_backend/
│ └── models/
│ └── qwen_coder/ (download model here)
│
├── frontend/
│ ├── package.json
│ ├── src/
│ ├── public/
│ └── ...
│
├── .gitignore
└── README.md


---

# System Requirements

Install the following software before running the project.

• Python 3.x  
• Node.js (v18 or newer recommended)  
• npm  
• Git  

Recommended versions:

Python ≥ 3.10  
Node ≥ 18

---

# Download the Project

## Option 1 — Clone the Repository

Open terminal and run:


git clone https://github.com/LakshmiNarasimhulu15/TraceLearn.git


Then enter the project folder:


cd TraceLearn


---

## Option 2 — Download ZIP

1. Open the repository on GitHub  
2. Click **Code**  
3. Click **Download ZIP**  
4. Extract the ZIP file  
5. Open terminal inside the extracted folder  

---

# Backend Setup

## Step 1 — Move to backend folder


cd backend


---

## Step 2 — Create a virtual environment

Windows:


python -m venv venv


If python command does not work:


py -m venv venv


---

## Step 3 — Activate the virtual environment

Windows PowerShell:


venv\Scripts\Activate.ps1


Windows CMD:


venv\Scripts\activate


After activation your terminal should look like:


(venv) PS ...TraceLearn/backend>


---

## Step 4 — Install backend dependencies


pip install -r requirements.txt


If pip needs update first:


python -m pip install --upgrade pip
pip install -r requirements.txt


Main backend libraries include:

Django  
Django REST Framework  
SimpleJWT  
django-cors-headers  
torch  
transformers  
bitsandbytes  
accelerate  

---

## Step 5 — Run database migrations


python manage.py makemigrations
python manage.py migrate


---

## Step 6 — (Optional) Create admin account


python manage.py createsuperuser


Follow the prompts.

---

## Step 7 — Start backend server


python manage.py runserver


Backend will run at:


http://127.0.0.1:8000


Keep this terminal running.

---

# Frontend Setup

Open a **new terminal**.

---

## Step 1 — Move to frontend folder

From project root:


cd frontend


If currently inside backend:


cd ..
cd frontend


---

## Step 2 — Install frontend dependencies


npm install


Main frontend libraries include:

React  
Vite  
TailwindCSS  
Axios  
React Router DOM  
Lucide React  
Monaco Editor  

---

## Step 3 — Create environment file

Create a file named:


frontend/.env


Add this line:


VITE_API_URL=http://127.0.0.1:8000


---

## Step 4 — Run frontend


npm run dev


Frontend will run at:


http://localhost:5173


or


http://127.0.0.1:5173


Open that URL in browser.

---

# AI Model Setup

TraceLearn uses a **local language model** for generating code explanations.

The backend expects the model folder at:


backend/models/qwen_coder


---

## Step 1 — Create the model directory

Inside backend folder create:


backend/models/qwen_coder


---

## Step 2 — Download the model

Download the required model from HuggingFace or another source and place the files inside:


backend/models/qwen_coder


Typical files may include:


config.json
generation_config.json
model.safetensors
tokenizer.json
tokenizer_config.json
special_tokens_map.json


---

## Step 3 — Verify the path

The backend code loads the model using:


backend/models/qwen_coder


Do not place the model anywhere else unless you change the code.

---

# BitsAndBytes Quantization

TraceLearn automatically loads the model using **4-bit quantization** through BitsAndBytes.

The backend already includes configuration similar to:


load_in_4bit=True
bnb_4bit_quant_type="nf4"
bnb_4bit_compute_dtype=float16


Therefore **no manual quantization command is required**.

When the backend starts, the model loads in quantized mode automatically.

---

# Running the Full Project

You need **two terminals**.

---

## Terminal 1 — Backend


cd backend
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


---

## Terminal 2 — Frontend


cd frontend
npm install
npm run dev


---

Then open:


http://localhost:5173


---

# Re-Running the Project Later

After first setup, next time you only need:

Backend:


cd backend
venv\Scripts\Activate.ps1
python manage.py runserver


Frontend:


cd frontend
npm run dev


---

# Files Not Included in Repository

The repository intentionally does NOT include:

node_modules  
virtual environments  
database file  
.env files  
AI model files  

These must be installed  or created locally.

---

# Troubleshooting

### Python command not found

Try:


py -m venv venv


---

### npm command not found

Install Node.js.

---

### Frontend cannot connect to backend

Check `.env` contains:


VITE_API_URL=http://127.0.0.1:8000

### AI explanation not working

Verify:

• model files exist in `backend/models/qwen_coder`  
• torch is installed  
• transformers is installed  
• bitsandbytes is installed  
• backend server logs show no model loading errors  

