/**
 * SEVAMITRA - Reactive Notification Bell Component
 * Problem Statement ID: SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import { Bell, Check, ExternalLink, MessageSquare } from 'lucide-react';

interface NotificationBellProps {
  onNavigate: (path: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const state = getStoreState();
  const currentUser = store.getCurrentUser();

  const userNotifications = state.notifications.filter(
    (n) => n.userId === state.currentUserId
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const handleItemClick = (notifId: string, linkTarget?: string) => {
    store.markNotificationAsRead(notifId);
    setIsOpen(false);
    if (linkTarget) {
      onNavigate(linkTarget);
    }
  };

  const handleMarkAllRead = () => {
    if (currentUser) {
      store.markAllNotificationsAsRead(currentUser.id);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {userNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <MessageSquare className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                No notifications yet.
              </div>
            ) : (
              userNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif.id, notif.linkTarget)}
                  className={`p-3 text-xs transition cursor-pointer hover:bg-slate-50 flex items-start justify-between gap-2 ${
                    !notif.isRead ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{notif.message}</p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {notif.linkTarget && (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
