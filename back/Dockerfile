FROM python:2.7
RUN apt-get update && apt-get install -y netcat
WORKDIR /root/code
ADD requirements.txt /root/code/
RUN pip install -r requirements.txt
ADD iloveapi2neo.py /root/code/
ADD startAPI.sh /root/code/
CMD bash /root/code/startAPI.sh
#CMD while true; do sleep 10;done
