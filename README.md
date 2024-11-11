# Airbnb Experiences Clone

To run this project on your device:

### Load Database:
1. **Install Required Libraries:**
   ```python
   pip install mysql pandas
   ```

2. **Configure Database Connection:**
   - In your database script, update the configuration details on **line 5:9** to match your database settings:
     ```python
     db_config = {
         'user': 'root',          # Replace with your MySQL username
         'password': 'password',  # Replace with your MySQL password
         'host': 'localhost',     # Replace with your host (e.g., localhost)
     }
     ```

3. **Configure Database in `backend/index.js`:**
   - Update the same configuration details in `backend/index.js` on **line 11:15**.

### Setup:
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd <project-folder>
   ```

3. **Install Dependencies for the Frontend:**
   ```bash
   cd frontend
   npm install
   ```

4. **Install Dependencies for the Backend:**
   ```bash
   cd ../backend
   npm install
   ```

5. **Navigate Back to the Project Root Directory and Run the Project:**
   ```bash
   cd ..
   npm start
   ```

### Note:
* I have set up `concurrently` to run both the backend and frontend upon executing `npm start`.
* There is a bug with the delete review button which renders it useless but there are no plans on updating it.
* There will be no further updates to this project.