# Vdrive Platform - Docker Compose Setup

A comprehensive Docker Compose configuration for running the Vdrive full-stack application locally or in development environments. This includes the React frontend, Java Spring Boot microservices, PostgreSQL database, and Eureka service discovery.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Nginx)                      │
│                        Port 3000:80                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓ /api/ proxy
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway                              │
│                  Spring Boot (8080)                          │
│              Routes to microservices                         │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
           ↓              ↓              ↓
     ┌──────────┐   ┌──────────┐   ┌──────────┐
     │  Eureka  │   │  User    │   │Notif.    │
     │Discovery │   │ Service  │   │Service   │
     │Port 8761 │   │Port 8081 │   │Port 8082 │
     └──────────┘   └────┬─────┘   └──────────┘
                         │
                         ↓
                  ┌──────────────┐
                  │  PostgreSQL  │
                  │   Port 5432  │
                  └──────────────┘
```

## Prerequisites

- **Docker**: v20.10 or later
- **Docker Compose**: v1.29 or later
- **Java 21**: (for building the backend services)
- **Maven**: 3.8 or later (for building the backend services)
- **Node.js**: 21 or later (if building frontend locally without Docker)

## Quick Start

### 1. Clone and Navigate to Project

```bash
cd /path/to/Vdrive\ UI\ Demoe
```

### 2. Build Backend Services

Before running Docker Compose, build all the Java microservices:

```bash
cd vdrive-backend
mvn clean package -DskipTests
cd ..
```

This will create JAR files in the `target/` directory of each service.

### 3. Configure Environment Variables

Copy the example environment file and customize as needed:

```bash
cp .env.example .env
```

Edit `.env` to configure:
- Database credentials
- JWT secret (IMPORTANT: change for production!)
- Service ports
- Email/SMTP settings (for notifications)
- Logging levels

### 4. Start All Services

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d --build
```

### 5. Verify Services

Once all containers are running, verify they're healthy:

```bash
docker-compose ps
```

Expected output should show all services with status `Up` and health checks passing.

## Service Endpoints

Once running, you can access the following services:

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| API Gateway | http://localhost:8080 | 8080 |
| User Service | http://localhost:8081 | 8081 |
| Notification Service | http://localhost:8082 | 8082 |
| Eureka Discovery | http://localhost:8761 | 8761 |
| PostgreSQL | localhost:5432 | 5432 |

### API Gateway Endpoints

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `GET /actuator/health` - Health check
- `GET /actuator/metrics` - Metrics

### Eureka Discovery Console

View all registered microservices:

```
http://localhost:8761
```

## Development Workflow

### Modifying Frontend Code

If you want to develop the frontend with hot-reload:

```bash
cd vdrive-platform
npm install
npm run dev
```

The development server will run on http://localhost:5173 with hot module replacement (HMR).

### Modifying Backend Services

1. Make changes to the service source code
2. Rebuild the specific service:
   ```bash
   cd vdrive-backend/user-service
   mvn clean package -DskipTests
   cd ../..
   ```
3. Restart the service:
   ```bash
   docker-compose up -d user-service
   ```

### Accessing Database

Connect to PostgreSQL directly:

```bash
psql -h localhost -U vdrive -d vdrive_users
# Password: vdrive123 (or from .env file)
```

Or use a database client like pgAdmin:

```bash
docker run -d \
  --name pgadmin \
  --network vdrive-network \
  -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@vdrive.local \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  dpage/pgadmin4
```

Then access pgAdmin at http://localhost:5050

## Stopping Services

Stop all services:

```bash
docker-compose down
```

Stop services and remove volumes (clears database):

```bash
docker-compose down -v
```

## Logs and Debugging

View logs from all services:

```bash
docker-compose logs -f
```

View logs from a specific service:

```bash
docker-compose logs -f user-service
docker-compose logs -f api-gateway
docker-compose logs -f frontend
```

View logs with timestamps:

```bash
docker-compose logs -f --timestamps
```

## Health Checks

The docker-compose configuration includes health checks for all services. View health status:

```bash
docker-compose ps
```

Services with health checks:
- postgres: Checks if database is ready
- discovery-server: Checks Eureka /eureka/apps endpoint
- api-gateway: Checks /actuator/health endpoint
- user-service: Checks /actuator/health endpoint
- notification-service: Checks /actuator/health endpoint
- frontend: Checks HTTP response on port 80

## Environment Variables

### Database Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| POSTGRES_DB | vdrive_users | Database name |
| POSTGRES_USER | vdrive | Database user |
| POSTGRES_PASSWORD | vdrive123 | Database password |
| POSTGRES_PORT | 5432 | PostgreSQL port |

### Service Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| JWT_SECRET | [dev key] | JWT signing secret - CHANGE IN PRODUCTION |
| LOGGING_LEVEL_ROOT | INFO | Root logging level |
| LOGGING_LEVEL_AE_VDRIVE | DEBUG | Application logging level |
| JPA_DDL_AUTO | update | Hibernate DDL behavior |

### Email Configuration (Notification Service)

| Variable | Default | Description |
|----------|---------|-------------|
| SPRING_MAIL_HOST | smtp.gmail.com | SMTP server hostname |
| SPRING_MAIL_PORT | 587 | SMTP server port |
| SPRING_MAIL_USERNAME | (empty) | Email account username |
| SPRING_MAIL_PASSWORD | (empty) | Email account password |

## Production Deployment

### Security Recommendations

1. **JWT Secret**: Generate a strong random JWT secret
   ```bash
   openssl rand -base64 32
   ```

2. **Database Password**: Use a strong, unique password
   ```bash
   openssl rand -base64 24
   ```

3. **Email Credentials**: Use environment-specific credentials, not development passwords

4. **HTTPS**: Use a reverse proxy (nginx, traefik) with SSL/TLS termination

5. **Resource Limits**: Set memory and CPU limits in docker-compose.yml for production

### Example Production Configuration

```yaml
# In docker-compose.yml
services:
  postgres:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Docker Registry

Build and push to your registry:

```bash
docker-compose build --push
# Requires docker login <registry> first
```

## Troubleshooting

### Services failing to start

1. Check logs:
   ```bash
   docker-compose logs -f service-name
   ```

2. Verify ports aren't already in use:
   ```bash
   lsof -i :8080  # Check port 8080
   ```

3. Ensure JAR files are built:
   ```bash
   ls vdrive-backend/*/target/*.jar
   ```

### Database connection errors

1. Verify postgres is healthy:
   ```bash
   docker-compose ps postgres
   ```

2. Check database credentials in .env

3. Ensure services can resolve 'postgres' hostname (they should within the Docker network)

### Frontend not accessible

1. Check frontend container status:
   ```bash
   docker-compose logs frontend
   ```

2. Verify port 3000 is accessible:
   ```bash
   curl http://localhost:3000
   ```

3. Check nginx configuration in `vdrive-platform/nginx.conf`

### API Gateway not routing requests

1. Check if Discovery Server is healthy:
   ```bash
   curl http://localhost:8761
   ```

2. Verify services are registered in Eureka:
   ```bash
   curl http://localhost:8761/eureka/apps
   ```

3. Check API Gateway logs for routing errors

## File Structure

```
Vdrive UI Demoe/
├── docker-compose.yml        # Main docker-compose configuration
├── .env.example              # Example environment variables
├── README.md                 # This file
├── vdrive-backend/
│   ├── discovery-server/
│   │   ├── Dockerfile        # Eureka discovery server container
│   │   ├── pom.xml
│   │   └── src/
│   ├── api-gateway/
│   │   ├── Dockerfile        # API gateway container
│   │   ├── pom.xml
│   │   └── src/
│   ├── user-service/
│   │   ├── Dockerfile        # User service container
│   │   ├── pom.xml
│   │   └── src/
│   ├── notification-service/
│   │   ├── Dockerfile        # Notification service container
│   │   ├── pom.xml
│   │   └── src/
│   ├── service-client/       # Shared Feign client library
│   └── pom.xml               # Parent pom
└── vdrive-platform/
    ├── Dockerfile            # Frontend container
    ├── nginx.conf            # Nginx configuration
    ├── package.json
    ├── vite.config.js
    └── src/
```

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Cloud Eureka](https://spring.io/projects/spring-cloud-netflix)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## Support and Contributions

For issues, feature requests, or contributions, please refer to the project's main repository documentation.

## License

See the main project repository for licensing information.
