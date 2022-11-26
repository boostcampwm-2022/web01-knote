import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';

import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { tags } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { createImageApi } from '@apis/imageApi';
import articleState from '@atoms/article';
import Content from '@components/common/Content';
import useFetch from '@hooks/useFetch';
import useInput from '@hooks/useInput';

import { CodeMirrorWrapper, EditorInner, EditorWrapper, TitleInput } from './styled';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
});

export default function Editor() {
  const { data: imagePath, execute: createImage } = useFetch(createImageApi);

  const [article, setArticle] = useRecoilState(articleState);

  const [content, setContent] = useState('');
  const [height, setHeight] = useState(0);

  const title = useInput();

  const theme = createTheme({
    theme: 'light',
    settings: {
      background: '#ffffff',
      foreground: '#222222',
      fontFamily: 'Noto Sans KR',
    },
    styles: [
      {
        tag: tags.heading1,
        'font-size': '24px',
        'font-weight': '700',
      },
      {
        tag: tags.heading2,
        'font-size': '20px',
        'font-weight': '700',
      },
      {
        tag: tags.heading3,
        'font-size': '16px',
        'font-weight': '700',
      },
    ],
  });

  useEffect(() => {
    setHeight(window.innerHeight - 68);
  }, []);

  useEffect(() => {
    setArticle({
      ...article,
      title: title.value,
    });
  }, [title.value]);

  useEffect(() => {
    setArticle({
      ...article,
      content: unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(content)
        .toString(),
    });
  }, [content]);

  useEffect(() => {
    console.log(imagePath);
  }, [imagePath]);

  const handleImagePaste = (event: ClipboardEvent) => {
    if (!event.clipboardData) return;

    const { items } = event.clipboardData;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of items) {
      if (item.kind === 'file' && /image\/[png,jpg,jpeg,gif]/.test(item.type)) {
        const blob = item.getAsFile();

        const formData = new FormData();

        formData.append('image', blob);

        createImage(formData);
      }
    }
  };

  return (
    <EditorWrapper style={{ height }}>
      <EditorInner>
        <TitleInput placeholder="제목을 입력해주세요" {...title} />
        <CodeMirrorWrapper>
          <CodeMirror
            value={content}
            onChange={(value) => setContent(value)}
            theme={theme}
            extensions={[
              markdown({
                base: markdownLanguage,
                codeLanguages: languages,
              }),
            ]}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightSelectionMatches: false,
              highlightActiveLine: false,
            }}
            placeholder="내용을 입력해주세요"
            onPasteCapture={(event) => handleImagePaste(event)}
          />
        </CodeMirrorWrapper>
      </EditorInner>
      <EditorInner>
        <Content title={article.title} content={article.content} />
      </EditorInner>
    </EditorWrapper>
  );
}
