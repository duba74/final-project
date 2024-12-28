import logging
import os

import psycopg
from dotenv import load_dotenv


load_dotenv()


def query(database, query):
    user = os.getenv(f"{database}_USER")
    password = os.getenv(f"{database}_PASSWORD")
    host = os.getenv(f"{database}_HOST")
    port = os.getenv(f"{database}_PORT")
    dbname = os.getenv(f"{database}_DBNAME")

    connection_url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"

    try:
        with psycopg.connect(connection_url) as connection:
            with connection.cursor() as cursor:
                try:
                    cursor.execute(query)
                    # cursor.fetchone()
                    data = cursor.fetchall()
                    columns = [i[0] for i in cursor.description]
                except ValueError as error:
                    logging.error("Error while querying table", error)

                return data, columns

    except (Exception, psycopg.Error) as error:
        logging.error("Error while connecting to PostgreSQL", error)
