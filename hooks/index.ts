import { useSession } from '../lib/auth/auth-client';
import { useState, useRef, useCallback } from 'react';
import type { Attachment } from 'ai';

export const useAuthResult = ({ initialAuthResult, getAuthResult }: any) => {
  return initialAuthResult;
};

export const useCommand = () => {
  return {};
};

export const useChatInputMethods = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [disabled, setDisabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submitForm();
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newAttachments = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      contentType: file.type,
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = useCallback((url: string) => {
    setAttachments(prev => prev.filter(a => a.url !== url));
  }, []);

  const submitForm = useCallback(() => {
    console.log('Submit form');
  }, []);

  return {
    attachments,
    disabled,
    fileInputRef,
    textareaRef,
    handleKeyDown,
    handleFileChange,
    removeAttachment,
    submitForm,
    setAttachments,
    setDisabled
  };
};

export * from '../lib/auth/auth-client';
