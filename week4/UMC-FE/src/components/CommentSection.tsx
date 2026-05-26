import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment, updateComment, deleteComment } from '../apis/lp';
import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/auth';

interface CommentSectionProps {
    lpId: string;
    commentsData: any;
}

const CommentSection = ({ lpId, commentsData }: CommentSectionProps) => {
    const queryClient = useQueryClient();
    const { data: currentUser } = useQuery({ 
        queryKey: ['userProfile'], 
        queryFn: getMyInfo
    });
    const [commentText, setCommentText] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    const invalidateComments = () => {
        queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
    };

    const createMutation = useMutation({
        mutationFn: (inputText: string) => postComment(lpId, { content: inputText }),
        onSuccess: () => {
            setCommentText("");
            invalidateComments();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ cId, content }: { cId: number, content: string }) => updateComment(cId, { content }),
        onSuccess: () => {
            setEditingId(null); 
            invalidateComments();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (cId: number) => deleteComment(cId),
        onSuccess: () => invalidateComments()
    });

    return (
        <section className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold mb-6">댓글</h3>
            
            {/* 작성 영역 UI */}
            <div className="mb-8 flex gap-2">
                <input 
                    type="text" 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)} 
                    className="flex-1 border p-2 rounded" 
                    placeholder="따뜻한 댓글을 남겨주세요."
                />
                <button 
                    onClick={() => createMutation.mutate(commentText)}
                    disabled={!commentText.trim() || createMutation.isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    {createMutation.isPending ? "등록 중..." : "등록"}
                </button>
            </div>

            {/* 댓글 목록 렌더링 영역 */}
            <div className="space-y-4">
                {commentsData?.pages.map((page: any) => page.data.map((comment: any) => (
                    <div key={comment.id} className="border-b border-gray-100 py-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">{comment.author.name}</span>
                            
                            {/* 내 댓글일 때만 보이는 수정/삭제 메뉴 */}
                            {currentUser?.data?.id === comment.author.id && (
                                <div className="flex gap-2 text-sm text-gray-500">
                                    <button onClick={() => { setEditingId(comment.id); setEditText(comment.content); }}>수정</button>
                                    <button onClick={() => {
                                        if (window.confirm("정말 삭제하시겠습니까?")) deleteMutation.mutate(comment.id);
                                    }} className="text-red-500">삭제</button>
                                </div>
                            )}
                        </div>

                        {/* 수정 모드와 일반 모드 분기 처리 */}
                        {editingId === comment.id ? (
                            <div className="flex gap-2 mt-2">
                                <input 
                                    value={editText} 
                                    onChange={e => setEditText(e.target.value)} 
                                    className="border flex-1 p-2 rounded" 
                                />
                                <button 
                                    onClick={() => updateMutation.mutate({ cId: comment.id, content: editText })}
                                    className="bg-gray-800 text-white px-3 rounded"
                                >
                                    저장
                                </button>
                                <button 
                                    onClick={() => setEditingId(null)}
                                    className="bg-gray-200 px-3 rounded"
                                >
                                    취소
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-700">{comment.content}</p>
                        )}
                    </div>
                )))}
            </div>
        </section>
    );
};

export default CommentSection;