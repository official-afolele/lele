import React, { useState, useEffect } from 'react';
import { WeddingConfig, GuestItem, WishEntry, GalleryPhoto } from '../types';
import { weddingData, initialGuests } from '../data/weddingData';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/googleScriptCode';
import { normalizeWishList } from '../utils/wishNormalizer';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Copy, 
  Share2, 
  Check, 
  Heart, 
  Calendar, 
  Music, 
  Gift, 
  Users, 
  Search,
  ExternalLink,
  MessageCircle,
  Clock,
  MapPin,
  Camera,
  Download,
  Upload,
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Play,
  Pause,
  Volume2,
  FileAudio,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  MessageSquareHeart,
  RefreshCw,
  Crop,
  Sliders,
  Edit3,
  FileSpreadsheet,
  FileCode,
  CheckCheck,
  Globe,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon
} from 'lucide-react';
import { normalizeImageUrl } from '../utils/imageUrl';
import { validateAdminPassword } from '../utils/auth';
import { PhotoEditorModal, PhotoRole } from './PhotoEditorModal';
import { CoverSection } from './CoverSection';
import { Page2TitleQuote } from './Page2TitleQuote';
import { BrideGroomSection } from './BrideGroomSection';
import { SaveTheDateSection } from './SaveTheDateSection';
import { EventDetailsSection } from './EventDetailsSection';
import { OurGallerySection } from './OurGallerySection';
import { LoveStorySection } from './LoveStorySection';
import { WeddingGiftSection } from './WeddingGiftSection';

// Helper to compress image client-side via canvas (reducing 10MB phone camera images to ~200KB)
const compressImageFile = (file: File, maxDimension = 1200, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format file gambar tidak didukung'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
