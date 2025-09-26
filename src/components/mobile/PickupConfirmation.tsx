'use client';

import { Button } from '@/components/shared/Button';
import { Success } from '@/components/shared/Success';

interface PickupDetails {
  pickupId: string;
  scanId?: string;
  completedAt: Date;
  items?: Array<{
    name: string;
    quantity: number;
    price?: number;
  }>;
  totalAmount?: number;
  estimatedTime?: number;
}

interface PickupConfirmationProps {
  pickupDetails: PickupDetails;
  onStartNew: () => void;
  onViewReceipt?: () => void;
}

export function PickupConfirmation({ 
  pickupDetails, 
  onStartNew, 
  onViewReceipt 
}: PickupConfirmationProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Success header */}
      <div className="text-center mb-6">
        <Success 
          title="Pickup Complete!"
          message="Your items have been successfully retrieved. Thank you for using our automated store!"
        />
      </div>

      {/* Pickup details card */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Pickup Details</h4>
        
        <div className="space-y-2 text-sm">
          {/* Pickup ID */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pickup ID:</span>
            <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded text-xs">
              {pickupDetails.pickupId}
            </span>
          </div>

          {/* Scan ID */}
          {pickupDetails.scanId && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Scan ID:</span>
              <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded text-xs">
                {pickupDetails.scanId}
              </span>
            </div>
          )}

          {/* Completion time */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Completed:</span>
            <span className="text-gray-900">
              {formatTime(pickupDetails.completedAt)} on {formatDate(pickupDetails.completedAt)}
            </span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="text-green-600 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          </div>

          {/* Processing time */}
          {pickupDetails.estimatedTime && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Time:</span>
              <span className="text-gray-900">
                {pickupDetails.estimatedTime}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Items summary (if available) */}
      {pickupDetails.items && pickupDetails.items.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Items Retrieved</h4>
          <div className="space-y-2">
            {pickupDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                {item.price && (
                  <span className="text-gray-900 font-medium">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
            ))}
            
            {pickupDetails.totalAmount && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    ${pickupDetails.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-3">
        {onViewReceipt && (
          <Button
            onClick={onViewReceipt}
            variant="outline"
            className="w-full"
          >
            View Receipt
          </Button>
        )}
        
        <Button
          onClick={onStartNew}
          className="w-full"
        >
          Start New Pickup
        </Button>
      </div>

      {/* Additional info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <p className="text-blue-800 font-medium mb-1">
              Pickup Instructions
            </p>
            <p className="text-blue-700">
              Please collect your items from the designated pickup area. 
              If you need assistance, contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}