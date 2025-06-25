# A2 Execution Engine

## Introduction
The A2 Execution Engine is a monorepo project that consolidates multiple microservices, libraries, and tools into a single repository. This structure facilitates easier management, collaboration, and deployment of services that work together to achieve complex objectives.

---

# Integration & Developer Onboarding Guide

Welcome to the a2_engine integration platform! This section is for integration partners and developers (including the web_app team) to help you quickly onboard, understand the architecture, and connect your services to a2_engine.

## Architecture Overview
- **Monorepo Structure:**
  - `services/`: Microservices (e.g., capability-registry, execution-engine, etc.)
  - `libs/`: Shared libraries and integration clients
  - `k8s/`: Kubernetes deployment manifests
  - `docker-compose.yml`: Local orchestration for all services
- **Integration Layer:**
  - All communication with a2_engine is abstracted via `libs/shared-libraries/src/a2EngineClient.js`.

## Quick Start
### 1. Prerequisites
- Node.js >= 18.x
- Docker & Docker Compose
- Kubernetes (for production/staging)

### 2. Environment Variables
Set the following in your `.env` or deployment environment:
```
A2_ENGINE_BASE_URL=<a2_engine_endpoint>
# Add any required API keys/secrets here
```

### 3. Local Development
```bash
git clone <repo-url>
cd a2_engine
npm install
docker-compose up -d
npm run dev:all
```

## Integration Details
- **Service Layer:** Use `a2EngineClient.js` for all a2_engine API calls. Example:
```js
const { getStatus } = require('libs/shared-libraries/src/a2EngineClient');
const status = await getStatus();
```
- **Mocking:** For local/CI, mock a2_engine responses by overriding methods in `a2EngineClient.js`.
- **Adding Endpoints:**
  - Add new methods to `a2EngineClient.js` for each new endpoint.
  - Document each method with usage and expected responses.

## API Endpoints
| Service            | Endpoint Example                | Method | Description                |
|--------------------|---------------------------------|--------|----------------------------|
| a2_engine          | `/status`                       | GET    | Health/status check        |
| ...                | ...                             | ...    | ...                        |
> **Note:** For a full list, see each service's README or OpenAPI spec (if available).

## Testing & Validation
- **Integration Tests:**
  - Located in each service's `tests/` directory.
  - Run with `npm test` or `npx turbo run test`.
- **Manual Testing:**
  - Use Postman or curl to hit endpoints directly.
- **CI/CD:**
  - All PRs must pass lint, test, and integration checks.

## Troubleshooting
- **Common Issues:**
  - Missing/incorrect environment variables
  - Service not running (check Docker/K8s status)
  - Network/firewall issues
- **Support:**
  - Contact the platform team via Slack or email (add contact info here)

## Contribution & Best Practices
- Write clear, modular code and document all public methods.
- Add/expand tests for all new endpoints and features.
- Keep dependencies up to date and follow the repo’s code style.

## Contact
For integration help or to report issues, contact: [integration-team@yourdomain.com]

---

## Directory Structure
The project is organized into the following main directories:

- **services/**: Contains individual microservices, each with its own source code, tests, Dockerfile, and configuration files.
  - **mgtl-plus/**: Management Goal Translation Layer+ service.
  - **role-registry/**: Role Registry service.
  - **swarm-manager/**: Swarm Manager service.
  - **resource-allocator/**: Resource Allocator service.
  - **execution-engine/**: Execution Engine service.
  - **feedback-engine/**: Feedback Engine service.

- **libs/**: Contains shared libraries and common utilities used across multiple services.
  - **common/**: Common utilities.
  - **shared-libraries/**: Shared libraries.

- **tools/**: Contains scripts and tools for CI/CD, deployment, and monitoring.
  - **ci-scripts/**: Continuous integration scripts.
  - **deployment-scripts/**: Deployment scripts.
  - **monitoring-scripts/**: Monitoring tools.

- **.github/**: Contains GitHub workflows for CI/CD.
  - **workflows/**: CI and CD pipeline definitions.

- **docker-compose.yml**: Orchestrates the multi-container Docker application for the entire project.

- **Makefile**: Provides commands for building, testing, and deploying services.

## Getting Started
To get started with the A2 Execution Engine, follow these steps:

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd a2_engine
   ```

2. **Install Dependencies**
   Each service and library has its own dependencies defined in `package.json`. Navigate to each service or library directory and run:
   ```
   npm install
   ```

3. **Build the Services**
   Use the Makefile to build all services:
   ```
   make build
   ```

4. **Run Tests**
   To run tests for all services, use:
   ```
   make test
   ```

5. **Deploy the Services**
   To deploy the services, use:
   ```
   make deploy
   ```

## Contributing
Contributions are welcome! Please follow the standard Git workflow:
- Create a feature branch.
- Make your changes.
- Submit a pull request for review.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
Thanks to all contributors and the open-source community for their support and inspiration.