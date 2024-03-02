# File Downloader React + Python

Override the /BackEnd/start.sh file with your own bash script that creates/downloads files to serve.

```bash
docker run --rm -it -p 8080:8080 -v <YOUR_SCRIPT.SH>:/BackEnd/start.sh docker.io/korenp/fileserver
```

Backend With Python-Bash Don't Hate Me
