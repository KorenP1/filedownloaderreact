# Imports
from flask import Flask, redirect
import os

app = Flask(__name__, static_folder='/FrontEnd')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/index.html')
def full_index():
    return redirect('/', code=301)

# CHANGE THIS SECTION FOR STATUS FOR EACH PROJECT DEPLOYMENT
@app.route('/status')
def status():
    if os.listdir('/FrontEnd/files') == 1:
        return 'EMPTY'
    return 'READY'

@app.route('/start')
def start():
    os.system('./start.sh & echo $! > /tmp/pid')
    return 'Starting...'

@app.route('/delete')
def delete():
    os.system('kill -9 `cat /tmp/pid`')
    return 'Deleting...'

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

def main():
    app.run(host = '0.0.0.0', port = 8080)

if __name__ == '__main__':
    main()
