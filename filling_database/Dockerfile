FROM python:3.11

WORKDIR /filling_database

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "run_pipeline.py"]