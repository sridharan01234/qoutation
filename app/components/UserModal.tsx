import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { UserProfile } from "../../types/user";
import {
  FiX,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiGlobe,
  FiLink,
} from "react-icons/fi";
import { format } from "date-fns";

interface UserModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}


export default function UserModal({ user, isOpen, onClose }: UserModalProps) {  
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="absolute right-6 top-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Header */}
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                        <FiUser className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                        user.isActive ? "bg-green-400" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.displayName ||
                        `${user.firstName} ${user.lastName}` ||
                        user.name}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="flex items-center text-sm font-medium text-gray-500">
                      <FiUser className="mr-2 h-4 w-4" />
                      Personal Information
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-sm text-gray-900">{`${
                          user.firstName || ""
                        } ${user.lastName || ""}`}</p>
                      </div>
                      {user.gender && (
                        <div>
                          <p className="text-xs text-gray-500">Gender</p>
                          <p className="text-sm text-gray-900">{user.gender}</p>
                        </div>
                      )}
                      {user.dateOfBirth && (
                        <div>
                          <p className="text-xs text-gray-500">Date of Birth</p>
                          <p className="text-sm text-gray-900">
                            {format(new Date(user.dateOfBirth), "MMMM d, yyyy")}
                          </p>
                        </div>
                      )}
                      {user.phoneNumber && (
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm text-gray-900">
                            {user.phoneNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h4 className="flex items-center text-sm font-medium text-gray-500">
                      <FiBriefcase className="mr-2 h-4 w-4" />
                      Business Information
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                      {user.company && (
                        <div>
                          <p className="text-xs text-gray-500">Company</p>
                          <p className="text-sm text-gray-900">
                            {user.company}
                          </p>
                        </div>
                      )}
                      {user.jobTitle && (
                        <div>
                          <p className="text-xs text-gray-500">Job Title</p>
                          <p className="text-sm text-gray-900">
                            {user.jobTitle}
                          </p>
                        </div>
                      )}
                      {user.department && (
                        <div>
                          <p className="text-xs text-gray-500">Department</p>
                          <p className="text-sm text-gray-900">
                            {user.department}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h4 className="flex items-center text-sm font-medium text-gray-500">
                      <FiMapPin className="mr-2 h-4 w-4" />
                      Address
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                      {user.address && (
                        <div>
                          <p className="text-xs text-gray-500">
                            Street Address
                          </p>
                          <p className="text-sm text-gray-900">
                            {user.address}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {user.city && (
                          <div>
                            <p className="text-xs text-gray-500">City</p>
                            <p className="text-sm text-gray-900">{user.city}</p>
                          </div>
                        )}
                        {user.state && (
                          <div>
                            <p className="text-xs text-gray-500">State</p>
                            <p className="text-sm text-gray-900">
                              {user.state}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {user.country && (
                          <div>
                            <p className="text-xs text-gray-500">Country</p>
                            <p className="text-sm text-gray-900">
                              {user.country}
                            </p>
                          </div>
                        )}
                        {user.postalCode && (
                          <div>
                            <p className="text-xs text-gray-500">Postal Code</p>
                            <p className="text-sm text-gray-900">
                              {user.postalCode}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preferences & Social */}
                  <div className="space-y-4">
                    <h4 className="flex items-center text-sm font-medium text-gray-500">
                      <FiGlobe className="mr-2 h-4 w-4" />
                      Preferences & Social
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Language</p>
                          <p className="text-sm text-gray-900">
                            {user.language}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Timezone</p>
                          <p className="text-sm text-gray-900">
                            {user.timezone}
                          </p>
                        </div>
                      </div>
                      {(user.linkedinUrl ||
                        user.twitterUrl ||
                        user.websiteUrl) && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 mb-2">
                            Social Links
                          </p>
                          <div className="flex space-x-2">
                            {user.linkedinUrl && (
                              <a
                                href={user.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FiLink className="h-4 w-4" />
                              </a>
                            )}
                            {user.twitterUrl && (
                              <a
                                href={user.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FiLink className="h-4 w-4" />
                              </a>
                            )}
                            {user.websiteUrl && (
                              <a
                                href={user.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FiLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
