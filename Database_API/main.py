# #   # Import required modules
# # import dotenv
# # import os
# # import mysql.connector
# # from fastapi import FastAPI, HTTPException, status, Request
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.encoders import jsonable_encoder
# # from mysql.connector import errorcode
# # import jwt

# # # Loading the environment variables
# # dotenv.load_dotenv()

# # # Initialize the todoapi app
# # app = FastAPI()

# # # Define the allowed origins for CORS
# # origins = [
# #     "http://localhost:8080",
# #     "http://127.0.0.1:8080",
# # ]

# # # Add CORS middleware
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=origins,
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # Connect to the MySQL database
# # try:
# #     cnx = mysql.connector.connect(
# #         user=os.environ['MYSQL_USER'],
# #         password=os.environ['MYSQL_PASSWORD'],
# #         host=os.environ['MYSQL_HOST'],
# #         database=os.environ['MYSQL_DB'],
# #     )
# #     cursor = cnx.cursor()
# # except mysql.connector.Error as err:
# #     if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
# #         print("Something is wrong with your user name or password")
# #     elif err.errno == errorcode.ER_BAD_DB_ERROR:
# #         print("Database does not exist")
# #     else:
# #         print(err)

# # # Define the authentication middleware
# # async def authenticate(request: Request):
# #     try:
# #         api_key = request.headers.get('authorization').replace("Bearer ", "")
# #         cursor.execute("SELECT * FROM voters WHERE voter_id = %s", (api_key,))
# #         if api_key not in [row[0] for row in cursor.fetchall()]:
# #             raise HTTPException(
# #                 status_code=status.HTTP_401_UNAUTHORIZED,
# #                 detail="Forbidden"
# #             )
# #     except:
# #         raise HTTPException(
# #             status_code=status.HTTP_401_UNAUTHORIZED,
# #             detail="Forbidden"
# #         )

# # # Define the POST endpoint for login
# # @app.get("/login")
# # async def login(request: Request, voter_id: str, password: str):
# #     await authenticate(request)
# #     role = await get_role(voter_id, password)

# #     # Assuming authentication is successful, generate a token
# #     token = jwt.encode({'password': password, 'voter_id': voter_id, 'role': role}, os.environ['SECRET_KEY'], algorithm='HS256')

# #     return {'token': token, 'role': role}

# # # Replace 'admin' with the actual role based on authentication
# # async def get_role(voter_id, password):
# #     try:
# #         cursor.execute("SELECT role FROM voters WHERE voter_id = %s AND password = %s", (voter_id, password,))
# #         role = cursor.fetchone()
# #         if role:
# #             return role[0]
# #         else:
# #             raise HTTPException(
# #                 status_code=status.HTTP_401_UNAUTHORIZED,
# #                 detail="Invalid voter id or password"
# #             )
# #     except mysql.connector.Error as err:
# #         print(err)
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail="Database error"
# #         )

# # Import required modules


# import dotenv
# import os
# import mysql.connector
# from fastapi import FastAPI, HTTPException, status, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.encoders import jsonable_encoder
# from mysql.connector import errorcode
# import jwt

# # Loading the environment variables
# dotenv.load_dotenv()

# # Initialize the FastAPI app
# app = FastAPI()

# # Define the allowed origins for CORS
# origins = [
#     "http://localhost:8080",
#     "http://127.0.0.1:8080",
# ]

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Connect to the MySQL database
# try:
#     cnx = mysql.connector.connect(
#         user=os.getenv('MYSQL_USER'),
#         password=os.getenv('MYSQL_PASSWORD'),
#         host=os.getenv('MYSQL_HOST'),
#         database=os.getenv('MYSQL_DB'),
#     )
#     cursor = cnx.cursor(buffered=True)
#     print("Database exist")
# except mysql.connector.Error as err:
#     if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
#         print("Something is wrong with your username or password")
#     elif err.errno == errorcode.ER_BAD_DB_ERROR:
#         print("Database does not exist")
#     else:
#         print(err)

# # Define the root endpoint
# @app.get("/")
# async def read_root():
#     return {"message": "Welcome to the Decentralized Voting System API"}

# # Define the authentication middleware
# async def authenticate(request: Request):
#     try:
#         api_key = request.headers.get('authorization')
#         if not api_key:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Missing authorization token"
#             )
#         token = api_key.replace("Bearer ", "")
#         cursor.execute("SELECT * FROM voters WHERE voter_id = %s", (token,))
#         if not cursor.fetchone():
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Forbidden"
#             )
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Forbidden"
#         ) from e

# # Define the POST endpoint for login
# @app.get("/login")
# async def login(voter_id: str, password: str):
#     try:
#         role = await get_role(voter_id, password)
#         # Assuming authentication is successful, generate a token
#         token = jwt.encode(
#             {'voter_id': voter_id, 'role': role},
#             os.getenv('SECRET_KEY'),
#             algorithm='HS256'
#         )
#         return {'token': token, 'role': role}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An error occurred during login"
#         ) from e

# # Helper function to get the role of a user
# async def get_role(voter_id: str, password: str):
#     try:
#         cursor.execute("SELECT role FROM voters WHERE voter_id = %s AND password = %s", (voter_id, password))
#         role = cursor.fetchone()
#         if role:
#             return role[0]
#         else:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid voter id or password"
#             )
#     except mysql.connector.Error as err:
#         print(err)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Database error"
#         )

# # Add a route to test authentication
# @app.get("/secure-data")
# async def secure_data(request: Request):
#     await authenticate(request)
#     return {"message": "Access granted to secure data"}


# #workingggggggggggggggggggggg
# # Import required modules
# import dotenv
# import os
# import mysql.connector
# from fastapi import FastAPI, HTTPException, status, Request, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import jwt
# from jwt import DecodeError, ExpiredSignatureError

# # from flask import Flask, request, jsonify
# # from flask_cors import CORS  # To handle cross-origin requests
# # from pymongo import MongoClient

# # Load environment variables
# dotenv.load_dotenv()

# # Initialize FastAPI app
# app = FastAPI()

# # Define allowed origins for CORS
# origins = [
#     "http://localhost:8080",
#     "http://127.0.0.1:8080",
# ]

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Database Connection
# try:
#     cnx = mysql.connector.connect(
#         user=os.getenv("MYSQL_USER"),
#         password=os.getenv("MYSQL_PASSWORD"),
#         host=os.getenv("MYSQL_HOST"),
#         database=os.getenv("MYSQL_DB"),
#     )
#     cursor = cnx.cursor()
#     print("Database connected successfully.")
# except mysql.connector.Error as err:
#     print(f"Database connection failed: {err}")
#     raise SystemExit(err)

# # JWT Secret Key
# SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")


# # Models
# class LoginRequest(BaseModel):
#     voter_id: str
#     password: str


# # Helper Function to Get Role
# async def get_role(voter_id: str, password: str):
#     try:
#         cursor.execute(
#             "SELECT role FROM voters WHERE voter_id = %s AND password = %s",
#             (voter_id, password),
#         )
#         role = cursor.fetchone()
#         if role:
#             return role[0]
#         else:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid voter ID or password",
#             )
#     except mysql.connector.Error as err:
#         print(err)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Database error",
#         )


# # Authentication Middleware
# async def authenticate(request: Request):
#     auth_header = request.headers.get("Authorization")
#     if not auth_header or not auth_header.startswith("Bearer "):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token"
#         )
#     token = auth_header.replace("Bearer ", "")
#     try:
#         decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         return decoded_token
#     except ExpiredSignatureError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
#         )
#     except DecodeError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
#         )


# # Login Endpoint
# @app.post("/login")
# async def login(data: LoginRequest):
#     try:
#         role = await get_role(data.voter_id, data.password)
#         token = jwt.encode(
#             {"voter_id": data.voter_id, "role": role},
#             SECRET_KEY,
#             algorithm="HS256",
#         )
#         return {"token": token, "role": role}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An error occurred during login",
#         ) from e


# # Secure Endpoint Example
# @app.get("/secure-data")
# async def secure_data(decoded_token=Depends(authenticate)):
#     return {"message": "Access granted", "user": decoded_token}


import dotenv
import os
import mysql.connector
from fastapi import FastAPI, HTTPException, status, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from jwt import DecodeError, ExpiredSignatureError
from pymongo import MongoClient
from typing import List, Dict, Any

# Load environment variables
dotenv.load_dotenv()

# Initialize FastAPI app
app = FastAPI()

origins = ["http://localhost:8080", "http://127.0.0.1:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Only if you're sending cookies or auth headers
    allow_methods=["*"],
    allow_headers=["*"],
)
# MySQL Database Connection
try:
    cnx = mysql.connector.connect(
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        host=os.getenv("MYSQL_HOST"),
        database=os.getenv("MYSQL_DB"),
    )
    cursor = cnx.cursor()
    print("MySQL database connected successfully.")
except mysql.connector.Error as err:
    print(f"MySQL database connection failed: {err}")
    raise SystemExit(err)

# MongoDB Connection
try:
    mongo_client = MongoClient(
        "mongodb+srv://ashishranjan22cse:6oakpTUFx3ahzyKn@cluster0.du3xmsj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    mongo_db = mongo_client["test"]
    mongo_collection = mongo_db["candidateaffidavitanalyses"]
    print("MongoDB connected successfully.")
except Exception as err:
    print(f"MongoDB connection failed: {err}")
    # Not exiting the system as MySQL is still the main database

# JWT Secret Key
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")


# Models
class LoginRequest(BaseModel):
    voter_id: str
    password: str


# Helper Function to Get Role
async def get_role(voter_id: str, password: str):
    try:
        cursor.execute(
            "SELECT role FROM voters WHERE voter_id = %s AND password = %s",
            (voter_id, password),
        )
        role = cursor.fetchone()
        if role:
            return role[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid voter ID or password",
            )
    except mysql.connector.Error as err:
        print(err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )


# Authentication Middleware
async def authenticate(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token"
        )
    token = auth_header.replace("Bearer ", "")
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except DecodeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )


# Login Endpoint
@app.post("/login")
async def login(data: LoginRequest):
    try:
        role = await get_role(data.voter_id, data.password)
        token = jwt.encode(
            {"voter_id": data.voter_id, "role": role},
            SECRET_KEY,
            algorithm="HS256",
        )
        return {"token": token, "role": role}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login",
        ) from e


# Secure Endpoint Example
@app.get("/secure-data")
async def secure_data(decoded_token=Depends(authenticate)):
    return {"message": "Access granted", "user": decoded_token}


# NEW ENDPOINT: Get all items from MongoDB collection without JWT authentication
@app.get("/items", response_model=List[Dict[str, Any]])
async def get_all_items():
    try:
        # Convert MongoDB cursor to list and handle ObjectId serialization
        items = []
        for item in mongo_collection.find():
            # Convert ObjectId to string for JSON serialization
            item["_id"] = str(item["_id"])
            items.append(item)
        return items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve items: {str(e)}",
        )
