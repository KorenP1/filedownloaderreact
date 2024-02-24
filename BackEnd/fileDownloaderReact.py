# Imports
from flask import Flask, redirect
import os

STATUS = 'READY'

app = Flask(__name__, static_folder='/FrontEnd')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/index.html')
def full_index():
    return redirect('/', code=301)

@app.route('/files')
def files():
    files = os.listdir('/FrontEnd/files')
    files.remove('.gitkeep')
    return files

# CHANGE THIS SECTION FOR STATUS FOR EACH PROJECT DEPLOYMENT
@app.route('/api/status')
def status():
    global STATUS
    if os.path.exists('/tmp/pid'):
        STATUS = 'CREATING'
    elif len(os.listdir('/FrontEnd/files')) > 1:
        STATUS = 'DELETING'
    else:
        STATUS = 'READY'
    return STATUS

@app.route('/api/start')
def start():
    os.system('/BackEnd/start.sh & echo $! > /tmp/pid')
    global STATUS
    STATUS = 'CREATING'
    return 'Starting...'

@app.route('/api/delete')
def delete():
    os.system('kill -9 `cat /tmp/pid`')
    os.system('rm -f /tmp/pid')
    os.system('rm -rf /FrontEnd/files/* &')
    return 'Deleting...'

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

def main():
    app.run(host = '0.0.0.0', port = 8080)

if __name__ == '__main__':
    main()
