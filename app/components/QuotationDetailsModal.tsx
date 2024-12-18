// components/QuotationDetailsModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { format } from 'date-fns';
import { QuotationStatus, PaymentTerms } from '@prisma/client';
import { Quotation, Activity, Attachment, QuotationItem } from '../types/index';

interface QuotationDetailsModalProps {
  quotation: Quotation & {
    items: (QuotationItem & {
      product: {
        name: string;
        sku: string;
      };
    })[];
    activities: Activity[];
    attachments: Attachment[];
    user: {
      name: string;
      email: string;
    };
  } | null;
  onClose: () => void;
}

export default function QuotationDetailsModal({
  quotation,
  onClose,
}: QuotationDetailsModalProps) {
  if (!quotation) return null;

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-orange-100 text-orange-800',
    CONVERTED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };

  return (
    <Transition appear show={!!quotation} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Quotation Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {quotation.quotationNumber}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[quotation.status as QuotationStatus]
                    }`}
                  >
                    {quotation.status}
                  </span>
                </Dialog.Title>

                <div className="mt-4 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created By</h4>
                      <p className="mt-1">
                        {quotation.user.name}
                        <br />
                        <span className="text-sm text-gray-500">{quotation.user.email}</span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Dates</h4>
                      <p className="mt-1">
                        Created: {format(new Date(quotation.date), 'PPP')}
                        <br />
                        Valid Until: {format(new Date(quotation.validUntil), 'PPP')}
                      </p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Discount
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tax
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {quotation.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.product.sku}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: quotation.currency,
                                }).format(item.unitPrice)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                {item.discount}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                {(item.tax * 100).toFixed(1)}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: quotation.currency,
                                }).format(item.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                              Subtotal
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-900">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: quotation.currency,
                              }).format(quotation.subtotal)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                              Tax ({(quotation.taxRate * 100).toFixed(1)}%)
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-900">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: quotation.currency,
                              }).format(quotation.taxAmount)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                              Discount
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-900">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: quotation.currency,
                              }).format(quotation.discount)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                              Shipping
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-900">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: quotation.currency,
                              }).format(quotation.shippingCost)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                              Total
                            </td>
                            <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: quotation.currency,
                              }).format(quotation.totalAmount)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                        {quotation.notes || 'No notes'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Terms</h4>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                        {quotation.terms || 'No terms'}
                      </p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {quotation.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Attachments
                      </h4>
                      <ul className="divide-y divide-gray-200">
                        {quotation.attachments.map((attachment) => (
                          <li key={attachment.id} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="ml-2 flex-1 w-0 truncate">
                                {attachment.filename}
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <a
                                href={attachment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-500"
                              >
                                Download
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Activity Log */}
                  {quotation.activities.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Activity Log
                      </h4>
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {quotation.activities.map((activity, activityIdx) => (
                            <li key={activity.id}>
                              <div className="relative pb-8">
                                {activityIdx !== quotation.activities.length - 1 ? (
                                  <span
                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                      <svg
                                        className="h-5 w-5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        {activity.description}{' '}
                                        <span className="font-medium text-gray-900">
                                          {activity.type}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                      {format(new Date(activity.createdAt), 'PPp')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
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
