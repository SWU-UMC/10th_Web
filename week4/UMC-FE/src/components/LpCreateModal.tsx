import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLp } from '../apis/lp';

interface Props {
    onClose: () => void;
}

const LpCreateModal = ({ onClose }: Props) => {
    const queryClient = useQueryClient();
    const modalRef = useRef<HTMLDivElement>(null);
    
    // 상태 관리
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    // 외부 영역 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // 태그 추가/삭제 로직
    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };
    
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const createLpMutation = useMutation({
        mutationFn: (payload: any) => postLp(payload),
        onSuccess: () => {
            alert('LP가 성공적으로 생성되었습니다!');
            queryClient.invalidateQueries({ queryKey: ['lps'] }); // 목록 새로고침
            onClose(); 
        },
    });

    const handleSubmit = () => {
        // 유효성 검사
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요!");
            return;
        }

        const payload = {
            title: title,
            content: content,
            thumbnail: image ? "https://example.com/uploaded-image.png" : "https://example.com/default.png",
            tags: tags, 
            published: true 
        };

        createLpMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">LP 작성하기</h2>
                    <button onClick={onClose} className="text-gray-500 font-bold">X</button>
                </div>
                
                <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mb-4 w-full" />
                <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 mb-2" />
                <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} className="w-full border p-2 mb-2" />
                
                {/* 태그 입력 UI */}
                <div className="flex gap-2 mb-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="태그 입력" className="border p-2 flex-1" />
                    <button onClick={handleAddTag} className="bg-gray-200 px-4 rounded">추가</button>
                </div>
                
                {/* 추가된 태그 리스트 UI */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                            {tag} <button onClick={() => handleRemoveTag(tag)} className="text-red-500 font-bold text-xs">x</button>
                        </span>
                    ))}
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={createLpMutation.isPending}
                    className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
                >
                    {createLpMutation.isPending ? '업로드 중...' : 'Add LP'}
                </button>
            </div>
        </div>
    );
};

export default LpCreateModal;