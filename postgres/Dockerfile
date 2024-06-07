# Use the official PostgreSQL image as the base image
FROM postgres:16.3

# Install iproute2
RUN apt-get update && apt-get install -y iproute2

# Copy the PostgreSQL configuration file if you have custom configurations
COPY postgresql.conf /var/lib/postgresql/data/
Copy pg_hba.conf /var/lib/postgresql/data/

# Set the command to start PostgreSQL with the custom configuration
CMD ["postgres", "-c", "config_file=/var/lib/postgresql/data/postgresql.conf"]
