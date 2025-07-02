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
          <h1 className="text-3xl font-bold text-white">Application Submitted Successfully!</h1>
        </div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <FiMail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Thank you for applying to join our Professional Talent Network. 
            Your profile is currently under review by our team.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded mb-6">
            <p className="text-blue-700 font-medium">
              <span className="font-semibold">Next Steps:</span> You will receive an email notification 
              regarding your application status within 72 hours.
            </p>
          </div>
          
          <p className="text-gray-600">
            If you have any questions, please contact our support team at 
            <a href="mailto:support@talentnetwork.com" className="text-blue-600 hover:underline ml-1">
              support@talentnetwork.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;