FROM python:2.7
RUN apt-get update && apt-get install -y netcat
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code
ENV NEO4J_AUTH neo4j:.dgonzalez.
ADD startAPI.sh /code/
#CMD python iloveapi2neo.py
CMD bash ./startAPI.sh
