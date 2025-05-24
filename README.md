## WELCOME TO API GHOST GUI

![image](https://github.com/user-attachments/assets/b219c6f9-cb2f-42d0-8c66-d68f21757f6d)


### Project Overview

API Ghost is a tool that simplifies complex API integration testing and load testing through an intuitive drag-and-drop interface.
Without writing any code, users can visually connect APIs in sequence on a web interface or define test scenarios using a simple YAML file.
This repository provides the GUI component, enabling consistent testing from local development to production environments.
It also offers clear, visual reports of test results, significantly reducing the time required for testing by development and QA teams.

---

### Installation & Usage

#### System Requirements

- **Required:**
    
    - Node.js v22 or higher
        
    - A modern browser (e.g., Chrome)
        

#### Development Setup

```bash
npm install
npm run build
```

#### API GHOST UI Integration

1. **Copy frontend build files**
    
    - Copy the contents of the dist folder into the `lib/src/resources/static` directory of the [lib project](https://github.com/api-ghost/api-ghost-agent-spring).
        
2. **Rename the HTML file**
    
    - Rename `index.html` to `apighost-ui.html`
        
3. **Build and integrate Spring JAR**
    
    1. In Gradle > Tasks > `shadow`, run `shadowJar`
        
    2. Move the generated `api-ghost-agent-spring.jar` file from `build/libs` to the `build/libs` folder of your target project
        
    3. Add the following to the target project’s `build.gradle` dependencies:
        
        ```groovy
        implementation files('./build/libs/api-ghost-agent-spring.jar')
        ```
        
4. **Run the project**
    
    - Access via browser: `http://localhost:<port>/domain/apighost-ui`
        

---

### Feature Summary

### Scenario Testing

* **Drag-and-drop scenario builder using React Flow**

![nodedrag](https://github.com/user-attachments/assets/3cd89531-236e-46f0-857a-c26412507df8)


  You can create nodes by dragging and dropping endpoints listed in the API list.

* **Real-time test execution and result visualization**

![realtimeresult](https://github.com/user-attachments/assets/1e52d1df-b325-40e4-ad22-7a87b41de45d)


  Test results are displayed in real time as the scenario is executed.

* **Supports WebSocket & HTTP protocols**

  ![websocket](https://github.com/user-attachments/assets/eb587765-ffe6-4828-8e45-6694d66e6b78)

  WebSocket-based APIs are also fully supported for testing.

* **Request-response mapping UI**

![mapping](https://github.com/user-attachments/assets/200a1d30-3375-43f4-8cfb-b2c437aae95c)


  You can define expected response values and store values to pass to the next endpoint.

* **Result dashboard page**

![resultpage](https://github.com/user-attachments/assets/23b4d984-59e6-4720-9768-fbcd47430a25)


  Completed test results can be reviewed on a dedicated dashboard page.

---

### Load Testing

* **Generate and run load test scripts**

![loadcreate](https://github.com/user-attachments/assets/c42a7c9f-8b17-4333-b19e-8604eb1269b2)


  You can configure load test scenarios and set the number of virtual users.

* **Monitor real-time results of load tests**

  ![loadresult](https://github.com/user-attachments/assets/1c541b44-4929-4276-a66f-d6c526db912a)


  Load test progress and results can be monitored in real time.

    

---

### Contribution Guide

- Please submit issues for bug reports or feature suggestions.  
    [Bug Issue](https://github.com/api-ghost/api-ghost-ui/issues)
    
- Follow the pull request and code review process.  
    [PR Issue](https://github.com/api-ghost/api-ghost-ui/pulls)
    

---

###  License

This project is licensed under the **[MIT License](https://github.com/cod0216/api-ghost-ui/blob/main/LICENSE)**.
