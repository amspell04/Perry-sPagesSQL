import pandas as pd
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware

count = 0
df = pd.read_csv("book_data.csv")

def write_csv(df):
    df.to_csv("book_data.csv", index=False)

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


@app.post("/update")
async def update_data(item: dict = Body(...)):
    df = pd.read_csv("book_data.csv")
    try:
        # Assuming you have a unique identifier (e.g., "id")
        index = df[df["el_grade"] == item["el_grade"]].index[0]
        for key, value in item.items():
            df.loc[index, key] = value
        write_csv(df)
        return {"message": "Data updated successfully"}
    except IndexError:
        raise HTTPException(status_code=404, detail="Item not found")