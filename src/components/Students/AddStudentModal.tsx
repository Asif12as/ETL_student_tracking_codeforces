import React, { useState } from 'react';
import { X, User, Mail, Phone, Code, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { codeforcesAPI } from '../../services/api';
import { generateRandomAvatar } from '../../utils/mockData';
import { toast } from 'react-hot-toast';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: {
    name: string;
    email: string;
    phone: string;
    codeforcesHandle: string;
    avatar: string;
  }) => Promise<void>;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [handleVerified, setHandleVerified] = useState<boolean | null>(null);
  const [verifiedUserInfo, setVerifiedUserInfo] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.codeforcesHandle.trim()) {
      newErrors.codeforcesHandle = 'Codeforces handle is required';
    }

    if (handleVerified === false) {
      newErrors.codeforcesHandle = 'Please verify the Codeforces handle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verifyCodeforcesHandle = async () => {
    if (!formData.codeforcesHandle.trim()) {
      setErrors(prev => ({ ...prev, codeforcesHandle: 'Please enter a Codeforces handle' }));
      return;
    }

    setIsVerifying(true);
    setHandleVerified(null);
    setVerifiedUserInfo(null);

    try {
      const response = await codeforcesAPI.verifyHandle(formData.codeforcesHandle);
      
      if (response.data.valid) {
        setHandleVerified(true);
        setVerifiedUserInfo(response.data.userInfo);
        setErrors(prev => ({ ...prev, codeforcesHandle: '' }));
        toast.success('Codeforces handle verified successfully!');
      } else {
        setHandleVerified(false);
        setErrors(prev => ({ ...prev, codeforcesHandle: 'Invalid Codeforces handle' }));
      }
    } catch (error) {
      setHandleVerified(false);
      setErrors(prev => ({ ...prev, codeforcesHandle: 'Codeforces handle not found' }));
      toast.error('Codeforces handle not found');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset handle verification when handle changes
    if (field === 'codeforcesHandle') {
      setHandleVerified(null);
      setVerifiedUserInfo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        avatar: generateRandomAvatar()
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: ''
      });
      setHandleVerified(null);
      setVerifiedUserInfo(null);
      setErrors({});
      
      onClose();
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: ''
      });
      setHandleVerified(null);
      setVerifiedUserInfo(null);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Student</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter student's full name"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Codeforces Handle Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Code className="h-4 w-4 inline mr-2" />
              Codeforces Handle
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.codeforcesHandle}
                onChange={(e) => handleInputChange('codeforcesHandle', e.target.value)}
                placeholder="Enter Codeforces handle"
                className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.codeforcesHandle ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={verifyCodeforcesHandle}
                disabled={isVerifying || isSubmitting || !formData.codeforcesHandle.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : handleVerified === true ? (
                  <CheckCircle className="h-4 w-4" />
                ) : handleVerified === false ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm">Verify</span>
                )}
              </button>
            </div>
            
            {errors.codeforcesHandle && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.codeforcesHandle}</p>
            )}
            
            {/* Verified User Info */}
            {handleVerified === true && verifiedUserInfo && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center text-green-800 dark:text-green-200 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="font-medium">Verified!</span>
                </div>
                <div className="mt-1 text-sm text-green-700 dark:text-green-300">
                  <p><strong>Handle:</strong> {verifiedUserInfo.handle}</p>
                  {verifiedUserInfo.firstName && verifiedUserInfo.lastName && (
                    <p><strong>Name:</strong> {verifiedUserInfo.firstName} {verifiedUserInfo.lastName}</p>
                  )}
                  {verifiedUserInfo.rating && (
                    <p><strong>Rating:</strong> {verifiedUserInfo.rating} ({verifiedUserInfo.rank})</p>
                  )}
                  {verifiedUserInfo.country && (
                    <p><strong>Country:</strong> {verifiedUserInfo.country}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || handleVerified !== true}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Student</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;