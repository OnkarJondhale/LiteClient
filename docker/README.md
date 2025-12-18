# Lite API Client & Proxy

A lightweight, containerized API testing tool built with **React** and **Node.js**. This tool allows you to send HTTP requests and bypass CORS issues using a built-in proxy. It is specifically optimized to handle `localhost` requests even when running inside a Docker container.

---

## 🚀 Quick Start

The fastest way to run the tool is using Docker. You don't need to install Node.js or download the source code.

1. **Run the container:**
```bash
docker run -d -p 9090:9090 --name api-tool onkarjondhale/lite-client:v1
```

2. **Access the UI:**
```bash
   Open your browser and go to: http://localhost:9090
```

---

### ✨ Key Features
CORS Bypass: Requests are proxied through the backend server to avoid browser-based CORS restrictions.

Smart Localhost Routing: Automatically detects requests to localhost or 127.0.0.1 and routes them to your host machine (Windows/Mac) using host.docker.internal.

Performance Metrics: View response times and payload sizes for every request.

Zero Configuration: Works out of the box with a single Docker command.

--- 

### 🛠 Usage & Testing Local APIs
If you are testing an API running on your own computer (e.g., a backend app on port 8080), you can simply type: http://localhost:8080/your-endpoint

The tool is programmed to recognize localhost and automatically bridge the connection from the Docker container back to your host machine. No extra configuration is required.

---
📝 License

This project is open-source and free to use for local development and API testing.