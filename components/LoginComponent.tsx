
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, UhyLogo } from './icons';
import { Role } from '../types';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


const LoginComponent: React.FC = () => {
  const { login, isLoading, error, previewLogin } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
            <UhyLogo className="w-56 mb-6" />
          <h2 className="mt-2 text-center text-2xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in using your authorized Google account.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-100 p-3 rounded-md">{error}</p>}

          <div>
            <button
              type="button"
              onClick={login}
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00843D] disabled:bg-gray-100 disabled:cursor-not-allowed shadow"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or
              </span>
            </div>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-600">For preview purposes, you can enter as:</p>
            <div className="flex justify-center space-x-6 mt-2">
                <button
                    onClick={() => previewLogin(Role.EMPLOYEE)}
                    className="font-medium text-[#00843D] hover:text-[#006A4E] hover:underline"
                >
                    Article
                </button>
                <button
                    onClick={() => previewLogin(Role.ADMIN)}
                    className="font-medium text-[#00843D] hover:text-[#006A4E] hover:underline"
                >
                    Admin
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginComponent;