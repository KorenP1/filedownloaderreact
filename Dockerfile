FROM node:slim as builder
COPY FrontEnd /FrontEnd
WORKDIR /FrontEnd
RUN npm clean-install
RUN npm run build

FROM python:slim as production
COPY BackEnd /BackEnd
COPY --from=builder /FrontEnd/build /FrontEnd
RUN pip3 install -r /BackEnd/requirements.txt
RUN chmod 777 -R /BackEnd /FrontEnd

ENTRYPOINT []
EXPOSE 8080
CMD ["python3", "/BackEnd/fileDownloaderReact.py"]