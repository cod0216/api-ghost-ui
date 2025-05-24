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

- **Drag-and-drop scenario builder** using React Flow  
  ![nodedrag](https://github.com/user-attachments/assets/1a31443f-dcbc-4f17-854f-48078a9fe1fe)

    
- **Real-time test execution and result visualization**  
   ![resultpage](https://github.com/user-attachments/assets/eeeae1c0-5732-4de6-9f25-dd98a1256b9c)

    
- **Supports WebSocket & HTTP protocols**  
  ![websocket](https://github.com/user-attachments/assets/e194c471-0723-4d08-aac9-8ccc51ec3ab3)

    
- **Request-response mapping UI**  
  ![mapping](https://github.com/user-attachments/assets/9a985784-9c7c-4c54-b430-cfc1a7184d3f)

    
- **Report file download**  
  ![resultpage](https://github.com/user-attachments/assets/6d959db0-35dc-471b-bbcf-979ba8c7fe6b)

    

### Load Testing

- **Generate and run load test scripts**  
    ![loadcreate](https://github.com/user-attachments/assets/b1ef253e-a8e2-4365-ba4f-4206e1ffa579)

    
- **Monitor real-time results of load tests**  
    ![loadresult](https://github.com/user-attachments/assets/7dbd44d7-8653-43db-9a99-5e48202d7d50)

    

---

### Contribution Guide

- Please submit issues for bug reports or feature suggestions.  
    [Bug Issue](https://github.com/api-ghost/api-ghost-ui/issues)
    
- Follow the pull request and code review process.  
    [PR Issue](https://github.com/api-ghost/api-ghost-ui/pulls)
    

---

###  License

This project is licensed under the **MIT License**.
