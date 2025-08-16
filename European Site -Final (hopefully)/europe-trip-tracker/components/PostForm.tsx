'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationPicker, LocationInfo } from '@/components/LocationPicker';
import { postWithMediaSchema, PostWithMediaInput } from '@/lib/validations';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { MapPin, Calendar, Upload, X, GripVertical } from 'lucide-react';
import { exifr } from 'exifr';

interface PostFormProps {
  initialData?: PostWithMediaInput & { id?: string };
  onSubmit: (data: PostWithMediaInput) => Promise<void>;
  isSubmitting?: boolean;
}

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  cldId: string;
  width?: number;
  height?: number;
  duration?: number;
  order: number;
  file?: File;
  preview?: string;
}

export function PostForm({ initialData, onSubmit, isSubmitting }: PostFormProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploadSignature, setUploadSignature] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostWithMediaInput>({
    resolver: zodResolver(postWithMediaSchema),
    defaultValues: {
      title: initialData?.title || '',
      caption: initialData?.caption || '',
      bodyMD: initialData?.bodyMD || '',
      takenAt: initialData?.takenAt || new Date(),
      status: initialData?.status || 'DRAFT',
      ...initialData,
    },
  });

  const watchedValues = watch();

  // Load initial media if editing
  useEffect(() => {
    if (initialData?.media) {
      setMedia(initialData.media.map((item, index) => ({
        ...item,
        order: index,
        preview: getCloudinaryUrl(item.cldId, { width: 200, height: 200 }),
      })));
    }
  }, [initialData]);

  // Get upload signature
  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await fetch('/api/upload-signature');
        const signature = await response.json();
        setUploadSignature(signature);
      } catch (error) {
        console.error('Failed to fetch upload signature:', error);
      }
    };
    fetchSignature();
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    const draft = {
      ...watchedValues,
      media: media.map(({ file, preview, ...item }) => item),
    };
    localStorage.setItem('post-draft', JSON.stringify(draft));
  }, [watchedValues, media]);

  const handleFileSelect = async (files: FileList) => {
    if (!uploadSignature) return;

    const newMedia: MediaItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      
      // Extract EXIF data for images
      let exifData: any = {};
      if (!isVideo) {
        try {
          exifData = await exifr.parse(file);
        } catch (error) {
          console.log('EXIF extraction failed:', error);
        }
      }

      const mediaItem: MediaItem = {
        id: `temp-${Date.now()}-${i}`,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        cldId: '',
        width: exifData?.ImageWidth,
        height: exifData?.ImageHeight,
        duration: isVideo ? undefined : undefined, // Would need video metadata
        order: media.length + i,
        file,
        preview: URL.createObjectURL(file),
      };

      newMedia.push(mediaItem);
    }

    setMedia(prev => [...prev, ...newMedia]);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadSignature.uploadPreset);
    formData.append('timestamp', uploadSignature.timestamp.toString());
    formData.append('signature', uploadSignature.signature);
    formData.append('api_key', uploadSignature.apiKey);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${uploadSignature.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result.public_id;
  };

  const handleSubmitForm = async (data: PostWithMediaInput) => {
    if (media.length === 0) {
      alert('Please add at least one media file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload media files
      const uploadedMedia = await Promise.all(
        media.map(async (item, index) => {
          if (item.file) {
            setUploadProgress((index / media.length) * 100);
            const cldId = await uploadToCloudinary(item.file);
            return {
              ...item,
              cldId,
              order: index,
            };
          }
          return {
            ...item,
            order: index,
          };
        })
      );

      // Remove temporary fields
      const cleanMedia = uploadedMedia.map(({ file, preview, ...item }) => item);

      const postData: PostWithMediaInput = {
        ...data,
        media: cleanMedia,
      };

      await onSubmit(postData);
      
      // Clear draft
      localStorage.removeItem('post-draft');
      
    } catch (error) {
      console.error('Failed to submit post:', error);
      alert('Failed to submit post. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeMedia = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  const reorderMedia = (fromIndex: number, toIndex: number) => {
    setMedia(prev => {
      const newMedia = [...prev];
      const [removed] = newMedia.splice(fromIndex, 1);
      newMedia.splice(toIndex, 0, removed);
      return newMedia.map((item, index) => ({ ...item, order: index }));
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Give your post a title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              {...register('caption')}
              placeholder="Write a caption for your post..."
              rows={3}
            />
            {errors.caption && (
              <p className="text-red-500 text-sm mt-1">{errors.caption.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bodyMD">Body (Markdown)</Label>
            <Textarea
              id="bodyMD"
              {...register('bodyMD')}
              placeholder="Write the full story of your adventure..."
              rows={6}
            />
            {errors.bodyMD && (
              <p className="text-red-500 text-sm mt-1">{errors.bodyMD.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="takenAt">Date Taken</Label>
            <Input
              id="takenAt"
              type="datetime-local"
              {...register('takenAt', { valueAsDate: true })}
            />
            {errors.takenAt && (
              <p className="text-red-500 text-sm mt-1">{errors.takenAt.message}</p>
            )}
          </div>

          <div>
            <Label>Location</Label>
            <LocationPicker
              value={watchedValues.latitude && watchedValues.longitude ? {
                latitude: watchedValues.latitude,
                longitude: watchedValues.longitude,
                city: watchedValues.city,
                country: watchedValues.country,
              } : undefined}
              onChange={(location) => {
                if (location) {
                  setValue('latitude', location.latitude);
                  setValue('longitude', location.longitude);
                  setValue('city', location.city);
                  setValue('country', location.country);
                } else {
                  setValue('latitude', undefined);
                  setValue('longitude', undefined);
                  setValue('city', undefined);
                  setValue('country', undefined);
                }
              }}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              className="w-full p-2 border rounded-md"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Photos & Videos
              </Button>
            </div>

            {media.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.map((item, index) => (
                  <div key={item.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border">
                      {item.preview ? (
                        <img
                          src={item.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Loading...</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {item.type}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeMedia(item.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex-1"
        >
          {isSubmitting || isUploading ? 'Saving...' : 'Save Post'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
