# Dockerfile
FROM elasticsearch:8.17.2

RUN elasticsearch-plugin install --batch analysis-nori