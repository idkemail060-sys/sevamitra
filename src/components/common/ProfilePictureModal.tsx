/**
 * SEVAMITRA - User Profile Picture Upload & Camera Capture Modal
 * Supports:
 * 1. Native Browser Camera API (Live webcam stream, face guide, camera flip, shutter countdown, frame capture)
 * 2. Device Image Upload & Drag-and-Drop (Instant preview & client-side compression to square WebP/JPEG)
 * 3. Cooperative Preset Avatars & Placeholders (Artisans, household members, cooperative vector avatars)
 * 4. Image URL input
 * 5. Direct synchronization to Supabase User Metadata and Database Tables
 */

import React, { useState, useRef, useEffect } from 'react';
import { store, getStoreState } from '../../services/store';
import { updateUserProfileMetadataInSupabase } from '../../services/supabaseService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  RotateCcw,
  Check,
  X,
  Trash2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Link2,
  User,
} from 'lucide-react';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (newAvatarUrl: string) => void;
}

type TabMode = 'camera' | 'upload' | 'presets' | 'url';

// Curated cooperative-themed avatar presets
const PRESET_AVATARS = [
  {
    id: 'preset-1',
    label: 'Plumbing & Artisan',
    category: 'Co-op Worker',
    url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-2',
    label: 'Electrical Specialist',
    category: 'Co-op Worker',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-3',
    label: 'Master Carpenter',
    category: 'Co-op Worker',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-4',
    label: 'Household Member',
    category: 'Client',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-5',
    label: 'Society Admin',
    category: 'Governance',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-6',
    label: 'Appliance Technician',
    category: 'Co-op Worker',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=320&auto=format&fit=crop&q=80',
  },
];

export const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const currentUser = store.getCurrentUser();

  const [activeTab, setActiveTab] = useState<TabMode>('camera');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);

  // Drag & drop file upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Synchronize current user avatar on open
  useEffect(() => {
    if (isOpen && currentUser) {
      setSelectedImage(currentUser.avatarUrl || null);
      setSyncNotice(null);
      setCameraError(null);
      if (activeTab === 'camera') {
        startCamera();
      }
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, currentUser?.id]);

  // Tab change effect: start/stop camera
  useEffect(() => {
    if (activeTab === 'camera' && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [activeTab, facingMode]);

  // 1. Native Camera API implementation
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by this browser environment.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.warn('Video play error:', err);
          });
        };
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera request notice:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser or select an image from your device or presets below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device detected on this system. You can easily upload a photo from your files or pick a cooperative avatar.');
      } else {
        setCameraError(err.message || 'Unable to start camera stream. Please try file upload or preset avatar.');
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = (withCountdown = false) => {
    if (withCountdown) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            executeCapture();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      executeCapture();
    }
  };

  const executeCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      return;
    }

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - minDim) / 2;
    const startY = (video.videoHeight - minDim) / 2;

    ctx.save();
    // Mirror front camera
    if (facingMode === 'user') {
      ctx.translate(320, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 320, 320);
    ctx.restore();

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setSelectedImage(dataUrl);
      stopCamera();
    } catch (e: any) {
      console.warn('Canvas export notice:', e);
    }
  };

  // 2. File Upload & Canvas Compression
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 320, 320);
          setSelectedImage(canvas.toDataURL('image/jpeg', 0.88));
        } else {
          setSelectedImage(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // 3. Apply custom image URL
  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setSelectedImage(customUrlInput.trim());
  };

  // 4. Save to User Profile & Supabase Metadata
  const handleSaveProfilePicture = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setSyncNotice(null);

    const finalUrl = selectedImage || '';

    try {
      // 1. Update local reactive store & bookings
      store.updateUserAvatar(currentUser.id, finalUrl);

      // 2. Save directly to Supabase User Profile Metadata & Database
      const result = await updateUserProfileMetadataInSupabase(
        currentUser.id,
        finalUrl,
        currentUser.role
      );

      setSyncNotice(result.message);
      if (onSaved) {
        onSaved(finalUrl);
      }

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setIsSaving(false);
      setSyncNotice('Saved locally. Supabase will synchronize on next online check.');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  // 5. Remove avatar
  const handleRemoveAvatar = () => {
    setSelectedImage(null);
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
              <Camera className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Profile Picture & Avatar
              </h3>
              <p className="text-xs text-slate-500">
                Camera capture, upload, and Supabase metadata sync
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* User Preview Badge */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white flex items-center justify-between gap-4 border border-slate-800 shadow-xs">
            <div className="flex items-center gap-3.5">
              <Avatar className="w-14 h-14 border-2 border-emerald-400 shadow-md">
                {selectedImage ? (
                  <AvatarImage src={selectedImage} alt={currentUser.fullName} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-emerald-700 text-white font-black text-lg">
                  {currentUser.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{currentUser.fullName}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentUser.locality || 'Bangalore'} • {currentUser.phone || currentUser.email}
                </p>
              </div>
            </div>

            {selectedImage && (
              <button
                onClick={handleRemoveAvatar}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/70 hover:text-rose-300 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Reset to Initials"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[40px] ${
                activeTab === 'camera'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[40px] ${
                activeTab === 'upload'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[40px] ${
                activeTab === 'presets'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[40px] ${
                activeTab === 'url'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>URL</span>
            </button>
          </div>

          {/* TAB 1: LIVE NATIVE CAMERA API */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-bold block text-sm">Camera Notice</span>
                      <p className="leading-relaxed">{cameraError}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={startCamera}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Camera</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-100/60 transition cursor-pointer"
                    >
                      Upload File Instead
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-square max-h-[300px] mx-auto flex items-center justify-center border-2 border-slate-800 shadow-inner">
                  {/* Video Stream Element */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      facingMode === 'user' ? 'scale-x-[-1]' : ''
                    }`}
                  />

                  {/* Circular Face Alignment Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-2 border-dashed border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"></div>
                  </div>

                  {/* Countdown overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                      <span className="text-6xl font-black text-white animate-ping">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {/* Live Status Chip */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Stream Active</span>
                  </div>

                  {/* Camera Flip Button */}
                  <button
                    onClick={toggleCameraFacing}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition border border-white/20 cursor-pointer"
                    title="Flip Camera (Front / Rear)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Camera Shutter Controls */}
              {!cameraError && (
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => capturePhoto(false)}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>
                  <button
                    onClick={() => capturePhoto(true)}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Take photo with 3-second timer"
                  >
                    <span>3s Timer ⏱️</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEVICE UPLOAD & DRAG-AND-DROP */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[200px] ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-50/70'
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/70 bg-slate-50/40'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse or drag & drop photo here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, or WebP (Auto-cropped to high-definition square)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COOPERATIVE PRESET AVATARS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Choose a verified cooperative avatar reflecting your artisan craft or community profile:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedImage === preset.url;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedImage(preset.url)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {preset.label}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {preset.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Enter Direct Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Preview
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                You can paste any hosted image link or CDN profile URL.
              </p>
            </div>
          )}

          {/* Supabase Sync Feedback Banner */}
          {syncNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}

          {/* Offscreen Canvas for Frame Processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Stored in Supabase user metadata</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/80 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfilePicture}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Profile Picture</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
