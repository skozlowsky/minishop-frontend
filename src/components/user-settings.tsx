import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { User, X } from 'lucide-react';

interface UserSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
    onUpdateEmail: (email: string) => void;
}

export function UserSettings({ isOpen, onClose, userEmail, onUpdateEmail }: UserSettingsProps) {
    const [email, setEmail] = useState(userEmail);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsSaving(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            localStorage.setItem('userEmail', email);
            onUpdateEmail(email);
            onClose();
        } catch {
            setError('Failed to update email. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <div className="flex items-center justify-between">
                                    <Dialog.Title as="div" className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-600" />
                                        <h3 className="text-lg font-medium text-gray-900">
                                            User Settings
                                        </h3>
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setError('');
                                                }}
                                                className={`mt-1 block w-full rounded-md shadow-sm text-sm
                          ${error
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="your@email.com"
                                            />
                                            {error && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {error}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between space-x-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving || !email || email === userEmail}
                                                className="flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div className="mt-4 text-sm text-gray-500">
                                    <p>This email will be used for order notifications and tracking.</p>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}