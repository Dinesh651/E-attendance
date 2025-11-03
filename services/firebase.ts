// Fix: Use Firebase v8 compat imports to work with the v12 library via import map.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { User, Role } from "../types";


// Your web app's Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyAorD9R4FiSq6M1MeJwFukkO3Leu7q6F7o",
  authDomain: "cozey-8ad64.firebaseapp.com",
  databaseURL: "https://cozey-8ad64.firebaseio.com",
  projectId: "cozey-8ad64",
  storageBucket: "cozey-8ad64.appspot.com",
  messagingSenderId: "841803166613",
  appId: "1:841803166613:web:154d11830d7ef9144f3c9c",
  measurementId: "G-94BYMYTS85"
};

// Initialize Firebase
// Fix: Use Firebase v8 compat syntax and prevent re-initialization.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.database();


export const findUserByEmailInDB = async (email: string): Promise<User | null> => {
  // Fix: Use Firebase v8 compat syntax.
  const dbRef = db.ref();
  const normalizedEmail = email.toLowerCase();

  // Check admins by fetching all and filtering client-side
  // Fix: Use Firebase v8 compat syntax.
  const adminsSnapshot = await dbRef.child('admins').get();
  if (adminsSnapshot.exists()) {
    const adminsData = adminsSnapshot.val();
    const adminId = Object.keys(adminsData).find(key => adminsData[key].email.toLowerCase() === normalizedEmail);
    if (adminId) {
      const adminUser = adminsData[adminId];
      return { id: adminId, name: adminUser.name, email: adminUser.email, role: Role.ADMIN };
    }
  }

  // Check employees by fetching all and filtering client-side
  // Fix: Use Firebase v8 compat syntax.
  const employeesSnapshot = await dbRef.child('employees').get();
  if (employeesSnapshot.exists()) {
    const employeesData = employeesSnapshot.val();
    const employeeId = Object.keys(employeesData).find(key => employeesData[key].email.toLowerCase() === normalizedEmail);
    if (employeeId) {
      const employeeUser = employeesData[employeeId];
      return { id: employeeId, name: employeeUser.name, email: employeeUser.email, role: Role.EMPLOYEE };
    }
  }

  return null;
};

export const getEmployeesFromDB = async (): Promise<User[]> => {
    // Fix: Use Firebase v8 compat syntax.
    const employeesRef = db.ref('employees');
    const snapshot = await employeesRef.get();
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
            id: key,
            name: data[key].name,
            email: data[key].email,
            role: Role.EMPLOYEE,
        }));
    }
    return [];
};

export const addEmployeeToDB = async (name: string, email: string): Promise<User> => {
    // Fix: Use Firebase v8 compat syntax.
    const employeesRef = db.ref('employees');
    const newEmployeeRef = employeesRef.push();
    const newEmployeeData = { name, email: email.toLowerCase() };
    await newEmployeeRef.set(newEmployeeData);
    return { id: newEmployeeRef.key!, ...newEmployeeData, role: Role.EMPLOYEE };
};


export const removeEmployeeFromDB = async (employeeId: string): Promise<void> => {
    // Fix: Use Firebase v8 compat syntax.
    const employeeRef = db.ref(`employees/${employeeId}`);
    await employeeRef.remove();
};