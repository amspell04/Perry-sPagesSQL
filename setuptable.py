import mysql.connector

conn = mysql.connector.connect(
    host="localhost",  # Use the MySQL service name from Docker Compose
    user="root",
    password="new_password",
    database="perrypages",
)

cursor = conn.cursor()

cursor.execute(
    """
DROP TABLE IF EXISTS books;
"""
)


# Creating books table
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS books (
        el_grade INT,
        module_num INT NOT NULL,
        student_teacher VARCHAR(255),
        materials VARCHAR(255),
        copy_num INT,
        available BOOL NOT NULL DEFAULT TRUE,
        PRIMARY KEY (el_grade, module_num, student_teacher, materials, copy_num)
    )
"""
)

# Commit the changes
conn.commit()
print("Table 'books' created successfully!")

# Close the cursor and connection
cursor.close()
conn.close()
