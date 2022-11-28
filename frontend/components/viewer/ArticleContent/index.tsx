import Image from 'next/image';
import { useRouter } from 'next/router';

import { useEffect } from 'react';

import axios from 'axios';

import LeftBtnIcon from '@assets/ico_leftBtn.svg';
import Original from '@assets/ico_original.svg';
import RightBtnIcon from '@assets/ico_rightBtn.svg';
import Scrap from '@assets/ico_scrap.svg';
import Content from '@components/common/Content';
import { IArticleBook, IScrap } from '@interfaces';
import { TextLarge } from '@styles/common';

import ArticleButton from './Button';
import {
  ArticleContainer,
  ArticleLeftBtn,
  ArticleMain,
  ArticleRightBtn,
  ArticleTitle,
  ArticleTitleBtnBox,
} from './styled';

interface ArticleProps {
  article: IArticleBook;
  scraps: IScrap[];
  bookId: number;
  handleScrapBtnClick: () => void;
}

const user = {
  id: 1,
  nickname: 'moc1ha',
};

export default function Article({ article, scraps, bookId, handleScrapBtnClick }: ArticleProps) {
  const router = useRouter();
  const handleOriginalBtnOnClick = () => {
    router.push(`/viewer/${article.book_id}/${article.id}`);
  };
  const handleLeftBtnOnClick = () => {
    const prevOrder =
      scraps.filter((scrap: IScrap) => scrap.article.id === article.id)[0].order - 1;
    const prevArticleId = scraps.filter((scrap: IScrap) => scrap.order === prevOrder)[0].article.id;
    router.push(`/viewer/${bookId}/${prevArticleId}`);
  };
  const handleRightBtnOnClick = () => {
    const nextOrder =
      scraps.filter((scrap: IScrap) => scrap.article.id === article.id)[0].order + 1;
    const nextArticleId = scraps.filter((scrap: IScrap) => scrap.order === nextOrder)[0].article.id;
    router.push(`/viewer/${bookId}/${nextArticleId}`);
  };
  const handleDeleteBtnOnClick = () => {
    if (window.confirm('해당 글을 삭제하시겠습니까?')) {
      axios
        .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/articles/${article.id}`)
        .catch((err) => {
          // 추후 에러 핸들링 추가 예정
          console.log(err);
        });

      router.push('/');
    }
  };

  const checkArticleAuthority = (id: number) => {
    if (scraps.find((v: IScrap) => v.article.id === id)) {
      return true;
    }
    // alert 두번뜨는 현상...
    // 404 페이지로 처리? 고민 중
    // alert('잘못된 접근입니다.');
    router.push('/');
    return false;
  };

  useEffect(() => {
    checkArticleAuthority(article.id);
  }, []);

  return (
    <ArticleContainer>
      {article.id === scraps.at(0)?.article.id ? null : (
        <ArticleLeftBtn onClick={handleLeftBtnOnClick}>
          <Image src={LeftBtnIcon} alt="Viewer Icon" />
        </ArticleLeftBtn>
      )}
      {!article.deleted_at ? (
        <ArticleMain>
          <ArticleTitle>
            {/* Global style Large의 크기가 너무 작음 -> 월요일 회의 후 반영 */}
            <TextLarge>{article.title}</TextLarge>
            <ArticleTitleBtnBox>
              {article.book.user.nickname === user.nickname ? (
                <ArticleButton onClick={handleDeleteBtnOnClick}>삭제</ArticleButton>
              ) : (
                <ArticleButton onClick={handleOriginalBtnOnClick}>
                  <Image src={Original} alt="Original Icon" width={20} height={15} />
                  원본 글 보기
                </ArticleButton>
              )}
              <ArticleButton onClick={handleScrapBtnClick}>
                <Image src={Scrap} alt="Scrap Icon" width={20} height={15} />
                스크랩
              </ArticleButton>
            </ArticleTitleBtnBox>
          </ArticleTitle>
          <Content content={article.content} />
        </ArticleMain>
      ) : (
        <ArticleMain>삭제된 글입니다.</ArticleMain>
      )}
      {article.id === scraps.at(-1)?.article.id ? null : (
        <ArticleRightBtn onClick={handleRightBtnOnClick}>
          <Image src={RightBtnIcon} alt="Viewer Icon" />
        </ArticleRightBtn>
      )}
    </ArticleContainer>
  );
}
