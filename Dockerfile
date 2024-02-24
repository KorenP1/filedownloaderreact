FROM node:slim as builder
COPY FrontEnd /FrontEnd
WORKDIR /FrontEnd
RUN npm ci
RUN npm run build
FROM python:slim
COPY BackEnd /BackEnd
COPY --from=builder /FrontEnd/build /FrontEnd
RUN pip3 install -r /BackEnd/requirements.txt
ENTRYPOINT []
EXPOSE 8080
CMD ["python3", "/BackEnd/fileDownloaderReact.py"]
