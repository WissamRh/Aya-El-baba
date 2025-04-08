1. create the db:
```
python create_db.py
```
2. run the flask app in /backend
```
python app.py
```
3. create a dummy user to log in 
```
curl -X POST http://localhost:5000/register      -H "Content-Type: application/json"      -d "{\"username\": \"admin\", \"email\": \"admin@example.com\", \"password\": \"admin123\"}"

```

4. navigate to frontend and run it using
```
npm start
```

5. login, the credentials would be username: admin, password: admin123