from flask import Flask, render_template, request, session, redirect, jsonify, url_for
from bson.json_util import dumps
from flask_pymongo import PyMongo
from datetime import datetime, time
import os

app = Flask(__name__, template_folder = 'templates')
app.secret_key = '105121'
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/store'

mongo = PyMongo(app)

@app.route('/')

def index():
	return render_template("index.html")

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Retrieve form data
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        bdate = request.form.get('bdate')
        gender = request.form.get('gender')

        bdate = datetime.strptime(bdate, "%Y-%m-%d")

        # Check if username or email already exists
        existing_user = mongo.db.users.find_one({'$or': [{'username': username}, {'email': email}]})
        if existing_user:
            # Username or email already exists, handle the error
            return render_template('register.html', error_message='Username or email already taken')
        
        # Perform registration logic and store the user information in the database
        new_user = {
            'username': username,
            'email': email,
            'password': password,
            'cdate' :  datetime.combine(datetime.today(), time.min)
        }

        user_info = {
            'username': username,
            'bdate': bdate,
            'gender' : gender
        }

        mongo.db.users.insert_one(new_user)
        mongo.db.userinfos.insert_one(user_info)

        # Redirect to login page or homepage upon successful registration
        return redirect('/login')
    else:
        return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Retrieve form data
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if username or email already exists
        user = mongo.db.users.find_one({'$and': [{'username': username}, {'password': password}]})
        if user:
            # Authentication successful, store the user session
            session['username'] = username
            return redirect('/dashboard')
        else:
            # Username or email already exists, handle the error
            return render_template('login.html', error_message='Invalid username or password')
        
        # Redirect to homepage upon successful login
        return redirect('/')
    else:
        return render_template('login.html')
    
@app.route('/logout')
def logout():
    # Clear the user session
    session.clear()
    return redirect('/login')

@app.route('/dashboard')
def dashboard():
    # Get the user information from the database
    user_info = mongo.db.userinfos.find_one({'username': session['username']})

    # Retrieve the user's data or use default values if not available
    username = session['username']
    height = user_info.get('height', 0)
    weight = user_info.get('weight', 0)
    bdate = user_info.get('bdate', 0)
    bench = user_info.get('bench', 0)
    squat = user_info.get('squat', 0)
    dl = user_info.get('DL', 0)
    pull = user_info.get('pull', 0)
    age = (datetime.now() - bdate).days // 365
    gender = user_info.get('gender', 'N/A')

    return render_template(
            'dashboard.html', 
            username    = username, 
            height      = height, 
            weight      = weight, 
            age         = age, 
            gender      = gender,
            bench       = bench,
            squat       = squat,
            dl          = dl,
            pull        = pull,
        )

@app.route('/update_user_info', methods=['POST'])
def update_user_info():
    username = session['username']

    try:
        # Retrieve the field name and new value from the request
        field_name = request.form.get('field_name')
        new_value = request.form.get('new_value')
        today = datetime.combine(datetime.today(), time.min)

        if field_name != "height" and not mongo.db.userlogs.find_one({'$and': [{'username': username}, {'date': today}]}):
            user_log = {
                'username' : username,
                'date' : datetime.combine(datetime.today(), time.min),
                field_name : int(new_value)
            }
            mongo.db.userlogs.insert_one(user_log)
        elif field_name != "height":
            mongo.db.userlogs.update_one(
                {'username' : username, 'date': today},
                {'$set': {field_name: int(new_value)}}
            )

        # Update the user information in the database
        result = mongo.db.userinfos.update_one(
            {'username': username},
            {'$set': {field_name: int(new_value)}}
        )

        # Return a success response
        response = {'success': True, 'message': 'User information updated successfully'}
        return jsonify(response), 200
    except Exception as e:
        # Return an error response
        response = {'success': False, 'message': str(e)}
        return jsonify(response), 500

# API endpoint for retrieving user logs information
@app.route('/user_logs', methods=['GET'])
def get_user_logs():
    # Retrieve user logs and weight information from the database or any other source
    username = session['username']
    user_logs = mongo.db.userlogs.find({'username' : username})

    # Create an empty list to store the dictionaries
    data = []

    # Iterate over the cursor and extract the weight and date fields
    for document in user_logs:

        try:
            weight = document['weight']
        except:
            weight = 0
        
        try:
            bench = document['bench']
        except:
            bench = 0

        try:
            squat = document['squat']
        except:
            squat = 0

        try:
            dl = document['DL']
        except:
            dl = 0

        try:
            pull = document['pull']
        except:
            pull = 0
        
        date = document['date'].strftime('%Y-%m-%d')
        
        # Create a dictionary with the weight and date values
        data.append(
            {
                'weight' : weight, 
                'bench' : bench,
                'squat' : squat,
                'dl' : dl,
                'pull' : pull,
                'date' : date
            }
        )

    # Return the JSON response
    return jsonify(data)

@app.route('/add_friend', methods=['GET'])
def add_friend():
    # Get the target name from the query parameters
    target_name = request.args.get('name')

    # Retrieve the current user's username from the session
    current_user = session.get('username')

    # Check if the target user exists
    target_user = mongo.db.users.find_one({'username': target_name})
    if not target_user:
        return jsonify({'message': 'User does not exist'})

    # Check if the current user already has a friend list
    current_user_friends = mongo.db.user_friends.find_one({'username': current_user})
    if current_user_friends:
        # Check if the target user is already in the friend list
        friends_list = current_user_friends['friends']
        for friend in friends_list:
            if friend['username'] == target_name:
                return jsonify({'message': 'User is already in the friend list'})

        # Append the new friend to the existing friend list
        current_user_friends['friends'].append({'username': target_name, 'state': 0})
        mongo.db.user_friends.update_one({'username': current_user}, {'$set': current_user_friends})
    else:
        # Create a new friend list for the current user
        friend_list = [{'username': target_name, 'state': 0}]
        mongo.db.user_friends.insert_one({'username': current_user, 'friends': friend_list})

    return jsonify({'message': 'Friend added successfully'})



if __name__ == '__main__':
    app.run(debug = True)
