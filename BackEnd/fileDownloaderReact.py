# Imports
from flask import Flask, redirect
import os

os.system('rm -f /FrontEnd/files/.gitkeep')

app = Flask(__name__, static_folder='/FrontEnd')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/index.html')
def full_index():
    return redirect('/', code=301)

@app.route('/files')
def files():
    return os.listdir('/FrontEnd/files')

# CHANGE THIS SECTION FOR STATUS FOR EACH PROJECT DEPLOYMENT
@app.route('/api/status')
def status():
    if len(os.listdir('/FrontEnd/files')) == 0 and not os.path.exists('/tmp/pid'):
        STATUS =  'EMPTY'
    elif os.path.exists('/tmp/pid'):
        STATUS = 'CREATING'
    elif len(os.listdir('/FrontEnd/files')) > 0 and os.path.exists('/tmp/delete'):
        STATUS = 'DELETING'
    else:
        STATUS = 'READY'
    return STATUS

@app.route('/api/start')
def start():
    os.system('cd /FrontEnd/files && /BackEnd/start.sh && rm -f /tmp/pid & echo $! > /tmp/pid')
    return 'Starting...'

@app.route('/api/delete')
def delete():
    os.system('kill -9 `cat /tmp/pid`')
    os.system('rm -f /tmp/pid')
    os.system('touch /tmp/delete')
    os.system('rm -rf /FrontEnd/files/* && rm -f /tmp/delete &')
    return 'Deleting...'

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

def main():
    app.run(host = '0.0.0.0', port = 8080)

if __name__ == '__main__':
    main()
