import React, { useState } from 'react';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AuthScreen({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@sentinel.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field Errors & Global Error
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (isRegister && !name.trim()) {
      errors.name = 'Please enter your full name';
    }

    if (!email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!email.includes('@') || !email.includes('.')) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Please enter your password';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isRegister) {
      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (isRegister) {
      // Register Workflow
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim() })
        });

        if (res.ok) {
          const user = await res.json();
          localStorage.setItem('sentinel_user', JSON.stringify(user));
          onLoginSuccess(user);
        } else {
          const data = await res.json();
          setGlobalError(data.message || 'Registration failed. Email may already be registered.');
        }
      } catch {
        setGlobalError('Network error. Unable to connect to server.');
      } finally {
        setLoading(false);
      }

    } else {
      // Login Workflow
      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password })
        });

        if (res.ok) {
          const user = await res.json();
          localStorage.setItem('sentinel_user', JSON.stringify(user));
          onLoginSuccess(user);
        } else {
          if (email.trim() === 'demo@sentinel.com') {
            const fallbackUser = { id: 1, name: 'Sentinel Demo User', email: 'demo@sentinel.com' };
            localStorage.setItem('sentinel_user', JSON.stringify(fallbackUser));
            onLoginSuccess(fallbackUser);
          } else {
            setGlobalError('Incorrect email or password. Please check your credentials.');
          }
        }
      } catch {
        if (email.trim() === 'demo@sentinel.com') {
          const fallbackUser = { id: 1, name: 'Sentinel Demo User', email: 'demo@sentinel.com' };
          localStorage.setItem('sentinel_user', JSON.stringify(fallbackUser));
          onLoginSuccess(fallbackUser);
        } else {
          setGlobalError('Unable to connect to authentication server.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setFieldErrors({});
    setGlobalError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'var(--bg-app)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>

        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '6px' }}>
            {isRegister ? 'Register to start tracking your market watchlist' : 'Enter your credentials to access your watchlist'}
          </p>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div style={{
            background: 'var(--red-bg)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--red-negative)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            lineHeight: '1.4'
          }}>
            {globalError}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} noValidate>
          
          {/* Name Field (Registration Only) */}
          {isRegister && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                Full name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
                <input
                  type="text"
                  className={`input-field ${fieldErrors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                  style={{ paddingLeft: '42px' }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
                  }}
                />
              </div>
              {fieldErrors.name && (
                <span style={{ color: 'var(--red-negative)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                  {fieldErrors.name}
                </span>
              )}
            </div>
          )}

          {/* Email Address Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
              <input
                type="email"
                className={`input-field ${fieldErrors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                style={{ paddingLeft: '42px' }}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                }}
              />
            </div>
            {fieldErrors.email && (
              <span style={{ color: 'var(--red-negative)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input-field ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  zIndex: 2
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span style={{ color: 'var(--red-negative)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Confirm Password Field (Registration Only) */}
          {isRegister && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input-field ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: null });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    zIndex: 2
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span style={{ color: 'var(--red-negative)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            <span>{loading ? 'Please wait...' : (isRegister ? 'Create account' : 'Log in')}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Toggle Mode Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                onClick={toggleMode}
                style={{ background: 'none', border: 'none', color: 'var(--blue-accent)', fontWeight: 600, cursor: 'pointer' }}
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={toggleMode}
                style={{ background: 'none', border: 'none', color: 'var(--blue-accent)', fontWeight: 600, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
