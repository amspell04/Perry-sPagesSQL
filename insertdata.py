import mysql.connector
import pandas as pd

conn = mysql.connector.connect(
    host="localhost",  # Use the MySQL service name from Docker Compose
    user="root",
    password="new_password",
    database="perrypages",
)

cursor = conn.cursor()

# Insert data into the table
insert_query = """
    INSERT INTO books (el_grade, module_num, student_teacher, materials, copy_num, available)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

# Read the data from CSV
df = pd.read_csv("book_data.csv")

# Prepare data for batch insertion
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

# Perform the batch insert
cursor.executemany(insert_query, data)

# Commit the transaction
conn.commit()

print("Insert into 'books' successful!")

cursor.close()
conn.close()
