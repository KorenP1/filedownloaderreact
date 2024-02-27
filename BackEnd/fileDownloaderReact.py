# Imports
from flask import Flask, redirect
from requests import get
from os import listdir
import os.path
from subprocess import Popen, PIPE

app = Flask(__name__, static_folder='/FrontEnd')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/index.html')
def full_index():
    return redirect('/', code=301)

@app.route('/files')
def files():
    return ' '.join(listdir('/FrontEnd/files'))

# CHANGE THIS SECTION FOR STATUS FOR EACH PROJECT DEPLOYMENT
@app.route('/api/status')
def status():
    if len(listdir('/FrontEnd/files')) == 0 and not os.path.exists('/tmp/pid'):
        STATUS =  'EMPTY'
    elif os.path.exists('/tmp/pid'):
        STATUS = 'CREATING'
    elif len(listdir('/FrontEnd/files')) > 0 and os.path.exists('/tmp/delete'):
        STATUS = 'DELETING'
    else:
        STATUS = 'READY'
    return STATUS

@app.route('/api/start')
def start():
    if status() != 'EMPTY':
        return 'Busy'
    Popen('cd /FrontEnd/files && /BackEnd/start.sh && rm -f /tmp/pid & echo $! > /tmp/pid', shell=True, stdout=PIPE, stderr=PIPE)
    return 'Starting...'

@app.route('/api/delete')
def delete():
    if status() not in ['READY', 'CREATING']:
        return 'Busy'
    Popen('kill -9 `cat /tmp/pid`', shell=True, stdout=PIPE, stderr=PIPE)
    Popen('rm -f /tmp/pid', shell=True, stdout=PIPE, stderr=PIPE)
    Popen('touch /tmp/delete', shell=True, stdout=PIPE, stderr=PIPE)
    Popen('rm -rf /FrontEnd/files/* && rm -f /tmp/delete &', shell=True, stdout=PIPE, stderr=PIPE)
    return 'Deleting...'

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

def main():
    app.run(host = '0.0.0.0', port = 8080)

if __name__ == '__main__':
    main()
