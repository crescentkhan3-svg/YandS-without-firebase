export const auth = {
  currentUser: { email: 'demo@example.com', uid: 'demo-uid' },
  onAuthStateChanged: (callback: any) => {
    callback({ email: 'demo@example.com', uid: 'demo-uid' });
    return () => {};
  }
};

export const db = {};
export const storage = {};
export const app = {};
export default app;
