import React from "react";
import { FiCheckCircle, FiMail } from "react-icons/fi";

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
          <div className="inline-flex items-center justify-center bg-white rounded-full p-3 mb-4 shadow-md">
            <FiCheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Congratulations and Welcome to SkillBridge!
          </h1>
        </div>

        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <FiMail className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We’re excited to have you on board. Your profile has been successfully completed and you’re now officially part of the SkillBridge professional network.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded mb-6">
            <p className="text-blue-700 font-medium">
              <span className="font-semibold">Next Steps:</span> You can now connect with clients and start earning. Just buy coins to begin your journey and unlock opportunities!
            </p>
          </div>

          <p className="text-gray-600">
            If you have any questions or need assistance, feel free to reach out to us at
            <a href="mailto:support@skillbridge.com" className="text-blue-600 hover:underline ml-1">
              support@skillbridge.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
