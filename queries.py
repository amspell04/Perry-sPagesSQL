# # here we will need queries that will be used by the backend to grab data
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",  # Use the MySQL service name from Docker Compose
    user="root",
    password="new_password",
    database="perrypages",
)

cursor = conn.cursor()


select_query = """
        SELECT el_grade, module_num, student_teacher, materials, copy_num, available
        FROM books
        WHERE module_num = %s  # Modify this condition to select the specific row
    """
    
    # Here, '12345' is the module_num you want to query; you can replace it with the desired value
cursor.execute(select_query, ("2",))  # Make sure to pass parameters as a tuple

    # Fetch the result (single row)
row = cursor.fetchone()

    # Check if a row was returned
# if row:
#         # Print the row values
#         print(row[0])
#         print(f"module_num: {row[1]}")
#         print(f"student_teacher: {row[2]}")
#         print(f"materials: {row[3]}")
#         print(f"copy_num: {row[4]}")
#         print(f"available: {row[5]}")
# else:
#         print("No matching row found!")


# Close the cursor and connection
cursor.close()
conn.close()

