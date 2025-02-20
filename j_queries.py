# # here we will need queries that will be used by the backend to grab data
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
   
"""
)

# Commit the changes
conn.commit()
print("Executed select el_grade successfully")

# Close the cursor and connection
cursor.close()
conn.close()
