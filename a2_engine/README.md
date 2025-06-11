# A2 Execution Engine

## Introduction
The A2 Execution Engine is a monorepo project that consolidates multiple microservices, libraries, and tools into a single repository. This structure facilitates easier management, collaboration, and deployment of services that work together to achieve complex objectives.

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