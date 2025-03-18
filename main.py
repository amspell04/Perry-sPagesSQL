import pandas as pd
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uuid  # Import the uuid library

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],  # Allow all methods (including POST)
    allow_headers=["*"],
)


def write_csv(df, filepath):
    df.to_csv(filepath, index=False)

@app.get("/getdata")
async def get_data():
    df = pd.read_csv("book_data.csv")
    data = df[["el_grade", "module_num", "student_teacher", "materials", "copy_num", "available"]].values.tolist()

    modified_data = []
    for row in data:
        modified_row = row[:]  
        if modified_row[5] == 1:
            modified_row[5] = True
        else:
            modified_row[5] = False
        modified_data.append(modified_row)
    return modified_data


@app.get("/getcheckoutlist")
async def get_checkout():
    cf = pd.read_csv("check_data.csv")
    check_data = cf[["check_id", "el_grade", "module_num", "student_teacher", "materials", "num_checked", "classroom"]].values.tolist()

    return check_data

@app.post("/addcheckout")
async def add_checkout(checkout_data: dict = Body(...)):

    df = pd.read_csv("book_data.csv")
    cf = pd.read_csv("check_data.csv")
    
    material = checkout_data["materials"]
    num_checked = checkout_data["num_checked"]
    copynumbertocheck = num_checked

    matching_rows = df[df["materials"] == material]
    if matching_rows.empty:
        raise HTTPException(status_code=404, detail="Material not found")

    total_available = matching_rows["available"].sum()

    if total_available < num_checked:
        raise HTTPException(status_code=400, detail="Insufficient resources")

    # Update available count in book_data.csv

    for index, row in matching_rows.iterrows():
        if copynumbertocheck > 0:
            if row["available"] >= 1:
                df.loc[index, "available"] -= 1
                copynumbertocheck -= 1
        else:
            break
            # else:
        #     raise HTTPException(status_code=400, detail="insufficient resources")

        # WORK HERE BECAUSE IF FIRST ARE CHECKED OUT IN DOT DOES NOT REACH OTHER RESOURCES

    write_csv(df, "book_data.csv")

    # Generate a unique checkout ID
    checkout_id = str(uuid.uuid4())[:4]  

    # Add checkout entry to check_data.csv
    new_checkout = {
        "check_id": checkout_id,
        "el_grade": checkout_data["el_grade"],
        "module_num": checkout_data["module_num"],
        "student_teacher": checkout_data["student_teacher"],
        "materials": material,
        "num_checked": num_checked,
        "classroom": checkout_data["classroom"],
    }
    cf = pd.concat([cf, pd.DataFrame([new_checkout])], ignore_index=True)
    write_csv(cf, "check_data.csv")

    return {"message": "Checkout added successfully", "checkout_id": checkout_id}



@app.post("/addcheckin")
async def add_checkin(checkin_data: dict = Body(...)):

    df = pd.read_csv("book_data.csv")
    cf = pd.read_csv("check_data.csv")
    
    material = checkin_data["materials"]
    num_checked = checkin_data["num_checked"]
    copynumbertocheck = num_checked

    matching_rows = df[df["materials"] == material]
    if matching_rows.empty:
        raise HTTPException(status_code=404, detail="Material not found")

    # Update available count in book_data.csv

    for index, row in matching_rows.iterrows():
        if copynumbertocheck > 0:
            if row["available"] == 0:
                df.loc[index, "available"] += 1
                copynumbertocheck -= 1
        else:
            break
            # else:
        #     raise HTTPException(status_code=400, detail="insufficient resources")

        # WORK HERE BECAUSE IF FIRST ARE CHECKED OUT IN DOT DOES NOT REACH OTHER RESOURCES

    write_csv(df, "book_data.csv")

    if checkin_data["check_id"] not in cf["check_id"].values:
        raise HTTPException(status_code=404, detail="Checkout ID not found")

    # Filter out the row with the specified checkout ID
    cf = cf[cf["check_id"] != checkin_data["check_id"]]

    write_csv(cf, "check_data.csv")
    id = checkin_data["check_id"]
    return {"message": f"Checkout with ID { id } removed successfully"}
