import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import C from '../styles/colors';

export default function ActivateAccountPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { activate } = useAuth();
  const navigate = useNavigate();

  const activationToken = searchParams.get('token');

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!activationToken) {
      setError('Invalid activation link. Missing token.');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      await activate(activationToken, password);
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Account activation failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: C.bg }}
    >
      {/* Sidebar */}
      <div
        className="hidden lg:flex flex-col justify-center items-center w-1/3 p-12"
        style={{ backgroundColor: C.sidebar }}
      >
        <div className="text-center">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: C.accent }}
          >
            Vdrive
          </h1>
          <p className="text-xl" style={{ color: C.textLight }}>
            EV Charging & Parking Platform
          </p>
        </div>
      </div>

      {/* Activation Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: C.text }}
          >
            Activate Account
          </h2>
          <p className="mb-8" style={{ color: C.textMid }}>
            Set your password to get started
          </p>

          {!activationToken ? (
            <div
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: C.redBg,
                color: C.red,
                border: `1px solid ${C.red}`,
              }}
            >
              Invalid activation link. Please check the link in your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: C.text }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border transition"
                  style={{
                    borderColor: C.border,
                    color: C.text,
                  }}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs mt-2" style={{ color: C.textLight }}>
                  Minimum 8 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: C.text }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border transition"
                  style={{
                    borderColor: C.border,
                    color: C.text,
                  }}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="p-4 rounded-lg text-sm"
                  style={{
                    backgroundColor: C.redBg,
                    color: C.red,
                    border: `1px solid ${C.red}`,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-semibold transition disabled:opacity-50"
                style={{
                  backgroundColor: C.brand,
                  color: C.white,
                }}
              >
                {isLoading ? 'Activating...' : 'Activate Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
