import React, { useState, useEffect, useRef } from 'react';
import { TUILogin } from '@tencentcloud/tui-core-lite';
import { LoginStore, getChannel } from 'tuikit-atomicx-react';
import {
  UIKitProvider,
  ConversationList,
  Chat,
  ChatHeader,
  MessageList,
  MessageInput
} from '@tencentcloud/chat-uikit-react';

import {
  MessageSquare,
  Users,
  Key,
  Copy,
  Check,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  AlertCircle,
  LogOut,
  User,
  Lock,
  Mail,
  Sparkles,
  Smile,
  Paperclip,
  CheckCheck,
  Layout,
  PlusCircle,
  UserPlus,
  MessageCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import './App.css';

// Real Tencent Credentials & AppID from User Console
const DEFAULT_SDK_APP_ID = 20045691;

// Fallback UserSig credentials map
const FALLBACK_CREDENTIALS_MAP = {
  "45060fa6-89eb-4bae-8d6e-e28b280a6f4e": {
    name: "Carmen",
    sig: "eJw1jdsKgkAURX9F5rWM4zDXoFepMIIuEL5pc9RJK*0iUvTvmenrWqy932QXbCc13sjUIXQCZOx0xBq8PGxi-4JxEJBEwlUaY5fFEbrKCHSRqpgqiETCcCjvJo-K0pq2owCMC*31BpvS3rDlHue8ddDzhz13VCoJilJJhyWb-s7re1b5a9mkxSnfBBpWo*WruB7DRaDnz4R5JrTr*lD52Wo-I58vZn46wA__"
  },
  "45060fa6-89eb-4bae-8d6e-e28b280a6f4": {
    name: "Sogan lorrain",
    sig: "eJw1jdEKgjAYRl9Fdp36O7Y5gy5CIZACw0LobsNfGWUukxCid89Mb8-hfN*bnPa598KOrB1CPSArZyKmxHtvKvMXjIOASglXRqhdphW6shToIpWaSlCiYkv4LK-KWlOOGQVgXETBbHCwpsORB5zz0cHMe9NMNJQhSEpDuiyZ*vcddzm9sGMRZrvEbB*sZn5qh6LFNj4n-k1naS8qaGI5HDbk8wX2FDk*"
  },
  "3e9ab094-926e-4a48-f6c3-56d807fc6cb2": {
    name: "John Doe 1",
    sig: "eJw1jdEKgjAYRl9FdmvK-N3mFnQTSVESRYLpnbopMwyxEUH07pnp7Tmc73ujOLq4T9WjpYXAxWhhjURLdTe60n-hK5EXWBBHAFMOyQl3Klb6DmWS46AqWVnAXD7kLe86LYcOMCaUCW8y6tXpXg3co5QODk-c6HakAQ8wBwhgXtL17zzK*LZM7Y2d7urinMh4DacoyQrT7KWMfTDXY961DQsP4Qp9vgy3OWA_"
  },
  "16ef71f1-46cc-431e-9bdd-a1fe27a749b1": {
    name: "Juin Juillet",
    sig: "eJw1jc0KgkAURl9FZlvadXDGMWhXVP5gqItwp3m10QxRiSh698x0ew7n*94kckPtgS1ZK4RqQJbKSGSG917m8i8MBhzyhKvCwlQ10gRVkXFUkYqUCkh4buBcdlmVNI3Mho4CGIxb*mTw2cgWB64zxgYHE*9lPVJTmCBAN*m8JIvf*WEVB4-GuSxsb*c7dtWV-BZGMjBrPfbPxdY7Xfelm8bHV7chny9Ldzo8"
  },
  "administrator": {
    name: "Administrator",
    sig: "eJw1jV0LgjAYRv*K7Drs3WppQVd9kBGTyKLb1Va9iGbbDCn675np7TmH53mTZLPzn9qQiUeYD6TnNQSVzh1e8C*kyjBH64x0d9MlVqWyKFDVAQMY8tGYtkZXBRpdc8o5rx203GHW0CAMIGQsY10SXn8vs1SckrPYZnaxT1aHqCxFRe1ALNn8BpauXayO-VccPyCaks8XiYM1sQ__"
  }
};

const DEFAULT_USER_ID = "45060fa6-89eb-4bae-8d6e-e28b280a6f4e"; // Carmen

// Error boundary to catch any fatal crashes from external UIKit packages without blanking the screen
class OfficialUIKitErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Tencent UIKit rendered with error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.95)', color: '#fff' }}>
          <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>
            Erreur lors de l'initialisation du composant Tencent
          </h3>
          <p style={{ maxWidth: '540px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.6 }}>
            Une erreur est survenue pendant le chargement. Vous pouvez cliquer sur Réessayer une fois la session initialisée.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              <RefreshCw size={16} />
              Réessayer
            </button>
          </div>
          {this.state.error && (
            <pre style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', fontSize: '0.75rem', color: '#f87171', maxWidth: '600px', overflowX: 'auto', textAlign: 'left' }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_logged_in') === 'true';
  });

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('auth_email') || 'soganlorrain@gmail.com';
  });
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // UI Mode: 'official' (Kit Officiel Tencent TUIUIKit) | 'custom' (Interface Studio UI)
  const [uiMode, setUiMode] = useState(() => {
    return localStorage.getItem('ui_mode') || 'official';
  });

  const [isTencentReady, setIsTencentReady] = useState(false);
  const [tencentError, setTencentError] = useState(null);

  // Dynamic Credentials & Contacts loaded directly from FastAPI backend APIs
  const [sdkAppId, setSdkAppId] = useState(DEFAULT_SDK_APP_ID);
  const [userId, setUserId] = useState(DEFAULT_USER_ID);
  const [userSig, setUserSig] = useState('');
  // isCredentialsReady prevents UIKitProvider from mounting with stale/fallback credentials.
  // It becomes true only once the backend has returned the real userSig for the logged-in user.
  const [isCredentialsReady, setIsCredentialsReady] = useState(false);

  const [contacts, setContacts] = useState([
    { id: "16ef71f1-46cc-431e-9bdd-a1fe27a749b1", first_name: "Juin", last_name: "Juillet", role: "staff" },
    { id: "3e9ab094-926e-4a48-f6c3-56d807fc6cb2", first_name: "John", last_name: "Doe 1", role: "staff" },
    { id: "45060fa6-89eb-4bae-8d6e-e28b280a6f4", first_name: "Sogan", last_name: "Lorrain", role: "admin" }
  ]);
  const [targetUserId, setTargetUserId] = useState("16ef71f1-46cc-431e-9bdd-a1fe27a749b1");
  const [selectedContact, setSelectedContact] = useState({ id: "16ef71f1-46cc-431e-9bdd-a1fe27a749b1", first_name: "Juin", last_name: "Juillet", role: "staff" });

  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [activeChatNonce, setActiveChatNonce] = useState(Date.now());
  // activeConversationID is intentionally undefined on mount to avoid error 2024.
  // It is only set when the user explicitly clicks "Ouvrir le chat".
  const [activeConversationID, setActiveConversationID] = useState(undefined);

  // Chat & Messaging State
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSig, setCopiedSig] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);

  // Once credentials are fetched from backend, call LoginStore.login() to establish the IM session.
  // UIKitProvider mounts ONLY after this succeeds (isTencentReady=true), preventing error 2024.
  useEffect(() => {
    if (!isAuthenticated || !isCredentialsReady || !userId || !userSig) return;

    let active = true;
    setIsTencentReady(false);
    setTencentError(null);

    const connect = async () => {
      try {
        console.log('[TUILogin] Logging in...', { userId, sdkAppId });
        await TUILogin.login({
          SDKAppID: sdkAppId,
          userID: userId,
          userSig: userSig,
          useUploadPlugin: true,
          framework: 'react'
        });
        if (active) {
          console.log('[TUILogin] Login success!');
          setIsTencentReady(true);
        }
      } catch (err) {
        const isRepeated =
          err?.code === 2025 ||
          (typeof err?.message === 'string' && err.message.includes('Repeated login')) ||
          (typeof err === 'string' && err.includes('Repeated login'));
        if (isRepeated) {
          console.log('[TUILogin] Already logged in (2025). Session ready.');
          if (active) setIsTencentReady(true);
        } else {
          console.error('[TUILogin] Login failed:', err);
          if (active) setTencentError(err?.message || 'Erreur de connexion Tencent IM.');
        }
      }
    };

    connect();
    return () => { active = false; };
  }, [isAuthenticated, isCredentialsReady, userId, userSig, sdkAppId]);

  // Helper logout function that can be called when 401 Unauthorized occurs or user clicks Logout
  const handleLogout = async (errorMessage = '') => {
    const errorStr = typeof errorMessage === 'string' ? errorMessage : '';
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    } catch (_) {}
    try {
      await LoginStore.logout?.().catch(() => {});
    } catch (_) {}
    try {
      await TUILogin.logout?.().catch(() => {});
    } catch (_) {}
    localStorage.removeItem('auth_logged_in');
    setIsAuthenticated(false);
    setIsTencentReady(false);
    setIsCredentialsReady(false);
    setUserId(DEFAULT_USER_ID);
    setUserSig('');
    setLoginError(errorStr);
  };

  // 1. FETCH LIVE DATA FROM FASTAPI BACKEND: POST /api/chat/usersig & GET /api/chat/contacts
  // Automatically redirect to login page if 401 Unauthorized is encountered
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch UserSig from real backend: POST /api/chat/usersig
      fetch('/api/chat/usersig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
        .then((res) => {
          if (res.status === 401) {
            handleLogout("Votre session a expiré ou n'est plus autorisée (Erreur 401). Veuillez vous reconnecter.");
            return null;
          }
          return res.json();
        })
        .then((resData) => {
          if (!resData) {
            setTencentError("Aucune donnée reçue du serveur pour les identifiants.");
            return;
          }
          const sigData = resData?.data;
          if (sigData) {
            if (typeof sigData === 'string') {
              setUserSig(sigData);
            } else if (sigData.user_sig) {
              setUserSig(sigData.user_sig);
              if (sigData.user_id) setUserId(sigData.user_id);
              if (sigData.sdk_api_id || sigData.sdk_app_id) {
                setSdkAppId(Number(sigData.sdk_api_id || sigData.sdk_app_id));
              }
            }
          }
          setIsCredentialsReady(true);
        })
        .catch((err) => {
          console.error("Backend usersig fetch info:", err);
          setTencentError("Erreur réseau lors de la récupération des identifiants.");
        });

      // Fetch Contacts from real backend: GET /api/chat/contacts
      fetch('/api/chat/contacts', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      })
        .then((res) => {
          if (res.status === 401) {
            handleLogout("Votre session a expiré ou n'est plus autorisée (Erreur 401). Veuillez vous reconnecter.");
            return null;
          }
          return res.json();
        })
        .then((resData) => {
          if (!resData) return;
          const list = resData?.data || [];
          if (Array.isArray(list) && list.length > 0) {
            setContacts(list);
            setSelectedContact(list[0]);
            setTargetUserId(list[0].id);
          }
        })
        .catch((err) => {
          console.log("Backend contacts fetch info:", err);
        });
    }
  }, [isAuthenticated]);

  // 2. REMOVED — UIKitProvider manages LoginStore.login() internally.
  // Keeping isTencentReady in sync via LoginStore.subscribe above.

  // Save selection settings
  useEffect(() => {
    localStorage.setItem('ui_mode', uiMode);
    localStorage.setItem('tencent_user_id', userId);
    localStorage.setItem('user_sig', userSig);
  }, [uiMode, userId, userSig]);

  // Handle active Tencent user selection
  const handleUserSelect = (newUserId) => {
    setUserId(newUserId);
    const credential = FALLBACK_CREDENTIALS_MAP[newUserId] || FALLBACK_CREDENTIALS_MAP[DEFAULT_USER_ID];
    setUserSig(credential.sig);
  };

  // Programmatically open a conversation using the official internal Channel API.
  // getChannel().setActiveConversation() is how ConversationList switches conversations internally.
  const handleStartChatWithTarget = async () => {
    if (!targetUserId || targetUserId === userId) return;
    setIsCreatingChat(true);
    try {
      const convID = `C2C${targetUserId}`;
      // Use the Channel singleton — same API used by ConversationList internally
      getChannel().switchConversation(convID);
      setActiveConversationID(convID);
    } catch (err) {
      console.warn("switchConversation error:", err);
      // Fallback: set ID directly
      setActiveConversationID(`C2C${targetUserId}`);
    } finally {
      setIsCreatingChat(false);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200 || res.status === 204) {
        setIsAuthenticated(true);
        localStorage.setItem('auth_logged_in', 'true');
        localStorage.setItem('auth_email', email);
        setLoginError('');
      } else if (res.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('auth_logged_in');
        setLoginError("Accès non autorisé (Erreur 401) : Email ou mot de passe incorrect.");
      } else {
        const errorData = await res.json().catch(() => null);
        const msg = errorData?.detail || `Erreur de connexion (Code HTTP ${res.status})`;
        setIsAuthenticated(false);
        localStorage.removeItem('auth_logged_in');
        setLoginError(msg);
      }
    } catch (err) {
      console.error("Login network/API error:", err);
      // In case backend is not running or network fails
      setIsAuthenticated(false);
      localStorage.removeItem('auth_logged_in');
      setLoginError("Erreur réseau : Impossible de contacter le serveur d'authentification.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Listen for real-time incoming messages from Tencent SDK
  useEffect(() => {
    let chat = null;
    try {
      chat = TUILogin.getContext()?.chat;
    } catch (err) {
      console.log("TUILogin getContext info:", err);
    }

    if (!chat) return;

    const handleIncomingMessage = (event) => {
      const msgList = event?.data || [];
      msgList.forEach((msg) => {
        const senderId = msg.from;
        const text = msg.payload?.text || '';
        if (!text) return;

        setMessages((prev) => ({
          ...prev,
          [senderId]: [
            ...(prev[senderId] || []),
            {
              id: msg.ID || Date.now(),
              sender: 'them',
              text: text,
              time: new Date((msg.time || Date.now() / 1000) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }));
      });
    };

    chat.on('onMessageReceived', handleIncomingMessage);
    return () => {
      chat.off('onMessageReceived', handleIncomingMessage);
    };
  }, [isAuthenticated, userId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !selectedContact) return;

    const contactId = selectedContact.id;
    const textToSend = chatInput.trim();
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Instant local optimistic update in UI
    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMsg]
    }));
    setChatInput('');

    // 2. Transmit via Tencent Cloud Chat WebSocket SDK
    try {
      const chat = TUILogin.getContext()?.chat;
      if (chat) {
        const message = chat.createTextMessage({
          to: contactId,
          conversationType: 'C2C',
          payload: { text: textToSend }
        });
        await chat.sendMessage(message);
        console.log("Message successfully transmitted to Tencent IM:", message);
      }
    } catch (err) {
      console.warn("Tencent SDK sendMessage response:", err);
    }
  };

  const copyUserSig = () => {
    navigator.clipboard.writeText(userSig);
    setCopiedSig(true);
    setTimeout(() => setCopiedSig(false), 2000);
  };

  const filteredContacts = contacts.filter((c) =>
    `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = selectedContact ? messages[selectedContact.id] || [] : [];

  // LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="login-screen-overlay">
        <div className="login-card">
          <div className="login-brand-row">
            <div className="login-brand-icon">
              <MessageSquare size={28} />
            </div>
            <div>
              <h2 className="login-title">Tencent Chat Studio</h2>
              <p className="login-subtitle">Messagerie Instantanée (Web React)</p>
            </div>
          </div>

          {/* Error Banner when 401 or login failure */}
          {loginError && (
            <div className="login-alert login-alert-error" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Erreur d'accès :</strong>
                <div>{loginError}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label className="input-label">Adresse Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '38px', color: '#ffffff' }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Mot de passe / Code secret</label>
                <span style={{ fontSize: '0.72rem', color: showPassword ? 'var(--accent-cyan)' : 'var(--text-dim)' }}>
                  {showPassword ? 'Visibilité active' : 'Texte masqué'}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  style={{ paddingLeft: '38px', paddingRight: '44px', color: '#ffffff', letterSpacing: showPassword ? 'normal' : '0.1em' }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: showPassword ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe en clair"}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Cliquez sur l'icône œil à droite pour afficher ou masquer ce que vous écrivez.
              </small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: '8px', padding: '12px' }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Se connecter & Lancer la Messagerie
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN APPLICATION SCREEN
  return (
    <div className="app-shell">
      {/* Top Navbar Header */}
      <header className="chat-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="chip-avatar">
            <MessageSquare size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Tencent Instant Messaging
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Connecté : {email}
            </p>
          </div>
        </div>

        {/* User Selection & Starter Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Active Logged-in User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Moi (Utilisateur) :</span>
            <select 
              value={userId} 
              onChange={(e) => handleUserSelect(e.target.value)}
              style={{ padding: '3px 8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}
            >
              {Object.entries(FALLBACK_CREDENTIALS_MAP).map(([id, info]) => (
                <option key={id} value={id}>{info.name}</option>
              ))}
            </select>
          </div>

          {/* Quick Chat Target Selector populated from GET /api/chat/contacts */}
          {contacts.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.12)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.35)', fontSize: '0.75rem' }}>
              <UserPlus size={14} color="var(--primary)" />
              <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Écrire à :</span>
              <select 
                value={targetUserId}
                onChange={(e) => {
                  setTargetUserId(e.target.value);
                  const found = contacts.find(c => c.id === e.target.value);
                  if (found) setSelectedContact(found);
                }}
                style={{ padding: '3px 8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.first_name || 'Contact'} {c.last_name || ''}</option>
                ))}
              </select>

              <button 
                className="btn btn-primary"
                style={{ padding: '3px 10px', fontSize: '0.75rem', marginLeft: '4px', opacity: (!isTencentReady || isCreatingChat) ? 0.5 : 1 }}
                onClick={handleStartChatWithTarget}
                disabled={isCreatingChat || !isTencentReady}
                title={!isTencentReady ? 'Session IM en cours de connexion...' : 'Ouvrir la conversation'}
              >
                <MessageCircle size={13} />
                {isCreatingChat ? 'Ouverture...' : !isTencentReady ? 'Connexion...' : 'Ouvrir le chat'}
              </button>
            </div>
          )}
        </div>

        {/* UI Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${uiMode === 'official' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            onClick={() => setUiMode('official')}
          >
            <Sparkles size={14} />
            Kit Officiel Tencent (TUIUIKit)
          </button>

          <button 
            className={`btn ${uiMode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            onClick={() => setUiMode('custom')}
          >
            <Layout size={14} />
            Interface Custom (Studio UI)
          </button>
        </div>

        <button className="btn btn-danger" onClick={() => handleLogout()} title="Se déconnecter">
          <LogOut size={14} />
          Déconnexion
        </button>
      </header>

      {/* RENDER MODE 1: OFFICIAL TENCENT CLOUD UI KIT */}
      {uiMode === 'official' ? (
        <OfficialUIKitErrorBoundary>
          <div className="official-tui-container" style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#ffffff', position: 'relative' }}>
            {(!isCredentialsReady || !isTencentReady) ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#fff', gap: '16px' }}>
                {!tencentError && <RefreshCw size={36} className="spin-animation" style={{ color: 'var(--primary)' }} />}
                <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                  {tencentError ? "Erreur d'authentification" : !isCredentialsReady ? "Récupération des identifiants..." : "Connexion à Tencent IM..."}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {tencentError ? "Impossible de se connecter." : `Initialisation de la session (${userId})...`}
                </p>
                {tencentError && (
                  <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px', maxWidth: '420px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '4px' }}>
                    {tencentError}
                  </div>
                )}
              </div>
            ) : (
              <UIKitProvider
                key={`${sdkAppId}_${userId}`}
                SDKAppID={sdkAppId}
                userID={userId}
                userSig={userSig}
              >
              <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
                <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', height: '100%', background: '#ffffff', overflowY: 'auto' }}>
                  <ConversationList isSearchHidden={false} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#ffffff', overflow: 'hidden' }}>
                  <Chat
                    PlaceholderEmpty={
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: '#f8fafc', padding: '24px', textAlign: 'center' }}>
                        <MessageSquare size={52} style={{ color: '#6366f1', opacity: 0.7, marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Aucune conversation sélectionnée</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, maxWidth: '380px' }}>
                          Cliquez sur un contact à gauche, ou utilisez &quot;Ouvrir le chat&quot; en haut.
                        </p>
                      </div>
                    }
                  >
                    <ChatHeader />
                    <MessageList />
                    <MessageInput hideSendButton={false} />
                  </Chat>
                </div>
              </div>
            </UIKitProvider>
            )}
          </div>
        </OfficialUIKitErrorBoundary>
      ) : (

        /* RENDER MODE 2: CUSTOM MESSAGING STUDIO UI */
        <main className="chat-layout">
          {/* LEFT SIDEBAR: Contacts List */}
          <aside className="contacts-sidebar">
            <div className="contacts-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary)" />
                  Contacts (`GET /api/chat/contacts`)
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Filtrer mes contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <div className="contacts-scroll">
              {filteredContacts.map((contact) => {
                const isSelected = selectedContact?.id === contact.id;
                const initials = `${contact.first_name?.[0] || ''}${contact.last_name?.[0] || ''}`.toUpperCase();

                return (
                  <div
                    key={contact.id}
                    className={`contact-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="avatar-wrapper">
                      <div className="avatar-circle">{initials || 'U'}</div>
                      {contact.online && <div className="online-dot" />}
                    </div>

                    <div className="contact-details-box">
                      <div className="name">{contact.first_name} {contact.last_name}</div>
                      <div className="snippet">{contact.lastMsg || contact.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* CENTER STAGE: Active Conversation */}
          <section className="chat-stage">
            {selectedContact ? (
              <>
                <div className="chat-stage-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar-wrapper">
                      <div className="avatar-circle">
                        {`${selectedContact.first_name?.[0] || ''}${selectedContact.last_name?.[0] || ''}`.toUpperCase()}
                      </div>
                      {selectedContact.online && <div className="online-dot" />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                        {selectedContact.first_name} {selectedContact.last_name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', textTransform: 'capitalize' }}>
                        ● En ligne — {selectedContact.role || 'Utilisateur'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="chat-messages-container">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${msg.sender === 'me' ? 'sent' : 'received'}`}
                    >
                      <div className="chat-bubble-content">
                        <div>{msg.text}</div>
                        <div className="bubble-meta">
                          <span>{msg.time}</span>
                          {msg.sender === 'me' && <CheckCheck size={13} color="var(--accent-cyan)" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-bar">
                  <button type="button" className="btn btn-secondary btn-icon" title="Joindre un fichier">
                    <Paperclip size={18} />
                  </button>
                  <button type="button" className="btn btn-secondary btn-icon" title="Émojis">
                    <Smile size={18} />
                  </button>

                  <input
                    type="text"
                    className="input-field"
                    placeholder={`Écrire un message à ${selectedContact.first_name}...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />

                  <button type="submit" className="btn btn-primary btn-icon" title="Envoyer">
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <MessageSquare size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h3>Sélectionnez un contact pour commencer à me contacter</h3>
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR: Inspector Panel */}
          <aside className="details-sidebar">
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                Jeton UserSig (`POST /api/chat/usersig`)
              </h4>

              <div className="token-inspect-card">
                {typeof userSig === 'string' ? userSig : JSON.stringify(userSig)}
              </div>

              <button className="btn btn-secondary" onClick={copyUserSig} style={{ width: '100%', marginTop: '10px' }}>
                {copiedSig ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                {copiedSig ? 'Signature copiée !' : 'Copier le UserSig'}
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--primary)" />
                API FastAPI & Tencent IM
              </h4>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li><strong>SDKAppID</strong> : {sdkAppId}</li>
                <li><strong>Expéditeur (Moi)</strong> : {userId}</li>
                <li><strong>Contacts Backend</strong> : {contacts.length} chargé(s)</li>
                <li><strong>Statut Signature</strong> : Authentique & Valide</li>
              </ul>
            </div>
          </aside>
        </main>
      )}
    </div>
  );
}
