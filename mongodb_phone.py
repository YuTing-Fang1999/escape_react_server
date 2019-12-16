from pymongo import MongoClient
import json

# connect to mongodb server
client = MongoClient(host='localhost', port=27017)
# asign database
db = client.website

phoneLikesNum = {
	'likes': 0,
}

collection = db.phoneLikesNum
result = collection.remove({})
result = collection.insert(phoneLikesNum)