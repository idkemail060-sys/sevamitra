/**
 * SEVAMITRA - Rating & Feedback Modal
 * Problem Statement ID: SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { Booking } from '../../types';
import { store } from '../../services/store';
import { X, Star, CheckCircle2, ThumbsUp } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onRatingSubmitted: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  booking,
  onClose,
  onRatingSubmitted,
}) => {
  if (!isOpen || !booking) return null;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitRating(
      booking.id,
      rating,
      review || 'Great service and prompt arrival. Highly recommended cooperative professional!'
    );
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onRatingSubmitted();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Rate & Review Service</h3>
            <p className="text-xs text-slate-400">Booking: {booking.bookingCode}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Thank You!</h4>
            <p className="text-xs text-slate-600">
              Your rating has been recorded and will empower {booking.workerName}’s cooperative profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500">How was your experience with</p>
              <h4 className="font-bold text-slate-900 text-base">{booking.workerName}</h4>
              <p className="text-xs font-medium text-emerald-700">{booking.serviceName}</p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center items-center gap-2 pt-1 pb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-center text-xs font-semibold text-slate-700">
              {rating === 5 && '🌟 Outstanding & Courteous'}
              {rating === 4 && '👍 Very Good Quality'}
              {rating === 3 && '👌 Satisfactory Service'}
              {rating === 2 && '⚠️ Needs Improvement'}
              {rating === 1 && '👎 Unsatisfactory'}
            </div>

            {/* Review Comment */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Share your feedback with the cooperative community
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Punctuality, quality of repair, courteous conduct..."
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
            >
              Submit Verified Rating
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
