# Docker Setup Guide

This guide explains how to run the Bookstore Backend using Docker and Docker Compose.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- At least 4GB of available RAM
- Ports 8080 and 3306 available

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f bookstore-api
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes (clean slate):**
   ```bash
   docker-compose down -v
   ```

### Manual Docker Build

1. **Build the Docker image:**
   ```bash
   docker build -t bookstore-api:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name bookstore-api \
     -p 8080:8080 \
     -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/bookstore_db \
     -e SPRING_DATASOURCE_USERNAME=root \
     -e SPRING_DATASOURCE_PASSWORD=yourpassword \
     bookstore-api:latest
   ```

## Docker Compose Services

### MySQL Database
- **Container:** `bookstore-mysql`
- **Port:** 3306
- **Database:** `bookstore_db`
- **Username:** `bookstore_user`
- **Password:** `bookstore_pass`
- **Root Password:** `rootpassword`

### Bookstore API
- **Container:** `bookstore-api`
- **Port:** 8080
- **Health Check:** Available at `/api/books`

## Environment Variables

You can customize the configuration by setting environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | Auto-configured | MySQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | `bookstore_user` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `bookstore_pass` | Database password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Hibernate DDL mode |
| `SPRING_JPA_SHOW_SQL` | `false` | Show SQL queries |
| `JWT_SECRET` | Default secret | JWT signing key |
| `JWT_EXPIRATION` | `86400000` | JWT expiration (ms) |
| `SERVER_PORT` | `8080` | Application port |

## Custom Configuration

### Using Environment File

Create a `.env` file in the project root:

```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=bookstore_db
MYSQL_USER=bookstore_user
MYSQL_PASSWORD=your_db_password
JWT_SECRET=your-secret-key-here
```

Then update `docker-compose.yml` to use these variables.

### Custom Ports

To use different ports, update `docker-compose.yml`:

```yaml
services:
  mysql:
    ports:
      - "3307:3306"  # Change host port
  bookstore-api:
    ports:
      - "8081:8080"  # Change host port
```

## Development Setup

For development with hot reload, use the development compose file:

```bash
# Start only MySQL
docker-compose -f docker-compose.dev.yml up -d

# Run application locally with Maven
mvn spring-boot:run
```

This allows you to:
- Make code changes without rebuilding Docker image
- Use your IDE's debugger
- See immediate changes

## Troubleshooting

### Container won't start

1. **Check logs:**
   ```bash
   docker-compose logs bookstore-api
   ```

2. **Verify MySQL is healthy:**
   ```bash
   docker-compose ps
   ```

3. **Check port availability:**
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Linux/Mac
   lsof -i :8080
   ```

### Database Connection Issues

1. **Wait for MySQL to be ready:**
   ```bash
   docker-compose logs mysql
   ```
   Wait for "ready for connections" message.

2. **Test MySQL connection:**
   ```bash
   docker exec -it bookstore-mysql mysql -u bookstore_user -pbookstore_pass bookstore_db
   ```

3. **Reset database:**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Application Health Check Fails

The health check uses curl. If it fails:

1. **Check if application is running:**
   ```bash
   docker exec bookstore-api ps aux | grep java
   ```

2. **Test endpoint manually:**
   ```bash
   curl http://localhost:8080/api/books
   ```

3. **Disable health check temporarily** in `docker-compose.yml`:
   ```yaml
   bookstore-api:
     # healthcheck:
     #   ...
   ```

## Production Considerations

For production deployment:

1. **Use strong passwords:**
   - Change all default passwords
   - Use secrets management (Docker secrets, Kubernetes secrets, etc.)

2. **Enable SSL:**
   - Configure MySQL SSL
   - Use HTTPS for the API

3. **Resource limits:**
   ```yaml
   services:
     bookstore-api:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 1G
           reservations:
             cpus: '0.5'
             memory: 512M
   ```

4. **Backup strategy:**
   - Regular MySQL backups
   - Volume snapshots

5. **Monitoring:**
   - Add logging aggregation
   - Set up health monitoring
   - Configure alerts

## Useful Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f bookstore-api

# Restart a service
docker-compose restart bookstore-api

# Execute command in container
docker exec -it bookstore-api sh

# View container stats
docker stats

# Clean up everything
docker-compose down -v
docker system prune -a
```

## Network Access

The services communicate on a private Docker network (`bookstore-network`). The API connects to MySQL using the service name `mysql` as the hostname.

To access MySQL from your host machine:
- Host: `localhost`
- Port: `3306`
- User: `bookstore_user` or `root`
- Password: `bookstore_pass` or `rootpassword`

