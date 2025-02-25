import py
import pandas as pd
from fastapi import FastAPI

df = pd.read_csv("book_data.csv")

data = []
for index, row in df.iterrows():
    # Append each row as a tuple to the data list
    data.append(
        (
            row["el_grade"],
            row["module_num"],
            row["student_teacher"],
            row["materials"],
            row["copy_num"],
            row["available"],
        )
    )

def grabdata():
    for row in data:
        print(row)

grabdata()


app = FastAPI()

@app.get()
async def getdata():
    return data
