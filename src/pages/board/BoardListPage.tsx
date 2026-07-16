import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { resolveBoard } from '@/features/board/types';
import { usePostsQuery } from '@/features/board/hooks/usePostQuery';
import { PostCard } from '@/features/board/components/PostCard';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function BoardListPage() {
  const { boardType: slug } = useParams();
  const board = resolveBoard(slug);

  const [page, setPage] = useState(0);
  // TODO: 카테고리 버튼 UI — 선택 시 category state를 usePostsQuery로 전달(전체=undefined).

  // 훅 규칙상 조건부 return 이전에 모든 훅 호출. board 없으면 enabled=false로 조회 스킵.
  const { data, isLoading, error } = usePostsQuery(
    { boardType: board?.boardType ?? '', page },
    !!board,
  );

  // 게시판 전환 시 페이지 초기화
  useEffect(() => setPage(0), [board?.boardType]);

  if (!board) return <NotFoundPage />;

  return (
    <div className='mx-auto max-w-6xl px-6 py-14'>
      <h1 className='mb-8 text-3xl font-bold text-foreground'>{board.label}</h1>

      {isLoading && (
        <p className='py-20 text-center text-muted-foreground'>불러오는 중…</p>
      )}
      {error && (
        <p className='py-20 text-center text-destructive'>
          목록을 불러오지 못했습니다.
        </p>
      )}

      {data && data.content.length === 0 && (
        <p className='py-20 text-center text-muted-foreground'>
          아직 게시글이 없습니다.
        </p>
      )}

      {data && data.content.length > 0 && (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {data.content.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>

          {/* 간단 페이지네이션 — PageResponse.hasPrevious/hasNext 기반 */}
          <div className='mt-10 flex items-center justify-center gap-4'>
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!data.hasPrevious}
              className='rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40'
            >
              이전
            </button>
            <span className='text-sm text-muted-foreground'>
              {data.page + 1} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.hasNext}
              className='rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40'
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
