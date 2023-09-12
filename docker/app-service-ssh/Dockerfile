# enable ssh for debugging
COPY ./docker/app-service-ssh/entrypoint.sh ./
COPY ./docker/app-service-ssh/sshd_config /etc/ssh/
RUN apt-get update \
    && apt-get install -y --no-install-recommends dialog \
    && UCF_FORCE_CONFFOLD=1 apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd \
    && chmod u+x ./entrypoint.sh

EXPOSE 8000 2222
ENTRYPOINT ["./entrypoint.sh"]
