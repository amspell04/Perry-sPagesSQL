import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

df = pd.read_csv("book_data.csv")

data = df[["el_grade", "module_num", "student_teacher", "materials", "copy_num", "available"]].values.tolist()

checkoutlist = ["checkout1", "checkout2", "checkout3", "checkout3", "checkout3", "checkout3"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/getdata")
async def get_data():
    return data

@app.get("/getcheckoutlist")
async def get_checkout():
    return checkoutlist



@app.get("/increasecount{count}")
async def increasecount(currcount: int):
    currcount += 1
    return currcount