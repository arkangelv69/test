FROM python:2.7
RUN apt-get update && apt-get install -y netcat libgeos-dev
WORKDIR /root/code
ADD requirements.txt /root/code/
RUN pip install -r requirements.txt
ADD app/iloveapi.py /root/code/
ADD app/model.py /root/code/
ADD startAPI.sh /root/code/
CMD bash /root/code/startAPI.sh
