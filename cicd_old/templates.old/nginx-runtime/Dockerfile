# Use the offical nginx (based on debian)
FROM nginx:mainline

ENV STI_SCRIPTS_PATH=/usr/libexec/s2i

# Required for HTTP Basic feature
RUN apt-get update && apt-get install openssl

# Copy our OpenShift s2i scripts over to default location
COPY ./s2i/bin/ /usr/libexec/s2i/

# Expose this variable to OpenShift
LABEL io.openshift.s2i.scripts-url=image:///usr/libexec/s2i

# Copy config from source to container
COPY nginx.conf.template /tmp/

RUN cat /tmp/nginx.conf.template
RUN pwd

# Install Node 10.x
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_8.x  | bash -
RUN apt-get install -y --allow-downgrades nodejs=8.17.0-1nodesource1
RUN node -v
RUN npm -v

# =================================================================================
# Fix up permissions
# ref: https://torstenwalter.de/openshift/nginx/2017/08/04/nginx-on-openshift.html
# - S2I sripts must be executable
# - Make sure nginx can read and write it's working directories.
# - The container dynamically configures nginx on startup
# - The application artifacts live in /tmp
# ---------------------------------------------------------------------------------
RUN chmod -R g+rwx $STI_SCRIPTS_PATH
RUN chmod g+rw /var/cache/nginx \ 
               /var/run \
               /var/log/nginx \
               /etc/nginx/nginx.conf \
               /tmp
# =================================================================================

# Fix up permissions
RUN chmod -R 0777 /tmp /var /run /etc /mnt /usr/libexec/s2i/

# Nginx runs on port 8080 by default
EXPOSE 8080

# Switch to usermode
USER 104

# Run the API using node
# WORKDIR /tmp/app/dist/app/api
# CMD node index.js
