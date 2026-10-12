/**
 * Real-Time Collaborative Code Interview Platform
 * Client Authentication & User Account Service
 * Zero Emojis - Zero Em Dashes
 */

class AuthService {
  constructor() {
    this.token = localStorage.getItem('codeinterview_auth_token') || null;
    this.user = null;
    try {
      const cached = localStorage.getItem('codeinterview_user');
      if (cached) this.user = JSON.parse(cached);
    } catch (_) {}

    this.listeners = [];
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Header triggers
    this.authHeaderBtn = document.getElementById('header-auth-btn');
    this.authHeaderLabel = document.getElementById('header-auth-label');
    this.userDropdown = document.getElementById('auth-user-dropdown');
    this.dropdownUserName = document.getElementById('dropdown-user-name');
    this.dropdownUserEmail = document.getElementById('dropdown-user-email');
    this.dropdownStatSolved = document.getElementById('dropdown-stat-solved');
    this.dropdownStatStreak = document.getElementById('dropdown-stat-streak');
    this.dropdownMenuPageBtn = document.getElementById('dropdown-menu-page-btn');
    this.dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');

    // Modal elements
    this.modal = document.getElementById('auth-modal');
    this.closeModalBtn = document.getElementById('close-auth-modal-btn');
    this.tabLogin = document.getElementById('tab-login');
    this.tabRegister = document.getElementById('tab-register');
    this.formLogin = document.getElementById('form-login');
    this.formRegister = document.getElementById('form-register');
    this.alertBox = document.getElementById('auth-alert');
    this.guestBtn = document.getElementById('btn-guest-demo');

    // Input fields
    this.loginUsernameInput = document.getElementById('login-username');
    this.loginPasswordInput = document.getElementById('login-password');
    this.regUsernameInput = document.getElementById('register-username');
    this.regDisplayNameInput = document.getElementById('register-display-name');
    this.regEmailInput = document.getElementById('register-email');
    this.regPasswordInput = document.getElementById('register-password');
    this.regConfirmPasswordInput = document.getElementById('register-confirm-password');
  }

  bindEvents() {
    // Header button trigger
    if (this.authHeaderBtn) {
      this.authHeaderBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isAuthenticated()) {
          this.toggleUserDropdown();
        } else {
          this.openModal('login');
        }
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (this.userDropdown && !this.userDropdown.hidden && !this.userDropdown.contains(e.target)) {
        this.userDropdown.hidden = true;
      }
    });

    // Close modal
    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    // Modal Tabs
    if (this.tabLogin && this.tabRegister) {
      this.tabLogin.addEventListener('click', () => this.switchTab('login'));
      this.tabRegister.addEventListener('click', () => this.switchTab('register'));
    }

    // Form Submissions
    if (this.formLogin) {
      this.formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLoginSubmit();
      });
    }

    if (this.formRegister) {
      this.formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegisterSubmit();
      });
    }

    // 1-Click Guest / Demo login
    if (this.guestBtn) {
      this.guestBtn.addEventListener('click', () => this.handleGuestLogin());
    }

    // Dropdown Actions
    if (this.dropdownLogoutBtn) {
      this.dropdownLogoutBtn.addEventListener('click', () => this.logout());
    }

    if (this.dropdownMenuPageBtn) {
      this.dropdownMenuPageBtn.addEventListener('click', () => {
        if (this.userDropdown) this.userDropdown.hidden = true;
        if (window.menuService) {
          window.menuService.showMenuView();
        }
      });
    }
  }

  onAuthChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notifyListeners(data) {
    for (const listener of this.listeners) {
      try {
        listener(data);
      } catch (err) {
        console.error('[Auth] Listener callback error:', err);
      }
    }
  }

  isAuthenticated() {
    return !!(this.token && this.user);
  }

  getCurrentUsername() {
    if (this.user && this.user.username) {
      return this.user.username;
    }
    return 'masiko';
  }

  async init() {
    if (this.token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            this.user = data.user;
            localStorage.setItem('codeinterview_user', JSON.stringify(this.user));
            this.updateUI();
            this.notifyListeners({ user: this.user, progress: data.progress });
            return;
          }
        }
      } catch (err) {
        console.warn('[Auth] Session validation failed:', err.message);
      }
      // If token expired or invalid
      this.token = null;
      this.user = null;
      localStorage.removeItem('codeinterview_auth_token');
      localStorage.removeItem('codeinterview_user');
    }

    this.updateUI();
    this.notifyListeners({ user: null });
  }

  updateUI() {
    if (!this.authHeaderLabel) return;

    if (this.isAuthenticated()) {
      const displayName = this.user.displayName || this.user.username;
      this.authHeaderLabel.textContent = displayName;
      this.authHeaderBtn.classList.add('authenticated');
      this.authHeaderBtn.title = `Signed in as @${this.user.username}. Click for account options.`;

      if (this.dropdownUserName) {
        this.dropdownUserName.textContent = displayName;
      }
      if (this.dropdownUserEmail) {
        this.dropdownUserEmail.textContent = this.user.email || `@${this.user.username}`;
      }
    } else {
      this.authHeaderLabel.textContent = 'Sign In';
      this.authHeaderBtn.classList.remove('authenticated');
      this.authHeaderBtn.title = 'Sign in or register a new account';
      if (this.userDropdown) {
        this.userDropdown.hidden = true;
      }
    }
  }

  updateStatsInDropdown(solvedCount, streakDays) {
    if (this.dropdownStatSolved) {
      this.dropdownStatSolved.textContent = solvedCount.toString();
    }
    if (this.dropdownStatStreak) {
      this.dropdownStatStreak.textContent = `${streakDays} ${streakDays === 1 ? 'Day' : 'Days'}`;
    }
  }

  toggleUserDropdown() {
    if (!this.userDropdown) return;
    this.userDropdown.hidden = !this.userDropdown.hidden;
  }

  openModal(tab = 'login') {
    if (!this.modal) return;
    this.clearAlert();
    this.switchTab(tab);
    this.modal.hidden = false;
    if (tab === 'login' && this.loginUsernameInput) {
      this.loginUsernameInput.focus();
    } else if (tab === 'register' && this.regUsernameInput) {
      this.regUsernameInput.focus();
    }
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.hidden = true;
    this.clearAlert();
  }

  switchTab(tab) {
    this.clearAlert();
    if (tab === 'login') {
      if (this.tabLogin) this.tabLogin.classList.add('active');
      if (this.tabRegister) this.tabRegister.classList.remove('active');
      if (this.formLogin) this.formLogin.hidden = false;
      if (this.formRegister) this.formRegister.hidden = true;
    } else {
      if (this.tabRegister) this.tabRegister.classList.add('active');
      if (this.tabLogin) this.tabLogin.classList.remove('active');
      if (this.formRegister) this.formRegister.hidden = false;
      if (this.formLogin) this.formLogin.hidden = true;
    }
  }

  showAlert(message, type = 'error') {
    if (!this.alertBox) return;
    this.alertBox.className = `auth-alert ${type}`;
    this.alertBox.textContent = message;
    this.alertBox.hidden = false;
  }

  clearAlert() {
    if (!this.alertBox) return;
    this.alertBox.hidden = true;
    this.alertBox.textContent = '';
  }

  async handleLoginSubmit() {
    const username = (this.loginUsernameInput?.value || '').trim();
    const password = this.loginPasswordInput?.value || '';

    if (!username || !password) {
      return this.showAlert('Please enter both your username and password.');
    }

    const submitBtn = document.getElementById('btn-submit-login');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('codeinterview_auth_token', this.token);
      localStorage.setItem('codeinterview_user', JSON.stringify(this.user));

      this.updateUI();
      this.closeModal();
      this.notifyListeners({ user: this.user, progress: data.progress });

      if (window.showToast) {
        window.showToast(`Signed in as ${this.user.displayName || this.user.username}`);
      }
    } catch (err) {
      this.showAlert(err.message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    }
  }

  async handleRegisterSubmit() {
    const username = (this.regUsernameInput?.value || '').trim();
    const displayName = (this.regDisplayNameInput?.value || '').trim();
    const email = (this.regEmailInput?.value || '').trim();
    const password = this.regPasswordInput?.value || '';
    const confirmPassword = this.regConfirmPasswordInput?.value || '';

    if (!username) {
      return this.showAlert('Please provide a username.');
    }

    if (username.length < 3 || username.length > 30) {
      return this.showAlert('Username must be between 3 and 30 characters.');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return this.showAlert('Username may only contain letters, numbers, hyphens, and underscores.');
    }

    if (!password || password.length < 4) {
      return this.showAlert('Password must be at least 4 characters long.');
    }

    if (password !== confirmPassword) {
      return this.showAlert('Passwords do not match. Please re-type.');
    }

    const submitBtn = document.getElementById('btn-submit-register');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          displayName,
          email,
          password
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('codeinterview_auth_token', this.token);
      localStorage.setItem('codeinterview_user', JSON.stringify(this.user));

      this.updateUI();
      this.closeModal();
      this.notifyListeners({ user: this.user, progress: data.progress });

      if (window.showToast) {
        window.showToast(`Account created for ${this.user.displayName || this.user.username}!`);
      }
    } catch (err) {
      this.showAlert(err.message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }
  }

  async handleGuestLogin() {
    // Attempt login with default demo account
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'masiko', password: 'demo123' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('codeinterview_auth_token', this.token);
        localStorage.setItem('codeinterview_user', JSON.stringify(this.user));
        this.updateUI();
        this.closeModal();
        this.notifyListeners({ user: this.user, progress: data.progress });
        if (window.showToast) window.showToast('Signed in with Demo Account (masiko)');
        return;
      }
    } catch (_) {}

    // Fallback: create an instant guest session
    const guestUser = `guest_${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: guestUser,
          displayName: `Candidate ${guestUser.split('_')[1]}`,
          password: 'demo123'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('codeinterview_auth_token', this.token);
        localStorage.setItem('codeinterview_user', JSON.stringify(this.user));
        this.updateUI();
        this.closeModal();
        this.notifyListeners({ user: this.user, progress: data.progress });
        if (window.showToast) window.showToast(`Signed in as ${this.user.displayName}`);
      }
    } catch (err) {
      this.showAlert(`Guest access error: ${err.message}`);
    }
  }

  async logout() {
    if (this.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: this.token })
        });
      } catch (_) {}
    }

    this.token = null;
    this.user = null;
    localStorage.removeItem('codeinterview_auth_token');
    localStorage.removeItem('codeinterview_user');

    if (this.userDropdown) {
      this.userDropdown.hidden = true;
    }

    this.updateUI();
    this.notifyListeners({ user: null });

    if (window.showToast) {
      window.showToast('Signed out of session');
    }
  }
}

// Global singleton instance
window.authService = new AuthService();
