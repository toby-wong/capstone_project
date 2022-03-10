from cgi import print_arguments
from ipaddress import collapse_addresses
import pymongo
import sys
from pprint import pprint
from pymongo import MongoClient

# Initialise MongoDB instance
def initDB():
    client = pymongo.MongoClient("mongodb+srv://admin:admin@parkit.wnpku.mongodb.net/parkIT?retryWrites=true&w=majority")
    db = client.parkIT
    return db

# Check if email exists in database
def emailExists(db, email):
    user = db.users.find_one({"email": email})
    if user is None:
        return False
    else:
        return user.ObjectId()

# Check if phone exists in database
def phoneExists(db, phone):
    user = db.users.find_one({"phoneNumber": phone})
    if user is None:
        return False
    else:
        return user.ObjectId()

# Create new user in database 
def newUser(db, user):
    if not emailExists(db, user["email"]):
        db.users.insert_one({
            "email": user["email"], 
            "firstName": user["firstName"],
            "lastName": user["lastName"],
            "password": user["password"],
            "phoneNumber": user["phoneNumber"],
            "username": user["username"],
            "permissions": {
                "consumer": False,
                "provider": False,
                "admin": False
            }
        })
        return True
    else:
        return False # existing user

# Change password for user
def changePassword(db, email, newPassword):
    if userID := emailExists(db, email):
        db.users.update_one({"_id": userID}, {"$set": {"password": newPassword}})
        return True
    else:
        return False

# TODO: test if function works when updating email
# Update details for user
def updateDetails(db, email, newDetails):
    if userID := emailExists(db, email):
        for key in newDetails:
            db.users.update_one({"_id": userID}, {"$set": {key: newDetails[key]}})
        return True
    else:
        return False

# Delete user from database
def deleteUser(db, email):
    if userID := emailExists(db, email):
        db.users.delete_one({"_id": userID})
        return True
    else:
        return False

# Get permissions for user
def getPermissions(db, email):
    if userID := emailExists(db, email):
        user = db.users.find_one({"_id": userID})   
        return user["permissions"]
    else:
        return False

# Update permissions for user
def updatePermissions(db, email, permissions):
    if userID := emailExists(db, email):
        for key in permissions:
            db.users.update_one({"_id": userID}, {"$set": {"permissions"[key]: permissions[key]}})
        return True
    else:
        return False

if __name__ == "__main__":
    db = initDB()
    if db is None:
        print("Error: Database not found")
        sys.exit(1)
    else:
        print('db initialized')
    
    collection = db.users
    pprint(collection)
    pprint(collection.find_one())
    pprint(collection.find_one({"email": "y0unggil0919@gmail.com"}))
    pprint(collection.find_one({"email": "toby@wong.com.au"}))

