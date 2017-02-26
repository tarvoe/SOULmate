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

addUser = ("INSERT INTO users (users_fb_id , users_description) VALUES (%s, %s)")

kirjeldus = "Mingi kasutaja"
nimi = "Tarvo"
kasutaja = (nimi, kirjeldus)

cursor.execute(addUser, kasutaja)

cnn.commit()
cursor.close()
cnn.close()

