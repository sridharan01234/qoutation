import { Dialog, Transition, DialogPanel, TransitionChild, DialogTitle } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { format } from 'date-fns';
import { Quotation, Activity, Attachment, QuotationItem } from '../types/index';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NotificationService } from '../lib/services/NotificationService';

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
    creator: {
      name: string;
      email: string;
    };
  } | null;
  onClose: () => void;
  isAdmin?: boolean;
  onStatusChange?: () => void;
}

export default function QuotationDetailsModal({
  quotation,
  onClose,
  isAdmin = true,
  onStatusChange,
}: QuotationDetailsModalProps) {
  const [loading, setLoading] = useState(false);

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

  const handleAction = async (action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/admin/quotations/${quotation.id}/status`,
        { action },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.success) {
        const notificationService = new NotificationService(
          (data) => {
            console.log("Notification sent:", data);
            onStatusChange?.();
            onClose();
          },
          (error) => {
            console.error("Notification error:", error);
            onStatusChange?.();
            onClose();
          }
        );

        try {
          await notificationService.sendNotification({
            creatorId: quotation.creator.id,
            type: "QUOTATION_STATUS_CHANGE",
            title: `Quotation ${quotation.quotationNumber} ${action}d`,
            message: `Your quotation ${quotation.quotationNumber} has been ${action}d by the admin.`,
            data: {
              quotationId: quotation.id,
              quotationNumber: quotation.quotationNumber,
              status: action === 'approve' ? 'APPROVED' : 'REJECTED',
            },
          });
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
          // Continue with success flow even if notification fails
          toast.success(`Quotation ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
          onStatusChange?.();
          onClose();
        }
      } else {
        throw new Error(response.data.error || 'Failed to process quotation');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={!!quotation} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
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
                      statusColors[quotation.status]
                    }`}
                  >
                    {quotation.status}
                  </span>
                </DialogTitle>

                <div className="mt-4 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created By</h4>
                      <p className="mt-1">
                        {quotation.creator.name}
                        <br />
                        <span className="text-sm text-gray-500">{quotation.creator.email}</span>
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
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: quotation.currency,
                                }).format(item.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  {isAdmin && quotation.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleAction('reject')}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleAction('approve')}
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Approve'}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}