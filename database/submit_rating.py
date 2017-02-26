import mysql.connector
from mysql.connector import errorcode

try:
    cnn = mysql.connector.connect(user='tarvo', password='tere',
                                  host='localhost',
                                  database='soulmate')
    print("It works")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Wrong user or pass")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)


cursor = cnn.cursor()

submit_rating = ("INSERT INTO ratings (positive) WHERE id = users_fb_id VALUE (%i)")

rating = 1

cursor.execute(submit_rating, rating)

cnn.commit()
cursor.close()
cnn.close()