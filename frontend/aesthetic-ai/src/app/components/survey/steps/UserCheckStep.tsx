import React from "react";
import { UserIcon } from "../shared/Icons";

interface UserCheckStepProps {
  username: string;
  setUsername: (username: string) => void;
  handleUsernameSubmit: () => void;
}

export const UserCheckStep: React.FC<UserCheckStepProps> = ({
  username,
  setUsername,
  handleUsernameSubmit,
}) => (
  <div className="space-y-6">
    <div className="text-center mb-8 select-none">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-brown-600 rounded-full flex items-center justify-center mx-auto mb-4 select-none">
        <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
      </div>
      <h3 className="text-lg sm:text-xl font-serif font-semibold text-brown-900 mb-2 select-none">
        Welcome to Your Skin Journey
      </h3>
      <p className="text-brown-600 font-body select-none text-base px-4">
        Enter your username to begin or continue your personalized analysis
      </p>
    </div>

    <div className="max-w-md mx-auto">
      <label className="block text-base font-medium text-brown-900 mb-3 select-none">
        Username
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-4 border border-nude-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base select-none caret-transparent focus:caret-current"
        placeholder="Enter your username"
        onKeyPress={(e) => e.key === "Enter" && handleUsernameSubmit()}
      />
      <button
        onClick={handleUsernameSubmit}
        disabled={!username.trim()}
        className="w-full mt-4 bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none text-base min-h-[56px] touch-manipulation"
      >
        Continue
      </button>
    </div>
  </div>
);
