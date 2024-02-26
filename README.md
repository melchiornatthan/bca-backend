# BCAPP Back END

## Description

Introducing Memo Automation web application designed to streamline requests for installation, relocation, and dismantling entities that uses VSAT. Whether it's for installation, relocation, or dismantling, this platform automates the entire process. From initiating requests to vendor selection and report generation.

## Documentation

https://hackmd.io/@_ZfqOpYhTCq5xfvPo9Xb8g/ryjsBWeI6

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/melchiornatthan/bca-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd bca-backend
   ```

3. Install the project dependencies:
   ```bash
   npm install
   ```

## Docker

This project is also included with a docker image file. To build the image use this command:

```bash
docker build compose up --build
```

## Usage

1. Start the development server:
   ```bash
   npx nodemon index.js
   ```

2. The development server will run at `http://localhost:3000` by default. You can access the project in your web browser.

## Project Structure

The project structure is organized as follows:

- `index.js`: The main entry point for the application.
- `src/`: This directory contains all the source code for the React application.
  - `controller/`: This directory contains function that connect the router and the service.
  - `database/`: This directory configuration for the database connection in this project.
  - `middlewares/` : This directory will contain the authentication when the user do request to the backend.
  - `models/` : This directory will contain the scheme/table that will be defined, that will be used in this project
  - `router/` : This directory will define the routes that will be exposed through the specified port
  - `service/` : This directory will contain the function that will extract and process the request based on the data in the defined database

## Configuration

If your project requires any configuration, such as API endpoints, environment variables, or other settings, make sure to document them here.

## Contributing

If you want to contribute to this project, follow these steps:

1. Fork the repository on GitHub.
2. Create a new branch with a descriptive name: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Create a pull request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
