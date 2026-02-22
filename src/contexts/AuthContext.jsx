import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth
} from '../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // SIMPLE VERSION - tanpa Firestore untuk initial load
  useEffect(() => {
    console.log('AuthProvider mounting...');
    
    // Cek admin login dari localStorage (INSTANT)
    const adminData = localStorage.getItem('admin_user');
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        console.log('Admin user found, setting instantly');
        setCurrentUser(parsedAdmin);
        setUserRole('admin');
        setIsAdmin(true);
        setLoading(false);
        return; // Jangan lanjut ke Firebase auth
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }

    // Subscribe ke Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser?.email || 'No user');
      
      if (firebaseUser) {
        // Check if user is admin (from localStorage or email)
        const savedAdmin = localStorage.getItem(`admin_${firebaseUser.uid}`);
        const isUserAdmin = savedAdmin === 'true' || 
                          firebaseUser.email?.includes('admin') ||
                          firebaseUser.displayName?.toLowerCase().includes('admin');
        
        // Ambil data profil dari localStorage jika ada
        const savedDisplayName = localStorage.getItem(`admin_displayName_${firebaseUser.uid}`);
        const savedBio = localStorage.getItem(`admin_bio_${firebaseUser.uid}`);
        const savedPhone = localStorage.getItem(`admin_phone_${firebaseUser.uid}`);
        const savedLocation = localStorage.getItem(`admin_location_${firebaseUser.uid}`);
        const savedJoinDate = localStorage.getItem(`admin_joinDate_${firebaseUser.uid}`);
        
        // Set data BASIC dulu (INSTANT)
        const basicUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: savedDisplayName || firebaseUser.displayName || '',
          name: savedDisplayName || firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: isUserAdmin ? 'admin' : 'user',
          isAdmin: isUserAdmin,
          provider: firebaseUser.providerData[0]?.providerId || 'unknown',
          emailVerified: firebaseUser.emailVerified,
          // Data tambahan
          bio: savedBio || '',
          phone: savedPhone || '',
          location: savedLocation || '',
          joinDate: savedJoinDate || ''
        };
        
        console.log('Setting basic user data instantly');
        setCurrentUser(basicUser);
        setUserRole(isUserAdmin ? 'admin' : 'user');
        setIsAdmin(isUserAdmin);
        
        // Save admin status to localStorage
        if (isUserAdmin) {
          localStorage.setItem(`admin_${firebaseUser.uid}`, 'true');
        }
        
        // Load Firestore data di BACKGROUND (tidak blocking)
        setTimeout(async () => {
          try {
            // Import Firestore hanya ketika diperlukan
            const { db } = await import('../firebase/config');
            const { doc, getDoc } = await import('firebase/firestore');
            
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const firestoreData = userDoc.data();
              console.log('Firestore data loaded:', firestoreData);
              
              // Update dengan data Firestore
              setCurrentUser(prev => ({
                ...prev,
                ...firestoreData,
                role: firestoreData.role || (isUserAdmin ? 'admin' : 'user'),
                isAdmin: firestoreData.role === 'admin' || isUserAdmin
              }));
              
              if (firestoreData.role) {
                setUserRole(firestoreData.role);
                setIsAdmin(firestoreData.role === 'admin');
              }
            }
          } catch (firestoreError) {
            console.warn('Could not load Firestore data:', firestoreError);
            // Continue dengan data basic
          }
        }, 0);
        
      } else {
        console.log('No user found');
        setCurrentUser(null);
        setUserRole(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    // Timeout untuk mencegah loading terlalu lama
    const timeoutId = setTimeout(() => {
      console.log('Auth loading timeout');
      setLoading(false);
    }, 3000); // Max 3 detik loading

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // REGISTER - SIMPLE & FAST
  const registerWithEmail = async (email, password, additionalData) => {
    try {
      console.log('Starting registration...');
      
      // Check if admin email
      const isUserAdmin = email.includes('admin') || 
                         additionalData?.name?.toLowerCase().includes('admin');
      
      // Buat user di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('User created in Auth');
      
      // Update profile dengan nama
      if (additionalData?.name) {
        await updateProfile(user, {
          displayName: additionalData.name
        });
      }
      
      // Set state INSTANT
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: additionalData?.name || '',
        name: additionalData?.name || '',
        photoURL: user.photoURL || '',
        role: isUserAdmin ? 'admin' : 'user',
        isAdmin: isUserAdmin,
        provider: 'email',
        emailVerified: user.emailVerified,
        ...additionalData
      };
      
      setCurrentUser(userData);
      setUserRole(isUserAdmin ? 'admin' : 'user');
      setIsAdmin(isUserAdmin);
      
      // Save admin status
      if (isUserAdmin) {
        localStorage.setItem(`admin_${user.uid}`, 'true');
      }
      
      // Save ke localStorage untuk data profil
      if (additionalData?.name) {
        localStorage.setItem(`admin_displayName_${user.uid}`, additionalData.name);
      }
      if (additionalData?.bio) {
        localStorage.setItem(`admin_bio_${user.uid}`, additionalData.bio);
      }
      if (additionalData?.phone) {
        localStorage.setItem(`admin_phone_${user.uid}`, additionalData.phone);
      }
      if (additionalData?.location) {
        localStorage.setItem(`admin_location_${user.uid}`, additionalData.location);
      }
      
      // Save ke Firestore di BACKGROUND (non-blocking)
      setTimeout(async () => {
        try {
          const { db } = await import('../firebase/config');
          const { doc, setDoc } = await import('firebase/firestore');
          
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          
          console.log('Saved to Firestore (background)');
        } catch (error) {
          console.warn('Could not save to Firestore:', error);
          // Continue anyway
        }
      }, 0);
      
      return { 
        success: true, 
        user: userData,
        message: 'Registrasi berhasil!' 
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // LOGIN - SIMPLE & FAST
  const loginWithEmail = async (email, password) => {
    try {
      console.log('Attempting login...');
      
      // Login dengan Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Login successful');
      
      // Check admin status
      const savedAdmin = localStorage.getItem(`admin_${user.uid}`);
      const isUserAdmin = savedAdmin === 'true' || email.includes('admin');
      
      // Ambil data profil dari localStorage
      const savedDisplayName = localStorage.getItem(`admin_displayName_${user.uid}`);
      const savedBio = localStorage.getItem(`admin_bio_${user.uid}`);
      const savedPhone = localStorage.getItem(`admin_phone_${user.uid}`);
      const savedLocation = localStorage.getItem(`admin_location_${user.uid}`);
      const savedJoinDate = localStorage.getItem(`admin_joinDate_${user.uid}`);
      
      // Set BASIC data INSTANT
      const basicUser = {
        uid: user.uid,
        email: user.email,
        displayName: savedDisplayName || user.displayName || '',
        name: savedDisplayName || user.displayName || '',
        photoURL: user.photoURL || '',
        role: isUserAdmin ? 'admin' : 'user',
        isAdmin: isUserAdmin,
        provider: 'email',
        emailVerified: user.emailVerified,
        // Data tambahan
        bio: savedBio || '',
        phone: savedPhone || '',
        location: savedLocation || '',
        joinDate: savedJoinDate || ''
      };
      
      setCurrentUser(basicUser);
      setUserRole(isUserAdmin ? 'admin' : 'user');
      setIsAdmin(isUserAdmin);
      
      // Save admin status
      if (isUserAdmin) {
        localStorage.setItem(`admin_${user.uid}`, 'true');
      }
      
      // Load Firestore data di BACKGROUND
      setTimeout(async () => {
        try {
          const { db } = await import('../firebase/config');
          const { doc, getDoc, updateDoc } = await import('firebase/firestore');
          
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            
            // Update state dengan data Firestore
            setCurrentUser(prev => ({
              ...prev,
              ...firestoreData,
              role: firestoreData.role || (isUserAdmin ? 'admin' : 'user'),
              isAdmin: firestoreData.role === 'admin' || isUserAdmin
            }));
            
            if (firestoreData.role) {
              setUserRole(firestoreData.role);
              setIsAdmin(firestoreData.role === 'admin');
            }
            
            // Update last login
            await updateDoc(userDocRef, {
              lastLogin: new Date().toISOString()
            });
          }
        } catch (error) {
          console.warn('Firestore error:', error);
        }
      }, 0);
      
      return { success: true, user: basicUser };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // GOOGLE LOGIN - SIMPLE & FAST
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check admin status
      const isUserAdmin = user.email?.includes('admin') || false;
      
      // Ambil data profil dari localStorage
      const savedDisplayName = localStorage.getItem(`admin_displayName_${user.uid}`);
      const savedBio = localStorage.getItem(`admin_bio_${user.uid}`);
      const savedPhone = localStorage.getItem(`admin_phone_${user.uid}`);
      const savedLocation = localStorage.getItem(`admin_location_${user.uid}`);
      
      // Set BASIC data INSTANT
      const googleUser = {
        uid: user.uid,
        email: user.email,
        displayName: savedDisplayName || user.displayName || '',
        name: savedDisplayName || user.displayName || '',
        photoURL: user.photoURL || '',
        role: isUserAdmin ? 'admin' : 'user',
        isAdmin: isUserAdmin,
        provider: 'google',
        emailVerified: user.emailVerified,
        // Data tambahan
        bio: savedBio || '',
        phone: savedPhone || '',
        location: savedLocation || ''
      };
      
      setCurrentUser(googleUser);
      setUserRole(isUserAdmin ? 'admin' : 'user');
      setIsAdmin(isUserAdmin);
      
      // Save admin status
      if (isUserAdmin) {
        localStorage.setItem(`admin_${user.uid}`, 'true');
      }
      
      // Save ke Firestore di BACKGROUND
      setTimeout(async () => {
        try {
          const { db } = await import('../firebase/config');
          const { doc, setDoc } = await import('firebase/firestore');
          
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            ...googleUser,
            registeredWithGoogle: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.warn('Google user Firestore save failed:', error);
        }
      }, 0);
      
      return { success: true, user: googleUser };
      
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  // MANUAL ADMIN LOGIN (untuk form admin khusus)
  const loginAsAdmin = (adminData) => {
    try {
      console.log('Manual admin login:', adminData);
      
      // Ambil data dari localStorage atau gunakan default
      const savedData = localStorage.getItem('adminHelpData');
      let helpData = {};
      if (savedData) {
        try {
          helpData = JSON.parse(savedData);
        } catch (e) {
          console.error('Error parsing help data:', e);
        }
      }
      
      const adminUser = {
        uid: adminData.uid || `admin_${Date.now()}`,
        email: adminData.email || helpData.email || 'admin@gmail.com',
        displayName: adminData.displayName || adminData.name || helpData.displayName || 'Administrator XI PPLG 1',
        name: adminData.name || adminData.displayName || helpData.displayName || 'Administrator XI PPLG 1',
        photoURL: adminData.photoURL || helpData.photoURL || 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff&bold=true',
        role: 'admin',
        isAdmin: true,
        provider: 'admin',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        // Data tambahan
        bio: adminData.bio || helpData.bio || `ولا تقرّبوا الرَّحْى إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا
Janganlah kamu mendekati zina.
Sesungguhnya (zina) itu adalah perbuatan keji dan izin terhadap`,
        phone: adminData.phone || helpData.phone || '085647527381',
        location: adminData.location || helpData.location || 'SMKN 2 NGANJUK',
        joinDate: adminData.joinDate || helpData.joinDate || new Date().toISOString().split('T')[0]
      };
      
      // Save to localStorage
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      
      // Save individual keys untuk kompatibilitas
      localStorage.setItem(`admin_displayName_${adminUser.uid}`, adminUser.displayName);
      localStorage.setItem(`admin_email_${adminUser.uid}`, adminUser.email);
      localStorage.setItem(`admin_bio_${adminUser.uid}`, adminUser.bio);
      localStorage.setItem(`admin_phone_${adminUser.uid}`, adminUser.phone);
      localStorage.setItem(`admin_location_${adminUser.uid}`, adminUser.location);
      localStorage.setItem(`admin_joinDate_${adminUser.uid}`, adminUser.joinDate);
      
      // Update juga adminHelpData
      const adminHelpData = {
        displayName: adminUser.displayName,
        email: adminUser.email,
        bio: adminUser.bio,
        phone: adminUser.phone,
        location: adminUser.location,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('adminHelpData', JSON.stringify(adminHelpData));
      
      // Update state
      setCurrentUser(adminUser);
      setUserRole('admin');
      setIsAdmin(true);
      setLoading(false);
      
      return { success: true, user: adminUser };
      
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: error.message };
    }
  };

  // RESET PASSWORD
  const resetPassword = async (email) => {
    try {
      console.log('Requesting password reset for:', email);
      
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      
      return { 
        success: true, 
        message: 'Email reset password telah dikirim. Silakan cek email Anda.' 
      };
      
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'Terjadi kesalahan saat mengirim reset password';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email tidak terdaftar';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Terlalu banyak permintaan. Coba lagi nanti';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // LOGOUT
  const logout = async () => {
    console.log('Logging out...');
    
    // Hapus admin data jika ada
    localStorage.removeItem('admin_user');
    
    // Logout dari Firebase
    if (auth.currentUser) {
      await signOut(auth);
    }
    
    // Reset state INSTANT
    setCurrentUser(null);
    setUserRole(null);
    setIsAdmin(false);
    
    return { success: true };
  };

  // LOGOUT ADMIN (khusus untuk admin manual)
  const logoutAdmin = () => {
    console.log('Logging out admin...');
    localStorage.removeItem('admin_user');
    // Jangan hapus adminHelpData biar datanya tetap ada
    setCurrentUser(null);
    setUserRole(null);
    setIsAdmin(false);
    return { success: true };
  };

  const value = {
    currentUser,
    userRole,
    isAdmin,
    loading,
    loginWithGoogle,
    loginWithEmail,
    loginAsAdmin,
    registerWithEmail,
    resetPassword, 
    logout,
    logoutAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}