import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Firestore,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore targeting the specific databaseId if defined
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface VendorRegistrationData {
  ownerName: string;
  storeName: string;
  category: string;
  phone: string;
  address: string;
  productDescription: string;
  vendorCode: string;
  status?: string;
  createdAt?: any;
}

export interface OnlineOrderData {
  invoice: string;
  customerName: string;
  customerPhone: string;
  address: string;
  deliveryType: string;
  paymentMethod?: string;
  items: any[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  status: string;
  notes?: string;
  createdAt?: any;
}

// Save vendor registration to Firestore
export const saveVendorRegistration = async (data: VendorRegistrationData) => {
  try {
    const colRef = collection(db, 'vendor_registrations');
    const docRef = await addDoc(colRef, {
      ...data,
      status: data.status || 'pending',
      createdAt: serverTimestamp(),
      submittedAtClient: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving vendor registration to Firestore:', error);
    return { success: false, error };
  }
};

// Save online order to Firestore
export const saveOnlineOrder = async (order: OnlineOrderData) => {
  try {
    const colRef = collection(db, 'orders');
    const docRef = await addDoc(colRef, {
      ...order,
      createdAt: serverTimestamp(),
      orderedAtClient: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    return { success: false, error };
  }
};

// Save new customer to Firestore
export const saveCustomer = async (customer: {
  name: string;
  phone: string;
  address?: string;
  memberCode?: string;
}) => {
  try {
    const colRef = collection(db, 'customers');
    const docRef = await addDoc(colRef, {
      ...customer,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving customer to Firestore:', error);
    return { success: false, error };
  }
};

// Fetch latest vendor registrations
export const getVendorRegistrations = async (maxLimit: number = 20) => {
  try {
    const colRef = collection(db, 'vendor_registrations');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(maxLimit));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.warn('Could not fetch vendor registrations:', error);
    return [];
  }
};

// Real-time listener: Otomatis terpanggil setiap ada mitra mendaftar tanpa perlu reload
export const subscribeVendorRegistrations = (
  callback: (vendors: (VendorRegistrationData & { id: string })[]) => void,
  maxLimit: number = 50
) => {
  try {
    const colRef = collection(db, 'vendor_registrations');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(maxLimit));
    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        callback(list);
      },
      (error) => {
        console.warn('Real-time vendor listener error:', error);
      }
    );
  } catch (error) {
    console.warn('Failed to attach vendor listener:', error);
    return () => {};
  }
};

// Real-time listener: Otomatis terpanggil setiap ada pesanan online baru dari toko
export const subscribeOnlineOrders = (
  callback: (orders: (OnlineOrderData & { id: string })[]) => void,
  maxLimit: number = 50
) => {
  try {
    const colRef = collection(db, 'orders');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(maxLimit));
    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        callback(list);
      },
      (error) => {
        console.warn('Real-time orders listener error:', error);
      }
    );
  } catch (error) {
    console.warn('Failed to attach orders listener:', error);
    return () => {};
  }
};

// Update status registrasi vendor
export const updateVendorStatus = async (docId: string, status: string) => {
  try {
    const docRef = doc(db, 'vendor_registrations', docId);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error('Error updating vendor status:', error);
    return { success: false, error };
  }
};

export default app;
