// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock do Firebase
jest.mock('./config/firebase', () => {
  const auth = {
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
    GoogleAuthProvider: jest.fn()
  };

  const db = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      add: jest.fn(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        docs: [],
        forEach: jest.fn()
      })
    }))
  };

  const storage = {
    ref: jest.fn(() => ({
      child: jest.fn(() => ({
        put: jest.fn(),
        getDownloadURL: jest.fn()
      }))
    }))
  };

  const functions = {
    httpsCallable: jest.fn(() => jest.fn())
  };

  const firebase = {
    auth: () => auth,
    firestore: () => db,
    storage: () => storage,
    functions: () => functions
  };

  return {
    db,
    auth,
    storage,
    firebase,
    Timestamp: {
      now: jest.fn(() => ({ toDate: () => new Date() })),
      fromDate: jest.fn(() => ({ toDate: () => new Date() }))
    },
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      add: jest.fn(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        docs: [],
        forEach: jest.fn()
      })
    })),
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    })),
    getDoc: jest.fn().mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({})
    }),
    getDocs: jest.fn().mockResolvedValue({
      docs: [],
      forEach: jest.fn()
    }),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    serverTimestamp: jest.fn()
  };
});

// Mock do React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
}));

// Mock global da API do navegador
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Silenciar mensagens de console durante os testes
global.console = {
  ...console,
  // Descomente para silenciar logs específicos durante os testes
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
}; 